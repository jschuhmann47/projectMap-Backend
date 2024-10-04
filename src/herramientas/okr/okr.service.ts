import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { KeyResultDto, OkrDto } from './okr.dto'
import { KeyResult, KeyStatus, Okr } from './okr.schema'
import { getStatusFromFrequencyAndHorizon } from '../frequency'
import { Horizon } from '../horizon'
import { ProjectService } from 'src/project/project.service'
import { addDateByFrequency, dateToString } from './dates'

@Injectable()
export class OkrService {
    constructor(
        @InjectModel(Okr.name) private okrModel: Model<Okr>,
        private projectService: ProjectService
    ) {}

    async create(okrDto: OkrDto) {
        if (okrDto.horizon > Horizon.YEAR) {
            throw new HttpException('Invalid horizon', HttpStatus.BAD_REQUEST)
        }
        const orgChart = await this.projectService.getChart(okrDto.projectId)
        if (!orgChart) {
            throw new HttpException(
                'Invalid project id',
                HttpStatus.BAD_REQUEST
            )
        }
        const areasWithMatchingId = orgChart.nodes.filter(
            (a) => a.id === okrDto.areaId
        )
        if (areasWithMatchingId.length == 0) {
            throw new HttpException('Invalid area', HttpStatus.BAD_REQUEST)
        }
        okrDto.area = areasWithMatchingId[0].data.label
        const okr = new this.okrModel(okrDto)
        return okr.save()
    }

    async findById(okrId: string) {
        return this.okrModel.findById(okrId).exec()
    }

    async getAllByProjectId(projectId: string) {
        return this.okrModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async editOkr(okrId: string, okrDto: OkrDto) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        okr.area = okrDto.area
        okr.description = okrDto.description

        return new this.okrModel(okr).save()
    }

    async addKeyResult(okrId: string, keyResultDto: KeyResultDto) {
        const okr = await this.okrModel.findById(okrId).exec()

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
        for (let i = 0; i < keyStatusData.lengthOfPeriods; i++) {
            const newDate = addDateByFrequency(
                okr.startingDate,
                keyResultDto.frequency,
                i
            )
            const stringDate = dateToString(newDate)
            keyStatus.push(new KeyStatus(stringDate, 0))
        }

        const keyResult = new KeyResult(
            keyResultDto.description,
            keyResultDto.responsible,
            keyResultDto.baseline,
            keyResultDto.goal,
            keyResultDto.frequency,
            keyResultDto.priority,
            keyStatus
        )

        keyResult.keyStatus = keyStatus

        okr.keyResults.push(keyResult)

        return okr.save()
    }

    async editKeyResult(
        okrId: string,
        keyResultId: string,
        keyResultDto: KeyResultDto
    ) {
        const okr = await this.okrModel.findById(okrId).exec()

        okr.keyResults.forEach((keyResult) => {
            if (keyResult._id.toString() == keyResultId) {
                if (keyResultDto.description)
                    keyResult.description = keyResultDto.description

                if (keyResultDto.responsible)
                    keyResult.responsible = keyResultDto.responsible

                if (keyResultDto.baseline !== undefined)
                    keyResult.baseline = keyResultDto.baseline

                if (keyResultDto.goal !== undefined)
                    keyResult.goal = keyResultDto.goal

                if (keyResultDto.priority !== undefined)
                    keyResult.priority = keyResultDto.priority

                // frequency cannot be edited

                if (keyResultDto.keyStatus)
                    keyResultDto.keyStatus.forEach(
                        (status, index) =>
                            (keyResult.keyStatus[index].value = status.value)
                    )
            }
        })

        return okr.save()
    }

    async removeKeyResult(okrId: string, keyResultId: string) {
        const okr = await this.okrModel.findById(okrId).exec()

        okr.keyResults = okr.keyResults.filter(
            (keyResult) => keyResult._id.toString() != keyResultId
        )

        return okr.save()
    }

    async delete(id: string) {
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
}
