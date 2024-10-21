import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Deviation } from './deviations'
import { BSCCategory as BSCCategory } from './bsc_category'
import { Trend } from './trends'
import { Horizon } from '../horizon'
import { Frequency } from '../frequency'
import { limitBetween } from '../utils'

@Schema()
export class Checkpoint {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    period: string

    @Prop({ type: Number })
    current: number

    constructor(period: string, target: number, current: number) {
        this.period = period
        this.current = current
    }
}

export const checkPointSchema = SchemaFactory.createForClass(Checkpoint)

@Schema()
export class Objective {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    action: string

    @Prop({ type: String, required: false, default: '' })
    measure: string

    @Prop({ type: Number, required: true })
    goal: number

    @Prop({ type: Number, required: true })
    baseline: number

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: Number, required: false })
    currentScore: number

    @Prop({ type: String, enum: BSCCategory, required: true })
    category: BSCCategory

    @Prop({ type: [checkPointSchema], default: [] })
    checkpoints: Checkpoint[]

    @Prop({ type: String, enum: Trend, default: Trend.Stable })
    trend: Trend

    @Prop({ type: String, enum: Deviation, default: Deviation.None })
    deviation: Deviation

    @Prop({ type: String, required: false, default: '' })
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
            const lastProgress = this.progress
            const incrementJump =
                ((this.goal - this.baseline) / this.checkpoints.length) *
                completedCheckpoints.length

            const lastCheckpoint = completedCheckpoints.at(-1)!

            const progress = Math.round(
                ((lastCheckpoint.current - this.baseline) * 100) /
                    (this.goal - this.baseline)
            )
            this.progress = limitBetween(progress, 0, 100)
            this.currentScore = lastCheckpoint.current

            const currentStep = incrementJump * completedCheckpoints.length
            const dev = +(
                ((lastCheckpoint.current - currentStep) * 100) /
                (this.baseline + currentStep)
            ).toFixed(2)

            if (this.progress > lastProgress) {
                this.trend = Trend.Upwards
            } else if (this.progress < lastProgress) {
                this.trend = Trend.Downwards
            } else this.trend = Trend.Stable

            if (dev > -5) this.deviation = Deviation.None
            else if (dev >= -30) this.deviation = Deviation.Acceptable
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

    @Prop({ type: Date, required: true, default: Date.now })
    startingDate: Date

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    progress: number

    @Prop([objectiveSchema])
    objectives: Objective[]

    @Prop({ type: Number, enum: Horizon, required: true })
    horizon: Horizon
}

export const BalanceScorecardSchema =
    SchemaFactory.createForClass(BalancedScorecard)

BalanceScorecardSchema.pre('save', function (next) {
    const progress = Math.round(
        this.objectives.map((o) => o.progress).reduce((a, b) => a + b, 0) /
            this.objectives.length
    )
    this.progress = limitBetween(progress, 0, 100)
    next()
})
