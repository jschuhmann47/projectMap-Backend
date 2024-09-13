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
import { Deviation } from './deviations'
import { BSCCategory } from './bsc_category'
import { Trend } from './trends'
import { getStatusFromFrequencyAndHorizon } from '../frequency'
import { Horizon } from '../horizon'

@Injectable()
export class BalancedScorecardService {
    constructor(
        @InjectModel(BalancedScorecard.name)
        private balancedScorecardModel: Model<BalancedScorecard>
    ) {}

    async create(balancedScorecardDto: BalancedScorecardDto) {
        if (balancedScorecardDto.horizon < Horizon.YEAR) {
            throw new HttpException('Invalid horizon', HttpStatus.BAD_REQUEST)
        }
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
        balancedScorecard.description = balancedScorecardDto.description
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
            objectiveDto.goal,
            objectiveDto.baseline,
            objectiveDto.category as BSCCategory,
            objectiveDto.responsible,
            objectiveDto.frequency
        )

        const periodCount = getStatusFromFrequencyAndHorizon(
            objectiveDto.frequency,
            balancedScorecard.horizon
        )
        if (periodCount.invalid) {
            throw new HttpException(
                'Invalid frequency or horizon',
                HttpStatus.BAD_REQUEST
            )
        }
        const defaultObjective =
            Math.round(
                ((objectiveDto.goal - objectiveDto.baseline) /
                    periodCount.lengthOfPeriods) *
                    100
            ) / 100
        let startingObjective = defaultObjective
        objective.checkpoints = []
        for (let i = 0; i < periodCount.lengthOfPeriods; i++) {
            objective.checkpoints.push(
                new Checkpoint(
                    periodCount.periodName + ' ' + (i + 1),
                    startingObjective,
                    0
                )
            )
            startingObjective += defaultObjective
        }

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
                objective.goal = objectiveDto.goal
                objective.baseline = objectiveDto.baseline
                objective.category = objectiveDto.category as BSCCategory

                if (objectiveDto.checkpoints) {
                    objectiveDto.checkpoints.forEach((checkpointDto) => {
                        const objectiveToUpdate = objective.checkpoints.find(
                            (checkpoint) =>
                                checkpoint._id.toString() ==
                                checkpointDto._id.toString()
                        )
                        if (objectiveToUpdate) {
                            objectiveToUpdate.actual = checkpointDto.actual
                            objectiveToUpdate.period = checkpointDto.period
                            objectiveToUpdate.target = checkpointDto.target
                        }
                    })
                }
            }
        })
        balancedScorecard.objectives.forEach((o) => {
            let checkpointTotalTarget = 0
            o.checkpoints.forEach((c) => {
                checkpointTotalTarget += c.target
            })
            // math functions are to have some grace range because of decimals
            if (
                checkpointTotalTarget < Math.floor(o.goal) ||
                checkpointTotalTarget > Math.ceil(o.goal)
            ) {
                throw new HttpException(
                    "Sum of objectives don't match goal",
                    HttpStatus.BAD_REQUEST
                )
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

        // TODO: check here the sum if this endpoint is used
        objective.checkpoints.forEach((checkpoint) => {
            if (checkpoint._id.toString() == checkpointId) {
                checkpoint.actual = checkpointDto.actual
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
