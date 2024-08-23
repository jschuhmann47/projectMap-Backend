import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { KeyResultDto, KeyStatusDto, OkrDto } from './okr.dto'
import { KeyResult, KeyStatus, Okr } from './okr.schema'

@Injectable()
export class OkrService {
    constructor(@InjectModel(Okr.name) private okrModel: Model<Okr>) {}

    async create(okrProjectDto: OkrDto) {
        const okrProject = new this.okrModel(okrProjectDto)
        return okrProject.save()
    }

    async findById(okrProjectId: string) {
        return this.okrModel.findById(okrProjectId).exec()
    }

    async findOkrById(okrId: string) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        // const okr = okrProject.okrs.find((okr) => okr._id.toString() == okrId)

        return okrProject
    }

    async getAllByProjectId(projectId: string) {
        return this.okrModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    // async findGlobalOkrById(okrProjectId: string, okrId: string) {
    //     const okrProject: Okr = await this.okrModel
    //         .findById(okrProjectId)
    //         .exec()

    //     const okr = okrProject.okrs.find((okr) => okr._id.toString() == okrId)

    //     const relatedOkrs = okrProject.okrs.filter(
    //         (okr) => okr.globalOkr == okrId
    //     )

    //     const progress =
    //         relatedOkrs.map((okr) => okr.progress).reduce((x, y) => x + y) /
    //         relatedOkrs.length

    //     const statusPerMonth: Map<string, number> = new Map()

    //     relatedOkrs.forEach((okr) =>
    //         okr.keyResults.forEach((kr) =>
    //             kr.keyStatus.forEach((ks) => {
    //                 const status = statusPerMonth.get(ks.month)
    //                 if (status) statusPerMonth.set(ks.month, status + ks.value)
    //                 else statusPerMonth.set(ks.month, ks.value)
    //             })
    //         )
    //     )

    //     const keyStatus = []
    //     statusPerMonth.forEach((progress, month) =>
    //         keyStatus.push(new KeyStatusDto(month, progress))
    //     )

    //     return new GlobalOkrDto(
    //         okrId,
    //         okr.description,
    //         keyStatus,
    //         progress,
    //         okr.area
    //     )
    // }

    // async addOkr(okrProjectId: string, okrDto: OkrDto) {
    //     const okrProject: Okr = await this.okrModel
    //         .findById(okrProjectId)
    //         .exec()

    //     const okr = new Okr(
    //         okrDto.description,
    //         okrDto.area,
    //         okrDto.globalOkr,
    //         okrDto.quarter
    //     )

    //     if (okrDto.keyResults) {
    //         const keyResults = okrDto.keyResults.map((keyResultDto) => {
    //             const keyStatuses = keyResultDto.keyStatus.map(
    //                 (keyStatusDto) =>
    //                     new KeyStatus(keyStatusDto.month, keyStatusDto.value)
    //             )
    //             const keyResult = new KeyResult(
    //                 keyResultDto.description,
    //                 keyResultDto.goal,
    //                 keyResultDto.responsible,
    //                 keyResultDto.priority
    //             )
    //             keyResult.keyStatus = keyStatuses
    //             return keyResult
    //         })
    //         okr.keyResults = keyResults
    //     }

    //     okrProject.okrs.push(okr)

    //     return new this.okrModel(okrProject).save()
    // }

    async editOkr(okrId: string, okrDto: OkrDto) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        okrProject.area = okrDto.area
        okrProject.description = okrDto.description

        return new this.okrModel(okrProject).save()
    }

    // check
    async removeOkr(okrId: string) {
        this.okrModel
            .deleteOne({ _id: okrId })
            .then(() => {})
            .catch((err) => err)
    }

    async addKeyResult(okrId: string, keyResultDto: KeyResultDto) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        const keyStatuses = keyResultDto.keyStatus.map(
            (keyStatusDto) =>
                new KeyStatus(keyStatusDto.period, keyStatusDto.value)
        )
        const keyResult = new KeyResult(
            keyResultDto.description,
            keyResultDto.goal,
            keyResultDto.responsible,
            keyResultDto.priority
        )

        keyResult.keyStatus = keyStatuses

        okrProject.keyResults.push(keyResult)

        return new this.okrModel(okrProject).save()
    }

    async editKeyResult(
        okrId: string,
        keyResultId: string,
        keyResultDto: KeyResultDto
    ) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        okrProject.keyResults.forEach((keyResult) => {
            if (keyResult._id.toString() == keyResultId) {
                if (keyResultDto.description)
                    keyResult.description = keyResultDto.description

                if (keyResultDto.goal) keyResult.goal = keyResultDto.goal
                if (keyResultDto.responsible)
                    keyResult.responsible = keyResultDto.responsible
                if (keyResultDto.priority)
                    keyResult.priority = keyResultDto.priority
                if (keyResultDto.keyStatus)
                    keyResultDto.keyStatus.forEach(
                        (status, index) =>
                            (keyResult.keyStatus[index].value = status.value)
                    )
            }
        })

        return new this.okrModel(okrProject).save()
    }

    async removeKeyResult(okrId: string, keyResultId: string) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        okrProject.keyResults = okrProject.keyResults.filter(
            (keyResult) => keyResult._id.toString() != keyResultId
        )

        return new this.okrModel(okrProject).save()
    }

    async addKeyStatus(
        okrProjectId: string,
        okrId: string,
        keyResultId: string,
        keyStatusDto: KeyStatusDto
    ) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        const keyResult = okrProject.keyResults.find(
            (kr) => kr._id.toString() == keyResultId
        )

        const keystatus = new KeyStatus(keyStatusDto.period, keyStatusDto.value)
        keyResult.keyStatus.push(keystatus)

        return new this.okrModel(okrProject).save()
    }

    async editKeyStatus(
        okrProjectId: string,
        okrId: string,
        keyResultId: string,
        keyStatusId: string,
        keyStatusDto: KeyStatusDto
    ) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        const keyResult = okrProject.keyResults.find(
            (kr) => kr._id.toString() == keyResultId
        )

        keyResult.keyStatus.forEach((keyStatus) => {
            if (keyStatus._id.toString() == keyStatusId) {
                keyStatus.period = keyStatusDto.period
                keyStatus.value = keyStatusDto.value
            }
        })

        return new this.okrModel(okrProject).save()
    }

    // think that this is not needed anymore
    async removeKeyStatus(
        okrProjectId: string,
        okrId: string,
        keyResultId: string,
        keyStatusId: string
    ) {
        const okrProject: Okr = await this.okrModel.findById(okrId).exec()

        const keyResult = okrProject.keyResults.find(
            (kr) => kr._id.toString() == keyResultId
        )

        keyResult.keyStatus.filter((ks) => ks._id.toString() != keyStatusId)

        return new this.okrModel(okrProject).save()
    }

    async delete(id: string) {
        const result = await this.okrModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else
            throw new HttpException(
                'Okr Project not found',
                HttpStatus.NOT_FOUND
            )
    }
}
