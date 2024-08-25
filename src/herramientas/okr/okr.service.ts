import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { KeyResultDto, KeyStatusDto, OkrDto } from './okr.dto'
import { KeyResult, KeyStatus, Okr } from './okr.schema'

@Injectable()
export class OkrService {
    constructor(@InjectModel(Okr.name) private okrModel: Model<Okr>) {}

    async create(okrDto: OkrDto) {
        const okr = new this.okrModel(okrDto)
        return okr.save()
    }

    async findById(okrId: string) {
        return this.okrModel.findById(okrId).exec()
    }

    async findOkrById(okrId: string) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        return okr
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
        const okr: Okr = await this.okrModel.findById(okrId).exec()

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

        okr.keyResults.push(keyResult)

        return new this.okrModel(okr).save()
    }

    async editKeyResult(
        okrId: string,
        keyResultId: string,
        keyResultDto: KeyResultDto
    ) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        okr.keyResults.forEach((keyResult) => {
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

        return new this.okrModel(okr).save()
    }

    async removeKeyResult(okrId: string, keyResultId: string) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        okr.keyResults = okr.keyResults.filter(
            (keyResult) => keyResult._id.toString() != keyResultId
        )

        return new this.okrModel(okr).save()
    }

    async addKeyStatus(
        okrId: string,
        keyResultId: string,
        keyStatusDto: KeyStatusDto
    ) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        const keyResult = okr.keyResults.find(
            (kr) => kr._id.toString() == keyResultId
        )

        const keystatus = new KeyStatus(keyStatusDto.period, keyStatusDto.value)
        keyResult.keyStatus.push(keystatus)

        return new this.okrModel(okr).save()
    }

    // think that this is not needed anymore
    async removeKeyStatus(
        okrId: string,
        keyResultId: string,
        keyStatusId: string
    ) {
        const okr: Okr = await this.okrModel.findById(okrId).exec()

        const keyResult = okr.keyResults.find(
            (kr) => kr._id.toString() == keyResultId
        )

        keyResult.keyStatus.filter((ks) => ks._id.toString() != keyStatusId)

        return new this.okrModel(okr).save()
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
