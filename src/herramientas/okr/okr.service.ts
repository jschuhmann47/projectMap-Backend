import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'
import { getParentsFromNode } from 'src/project/orgChart'
import { ProjectService } from 'src/project/project.service'
import { getStatusFromFrequencyAndHorizon } from '../frequency'
import { Horizon } from '../horizon'
import { addDateByFrequency, dateToString } from './dates'
import {
    ChecklistKeyStatusDto,
    KeyResultDto,
    KeyStatusDto,
    OkrDto,
    OkrType,
} from './okr.dto'
import {
    ChecklistKeyResult,
    ChecklistKeyStatus,
    KeyResult,
    KeyStatus,
    limitBetween,
    Okr,
} from './okr.schema'
import mongoose from 'mongoose'

@Injectable()
export class OkrService {
    constructor(
        @InjectModel(Okr.name) private okrModel: Model<Okr>,
        @InjectConnection() private connection: Connection,
        private projectService: ProjectService
    ) {}

    async create(okrDto: OkrDto) {
        if (okrDto.horizon > Horizon.YEAR) {
            throw new HttpException('Invalid horizon', HttpStatus.BAD_REQUEST)
        }
        const orgChart = await this.projectService.getChart(okrDto.projectId)
        // the project must have a chart if we want the OKR to have an area
        if (!orgChart && okrDto.areaId) {
            throw new HttpException(
                'Invalid project id',
                HttpStatus.BAD_REQUEST
            )
        }
        if (okrDto.areaId) {
            const areasWithMatchingId = orgChart.nodes.filter(
                (a) => a.id === okrDto.areaId
            )
            if (areasWithMatchingId.length == 0) {
                throw new HttpException('Invalid area', HttpStatus.BAD_REQUEST)
            }
            okrDto.area = areasWithMatchingId[0].data.label
        } else {
            okrDto.area = 'Sin área'
        }
        const okr = new this.okrModel(okrDto)
        return okr.save()
    }

    async findById(okrId: string) {
        return this.okrModel
            .findById(okrId)
            .populate({
                path: 'childOkrs',
                model: 'Okr',
                select: '-childOkrs',
            })
            .exec()
    }

    async getAllByProjectId(projectId: string) {
        return this.okrModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async editOkr(okrId: string, okrDto: OkrDto) {
        const okr = await this.okrModel.findById(okrId).exec()
        if (!okr) {
            throw new NotFoundException()
        }

        okr.area = okrDto.area
        okr.description = okrDto.description

        return new this.okrModel(okr).save()
    }

    async getPossibleOkrsFromParent(okrId: string, withChilds: boolean) {
        const okr = await this.okrModel.findById(okrId).exec()
        if (!okr) {
            throw new NotFoundException()
        }
        const project = (await this.projectService.getOne(okr.projectId))!
        // I say to add validation: cannot add two areas with same name -> name unique, otherwise this will get more than one
        const areaNode = project.chart.nodes.find(
            (n) => n.data.label == okr.area
        )
        if (!areaNode) {
            return []
        }
        const parent = getParentsFromNode(areaNode.id, project.chart)
            .map((n) => n.data.label)
            .at(0)
        if (!parent) {
            return []
        }
        let query = this.okrModel.find({
            projectId: okr.projectId,
            area: parent,
        })
        if (!withChilds) {
            query = query.select('-childOkrs')
        } else {
            query = query.populate({
                path: 'childOkrs',
                model: 'Okr',
                select: '-childOkrs',
            })
        }
        return await query
    }

    async addParentOkr(okrId: string, parentOkrId: string) {
        const parentOkr = await this.okrModel.findById(parentOkrId).exec()
        if (!parentOkr) {
            throw new NotFoundException()
        }
        const childOkr = await this.okrModel.findOne({
            _id: okrId,
            projectId: parentOkr.projectId,
        })
        if (!childOkr) {
            throw new NotFoundException()
        }
        if (parentOkr.keyResults.length > 0) {
            throw new BadRequestException('Parent has key results')
        }
        parentOkr.childOkrs.push(childOkr)
        parentOkr.save()
    }

    async addKeyResult(okrId: string, keyResultDto: KeyResultDto) {
        const okr = await this.okrModel.findById(okrId).exec()
        if (!okr) {
            throw new NotFoundException()
        }
        if (okr.childOkrs.length > 0) {
            throw new BadRequestException('Cannot add KRs to parent OKR')
        }
        switch (keyResultDto.type as OkrType) {
            case OkrType.NORMAL:
                okr.keyResults.push(this.createKeyResult(okr, keyResultDto))
                break
            case OkrType.CHECKLIST:
                okr.checklistKeyResults.push(
                    this.createChecklistKeyResult(okr, keyResultDto)
                )
                break
            default:
                // TODO: when frontend sends type, delete this default case
                okr.keyResults.push(this.createKeyResult(okr, keyResultDto))
                // throw new BadRequestException('Invalid key result type')
                break
        }
        return this.updateChildAndParent(this.connection, okr)
    }

    async editKeyResult(
        okrId: string,
        keyResultId: string,
        keyResultDto: KeyResultDto
    ) {
        const okr = await this.okrModel.findById(okrId).exec()
        if (!okr) {
            throw new NotFoundException()
        }
        okr.keyResults
            .filter((kr) => kr._id.toString() == keyResultId)
            .forEach((kr) => updateNormalKeyResult(kr, keyResultDto))

        okr.checklistKeyResults
            .filter((chckKr) => chckKr._id.toString() == keyResultId)
            .forEach((chckKr) => updateChecklistKeyResult(chckKr, keyResultDto))

        return this.updateChildAndParent(this.connection, okr)
    }

    async removeKeyResult(okrId: string, keyResultId: string) {
        const okr = await this.okrModel.findById(okrId).exec()
        if (!okr) {
            throw new NotFoundException()
        }

        okr.keyResults = okr.keyResults.filter(
            (keyResult) => keyResult._id.toString() != keyResultId
        )

        return this.updateChildAndParent(this.connection, okr)
    }

    async delete(id: string) {
        const parentOkr = await this.getPossibleOkrsFromParent(id, true)
        parentOkr.forEach((p) => {
            p.childOkrs = p.childOkrs.filter((o) => o._id.toString() != id)
            p.save()
        })

        const result = await this.okrModel.deleteOne({ _id: id })
        if (result.deletedCount) {
            return id
        } else {
            throw new HttpException('Okr not found', HttpStatus.NOT_FOUND)
        }
    }

    async updateMissingAreas(projectId: string, deletedAreas: string[]) {
        const okrs = await this.getAllByProjectId(projectId)
        okrs.forEach((okr) => {
            if (deletedAreas.some((a) => a == okr.area)) {
                okr.area = 'Sin área'
                okr.save()
            }
        })
    }

    private createKeyResult(okr: Okr, keyResultDto: KeyResultDto) {
        const keyStatusData = getStatusFromFrequencyAndHorizon(
            keyResultDto.frequency,
            okr.horizon
        )
        if (keyStatusData.invalid) {
            throw new HttpException(
                'Invalid frequency or horizon',
                HttpStatus.BAD_REQUEST
            )
        }
        const keyStatus: KeyStatus[] = []
        for (let i = 0; i < keyStatusData.lengthOfPeriods!; i++) {
            const newDate = addDateByFrequency(
                okr.startingDate,
                keyResultDto.frequency,
                i
            )
            const stringDate = dateToString(newDate)
            keyStatus.push(new KeyStatus(stringDate, 0))
        }

        return new KeyResult(
            keyResultDto.description,
            keyResultDto.responsible,
            keyResultDto.baseline,
            keyResultDto.goal,
            keyResultDto.frequency,
            keyResultDto.priority,
            keyStatus
        )
    }

    private createChecklistKeyResult(okr: Okr, keyResultDto: KeyResultDto) {
        const keyStatus: ChecklistKeyStatus[] = []
        keyResultDto.keyStatus.forEach((checkKr) => {
            const kr = checkKr as ChecklistKeyStatusDto
            keyStatus.push(new ChecklistKeyStatus(kr.description, kr.checked))
        })

        return new ChecklistKeyResult(
            keyResultDto.description,
            keyResultDto.responsible,
            keyResultDto.baseline,
            keyStatus
        )
    }

    private async updateParentInformation(childOkrId: string) {
        const okrs = await this.getPossibleOkrsFromParent(childOkrId, true)
        okrs.filter((o) =>
            o.childOkrs.some((child) => child._id.toString() == childOkrId)
        ).forEach((o) => {
            o.priority = Math.round(
                o.childOkrs
                    .map((kr) => kr.priority)
                    .reduce((a, b) => a + b, 0) / o.childOkrs.length
            )
            const progress = Math.round(
                o.childOkrs
                    .map((kr) => kr.progress)
                    .reduce((a, b) => a + b, 0) / o.childOkrs.length
            )
            o.progress = limitBetween(progress, 0, 100)
            o.save()
        })
    }
    /**
     * Updates child in DB, triggering update to its parent if it has any,
       all using a transaction. Returns the child okr after `.save()`
     * @param connection
     * @param okr
     */
    private async updateChildAndParent(
        connection: Connection,
        okr: mongoose.Document<mongoose.Types.ObjectId, object, Okr>
    ) {
        const transactionSession = await connection.startSession()
        return transactionSession.withTransaction(async () => {
            const res = await okr.save()
            await this.updateParentInformation(okr._id.toString())
            return res
        })
    }
}

const updateNormalKeyResult = (
    keyResult: KeyResult,
    keyResultDto: KeyResultDto
) => {
    updateBaseKeyResult(keyResult, keyResultDto)
    if (keyResultDto.baseline !== undefined)
        keyResult.baseline = keyResultDto.baseline
    if (keyResultDto.goal !== undefined) keyResult.goal = keyResultDto.goal
    // frequency cannot be edited
    if (keyResultDto.keyStatus)
        keyResultDto.keyStatus.forEach((status, index) => {
            const newStatus = status as KeyStatusDto
            keyResult.keyStatus[index].value = newStatus.value
        })
}

const updateBaseKeyResult = (
    keyResult: KeyResult | ChecklistKeyResult,
    keyResultDto: KeyResultDto
) => {
    if (keyResultDto.description)
        keyResult.description = keyResultDto.description
    if (keyResultDto.responsible)
        keyResult.responsible = keyResultDto.responsible
    if (keyResultDto.priority !== undefined)
        keyResult.priority = keyResultDto.priority
}

const updateChecklistKeyResult = (
    keyResult: ChecklistKeyResult,
    keyResultDto: KeyResultDto
) => {
    updateBaseKeyResult(keyResult, keyResultDto)
    if (keyResultDto.keyStatus)
        keyResultDto.keyStatus.forEach((status, index) => {
            const newStatus = status as ChecklistKeyStatusDto
            keyResult.keyStatus[index].checked = newStatus.checked
        })
}
