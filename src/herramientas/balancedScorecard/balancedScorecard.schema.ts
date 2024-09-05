import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Deviation } from './deviations'
import { BSCCategory as BSCCategory } from './bsc_category'
import { Trend } from './trends'

@Schema()
export class Checkpoint {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    month: string

    @Prop({ type: Number, required: true })
    target: number

    @Prop({ type: Number, required: false })
    actual: number

    constructor(month: string, target: number, actual: number) {
        this.month = month
        this.target = target
        this.actual = actual
    }
}

export const checkPointSchema = SchemaFactory.createForClass(Checkpoint)

@Schema()
export class Objective {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    action: string

    @Prop({ type: String, required: true })
    measure: string

    @Prop({ type: Number })
    goal: number

    @Prop({ type: Number })
    baseline: number

    @Prop({ type: String, required: true })
    category: BSCCategory

    @Prop({ type: [checkPointSchema], default: [] })
    checkpoints: Checkpoint[]

    @Prop({ type: Number })
    progress: number

    // I have my doubts about trend and deviation
    @Prop({ type: Trend })
    trend: Trend

    @Prop({ type: Deviation })
    deviation: Deviation

    @Prop({ type: String, required: false })
    responsible: string

    constructor(
        action: string,
        measure: string,
        goal: number,
        category: BSCCategory,
        responsible: string
    ) {
        this.action = action
        this.measure = measure
        this.goal = goal
        this.category = category
        this.responsible = responsible
    }
}

export const objectiveSchema = SchemaFactory.createForClass(Objective)
objectiveSchema.pre('save', function (next) {
    if (this.checkpoints.length) {
        const completedCheckpoints = this.checkpoints.filter(
            (checkpoint) => checkpoint.actual && checkpoint.actual != 0
        )
        if (completedCheckpoints.length) {
            const historicProgress = completedCheckpoints
                .slice(0, completedCheckpoints.length - 1)
                .map((k) => (k.actual / k.target) * 100)
            const avgHistoricProgress =
                historicProgress.reduce((a, b) => a + b, 0) /
                historicProgress.length

            const lastCheckpoint =
                completedCheckpoints[completedCheckpoints.length - 1]
            const lastProgress =
                (lastCheckpoint.actual / lastCheckpoint.target) * 100

            if (lastProgress > avgHistoricProgress) this.trend = Trend.Upwards
            else if (lastProgress < avgHistoricProgress)
                this.trend = Trend.Downwards
            else this.trend = Trend.Stable

            const actual = this.checkpoints
                .map((k) => k.actual)
                .reduce((a, b) => a + b, 0)
            this.progress = (actual / this.goal) * 100

            const progressFromCompletedCheckpoints =
                completedCheckpoints
                    .map((k) => (k.actual / k.target) * 100)
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
    title: string

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop([objectiveSchema])
    objectives: Objective[]
}

export const BalanceScorecardSchema =
    SchemaFactory.createForClass(BalancedScorecard)

BalanceScorecardSchema.pre('save', function (next) {
    next()
})
