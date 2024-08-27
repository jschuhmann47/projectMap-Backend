import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export enum Horizon {
    YEAR = 0,
    SEMESTER,
    QUARTER,
    TRIMESTER,
    BIMESTER,
    MONTH,
    FORTNIGHT,
    // WEEK,
    // DAY,
}

export enum Priority {
    LOW = 0,
    MEDIUM,
    HIGH,
}

export enum Frequency {
    SIX_MONTHS = 0,
    THREE_MONTHS,
    TWO_MONTHS,
    MONTHLY,
    TWO_WEEKS,
    WEEKLY,
    DAILY,
}

@Schema()
export class KeyStatus {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    period: string

    @Prop({ type: Number, required: true })
    value: number

    constructor(period: string, value: number) {
        this.period = period
        this.value = value
    }
}
export const KeyStatusSchema = SchemaFactory.createForClass(KeyStatus)

@Schema()
export class KeyResult {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    responsible: string

    @Prop({ type: Number, default: Priority.MEDIUM })
    priority: Priority

    @Prop({ type: Number, required: true })
    baseline: number

    @Prop({ type: Number, required: true })
    goal: number

    @Prop({ type: Number, required: false })
    progress: number

    @Prop({ type: String, required: true })
    frequency: Frequency

    @Prop({ type: [KeyStatusSchema], default: [] })
    keyStatus: KeyStatus[]

    constructor(
        description: string,
        goal: number,
        responsible: string,
        priority = Priority.MEDIUM
    ) {
        this.description = description
        this.goal = goal
        this.responsible = responsible
        this.priority = priority
    }
}
export const KeyResultSchema = SchemaFactory.createForClass(KeyResult)
KeyResultSchema.pre('save', function (next) {
    this.progress =
        (this.keyStatus.map((k) => k.value).reduce((a, b) => a + b) * 100) /
        this.goal
    next()
})

@Schema()
export class Okr {
    _id: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    projectId: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    area: string

    @Prop({ type: String, required: true })
    horizon: Horizon

    @Prop({ type: Number })
    priority: Priority

    @Prop({ type: Number, default: 0 })
    progress: number

    @Prop({ type: [KeyResultSchema], default: [] })
    keyResults: KeyResult[]

    constructor(
        description: string,
        area: string,
        horizon: Horizon,
        priority: Priority
    ) {
        this.description = description
        this.area = area
        this.horizon = horizon
        this.priority = priority
    }
}
export const OkrSchema = SchemaFactory.createForClass(Okr)
OkrSchema.pre('save', function (next) {
    if (this.keyResults.length) {
        this.priority = Math.round(
            this.keyResults
                .map((kr) => kr.priority)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
        )
        this.progress =
            this.keyResults
                .map((kr) => kr.progress)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
    }
    next()
})
