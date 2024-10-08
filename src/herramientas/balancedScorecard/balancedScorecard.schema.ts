import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Deviation } from './deviations'
import { BSCCategory as BSCCategory } from './bsc_category'
import { Trend } from './trends'
import { Horizon } from '../horizon'
import { Frequency } from '../frequency'

@Schema()
export class Checkpoint {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    period: string

    @Prop({ type: Number, required: true })
    target: number

    @Prop({ type: Number, required: false })
    current: number

    constructor(period: string, target: number, current: number) {
        this.period = period
        this.target = target
        this.current = current
    }
}

export const checkPointSchema = SchemaFactory.createForClass(Checkpoint)

@Schema()
export class Objective {
    _id: mongoose.Types.ObjectId

    // This would be the title of the objective
    @Prop({ type: String, required: true })
    action: string

    @Prop({ type: String, required: false, default: '' })
    measure: string

    @Prop({ type: Number })
    goal: number

    @Prop({ type: Number })
    baseline: number

    @Prop({ type: String, enum: BSCCategory, required: true })
    category: BSCCategory

    @Prop({ type: [checkPointSchema], default: [] })
    checkpoints: Checkpoint[]

    @Prop({ type: Number })
    progress: number

    @Prop({ type: String, enum: Trend })
    trend: Trend

    @Prop({ type: String, enum: Deviation })
    deviation: Deviation

    @Prop({ type: String, required: false })
    responsible: string

    @Prop({ type: Number, enum: Frequency, required: true })
    frequency: Frequency

    constructor(
        action: string,
        measure: string,
        goal: number,
        baseline: number,
        category: BSCCategory,
        responsible: string,
        frequency: Frequency
    ) {
        this.action = action
        this.measure = measure
        this.goal = goal
        this.baseline = baseline
        this.category = category
        this.responsible = responsible
        this.frequency = frequency
    }
}

export const objectiveSchema = SchemaFactory.createForClass(Objective)
objectiveSchema.pre('save', function (next) {
    if (this.checkpoints.length) {
        const completedCheckpoints = this.checkpoints.filter(
            (checkpoint) => checkpoint.current && checkpoint.current != 0
        )
        if (completedCheckpoints.length) {
            const historicProgress = completedCheckpoints
                .slice(0, completedCheckpoints.length - 1)
                .map((k) => (k.current / k.target) * 100)
            const avgHistoricProgress =
                historicProgress.reduce((a, b) => a + b, 0) /
                historicProgress.length

            const lastCheckpoint =
                completedCheckpoints[completedCheckpoints.length - 1]
            const lastProgress =
                (lastCheckpoint.current / lastCheckpoint.target) * 100

            if (lastProgress > avgHistoricProgress) this.trend = Trend.Upwards
            else if (lastProgress < avgHistoricProgress)
                this.trend = Trend.Downwards
            else this.trend = Trend.Stable

            const current = this.checkpoints
                .map((k) => k.current)
                .reduce((a, b) => a + b, 0)
            this.progress = (current / (this.goal - this.baseline)) * 100

            const progressFromCompletedCheckpoints =
                completedCheckpoints
                    .map((k) => (k.current / k.target) * 100)
                    .reduce((a, b) => a + b, 0) / completedCheckpoints.length

            if (progressFromCompletedCheckpoints > 95)
                this.deviation = Deviation.None
            else if (progressFromCompletedCheckpoints <= 70)
                this.deviation = Deviation.Acceptable
            else this.deviation = Deviation.Risky
        }
    }

    next()
})

@Schema()
export class BalancedScorecard {
    _id: mongoose.Types.ObjectId

    @Prop({ required: true })
    projectId: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop([objectiveSchema])
    objectives: Objective[]

    @Prop({ type: Number, enum: Horizon, required: true })
    horizon: Horizon
}

export const BalanceScorecardSchema =
    SchemaFactory.createForClass(BalancedScorecard)

BalanceScorecardSchema.pre('save', function (next) {
    next()
})
