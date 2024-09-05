import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
    BalancedScorecardDto,
    CheckpointDto,
    ObjectiveDto,
} from './balancedScorecard.dto'
import {
    BalancedScorecard,
    Checkpoint,
    Objective,
} from './balancedScorecard.schema'
import { CheckpointMonths } from './checkpointMonths'
import { Deviation } from './deviations'
import { BSCCategory } from './bsc_category'
import { Trend } from './trends'

@Injectable()
export class BalancedScorecardService {
    constructor(
        @InjectModel(BalancedScorecard.name)
        private balancedScorecardModel: Model<BalancedScorecard>
    ) {}

    async create(balancedScorecardDto: BalancedScorecardDto) {
        const balancedScorecard = new this.balancedScorecardModel(
            balancedScorecardDto
        )
        if (!balancedScorecardDto.objectives) balancedScorecard.objectives = []

        return balancedScorecard.save()
    }

    async delete(id: string) {
        const result = await this.balancedScorecardModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else
            throw new HttpException(
                'Balanced Scorecard not found',
                HttpStatus.NOT_FOUND
            )
    }

    async findById(balancedScorecardId: string) {
        return this.balancedScorecardModel.findById(balancedScorecardId)
    }

    async findObjectiveById(balancedScorecardId: string, objectiveId: string) {
        const balancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        return balancedScorecard.objectives.find(
            (objective) => objective._id.toString() == objectiveId
        )
    }

    async getAllByProjectId(projectId: string) {
        return this.balancedScorecardModel
            .find({ projectId: projectId })
            .sort({ createdAt: 'desc' })
            .exec()
    }

    async edit(
        balancedScorecardId: string,
        balancedScorecardDto: BalancedScorecardDto
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)
        balancedScorecard.title = balancedScorecardDto.titulo
        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async addObjective(
        balancedScorecardId: string,
        objectiveDto: ObjectiveDto
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)
        const objective = new Objective(
            objectiveDto.action,
            objectiveDto.measure,
            objectiveDto.target,
            objectiveDto.category as BSCCategory,
            objectiveDto.responsible
        )

        objective.checkpoints = []
        const targetPerMonth = objective.goal / CheckpointMonths.length
        CheckpointMonths.forEach((month) => {
            const checkpoint = new Checkpoint(month, targetPerMonth, 0)
            objective.checkpoints.push(checkpoint)
        })

        balancedScorecard.objectives.push(objective)

        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async editObjective(
        balancedScorecardId: string,
        objectiveId: string,
        objectiveDto: ObjectiveDto
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        balancedScorecard.objectives.forEach((objective) => {
            if (objective._id.toString() == objectiveId) {
                objective.action = objectiveDto.action
                objective.measure = objectiveDto.measure
                objective.goal = objectiveDto.target
                objective.category = objectiveDto.category as BSCCategory

                objectiveDto.checkpoints.forEach((checkpointDto) => {
                    const objectiveToUpdate = objective.checkpoints.find(
                        (checkpoint) =>
                            checkpoint._id.toString() ==
                            checkpointDto._id.toString()
                    )
                    if (objectiveToUpdate) {
                        objectiveToUpdate.actual = checkpointDto.actual
                        objectiveToUpdate.month = checkpointDto.month
                        objectiveToUpdate.target = checkpointDto.target
                    }
                })
            }
        })

        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async removeObjective(balancedScorecardId: string, objectiveId: string) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        balancedScorecard.objectives = balancedScorecard.objectives.filter(
            (objective) => objective._id.toString() != objectiveId
        )

        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async addCheckpoint(
        balancedScorecardId: string,
        objectiveId: string,
        checkpointDto: CheckpointDto
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        const objective = balancedScorecard.objectives.find(
            (o) => o._id.toString() == objectiveId
        )
        const checkpoint = new Checkpoint(
            checkpointDto.month,
            checkpointDto.target,
            checkpointDto.actual
        )

        objective.checkpoints.push(checkpoint)
        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async editCheckpoint(
        balancedScorecardId: string,
        objectiveId: string,
        checkpointId: string,
        checkpointDto: CheckpointDto
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        const objective = balancedScorecard.objectives.find(
            (o) => o._id.toString() == objectiveId
        )

        objective.checkpoints.forEach((checkpoint) => {
            if (checkpoint._id.toString() == checkpointId) {
                checkpoint.actual = checkpointDto.actual
                checkpoint.month = checkpointDto.month
                checkpoint.target = checkpointDto.target
            }
        })

        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async removeCheckpoint(
        balancedScorecardId: string,
        objectiveId: string,
        checkpointId: string
    ) {
        const balancedScorecard: BalancedScorecard =
            await this.balancedScorecardModel.findById(balancedScorecardId)

        const objective = balancedScorecard.objectives.find(
            (o) => o._id.toString() == objectiveId
        )

        objective.checkpoints = objective.checkpoints.filter(
            (c) => c._id.toString() != checkpointId
        )
        return new this.balancedScorecardModel(balancedScorecard).save()
    }

    async getOptions() {
        return {
            trend: Object.values(Trend),
            deviation: Object.values(Deviation),
            area: Object.values(BSCCategory),
        }
    }
}
