import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Frequency } from '../frequency'
import { Horizon } from '../horizon'

export enum Priority {
    LOW = 0,
    MEDIUM,
    HIGH,
}

@Schema({ _id: false })
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

    @Prop({ type: Number, default: Priority.MEDIUM, enum: Priority })
    priority: Priority

    @Prop({ type: Number, required: true })
    baseline: number

    @Prop({ type: Number, required: true })
    goal: number

    @Prop({ type: Number, required: false, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: Number, required: true, enum: Frequency })
    frequency: Frequency

    @Prop({ type: [KeyStatusSchema], default: [] })
    keyStatus: KeyStatus[]

    @Prop({ type: Number, required: false })
    currentScore: number

    constructor(
        description: string,
        responsible: string,
        baseline: number,
        goal: number,
        frequency: Frequency,
        priority = Priority.MEDIUM,
        keyStatus: KeyStatus[] = []
    ) {
        this.description = description
        this.goal = goal
        this.responsible = responsible
        this.priority = priority
        ;(this.baseline = baseline),
            (this.frequency = frequency),
            (this.keyStatus = keyStatus)
    }
}
export const KeyResultSchema = SchemaFactory.createForClass(KeyResult)
KeyResultSchema.pre('save', function (next) {
    const lastValue = getLastNonZeroValue(this.keyStatus)
    const progress = Math.round(
        ((lastValue - this.baseline) * 100) / (this.goal - this.baseline)
    )
    this.progress = Math.max(0, Math.min(100, progress))
    this.currentScore = lastValue
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

    @Prop({ type: Number, required: true, enum: Horizon })
    horizon: Horizon

    @Prop({ type: Date, required: true })
    startingDate: Date

    @Prop({ type: Number, enum: Priority, default: Priority.MEDIUM })
    priority: Priority

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: [KeyResultSchema], default: [] })
    keyResults: KeyResult[]

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Okr' })
    childOkrs: Okr[]

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
        const progress = Math.round(
            this.keyResults
                .map((kr) => kr.progress)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
        )
        this.progress = Math.max(0, Math.min(100, progress))
    }
    next()
})

function getLastNonZeroValue(keyStatus: KeyStatus[]) {
    if (!keyStatus.some((ks) => ks.value !== 0)) {
        return 0
    }
    return keyStatus.filter((ks) => ks.value !== 0).at(-1).value
}
