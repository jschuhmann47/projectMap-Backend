import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class KeyStatus {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    period: string

    @Prop({ type: Number, required: true })
    value: number

    constructor(month: string, value: number) {
        this.period = month
        this.value = value
    }
}
export const KeyStatusSchema = SchemaFactory.createForClass(KeyStatus)

@Schema()
export class KeyResult {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: false })
    responsible: string

    @Prop({ type: Number })
    priority: number

    @Prop({ type: Number })
    baseline: number

    @Prop({ type: Number })
    currentScore: number

    @Prop({ type: Number, required: true })
    goal: number

    @Prop({ type: Number })
    progress: number

    @Prop({ type: String })
    frequency: Frequency

    @Prop([KeyStatusSchema])
    keyStatus: KeyStatus[]

    constructor(
        description: string,
        goal: number,
        responsible: string,
        priority = 0
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

    @Prop({ type: String })
    description: string

    @Prop({ type: String, required: false })
    area: string

    @Prop({ type: String, required: true })
    horizon: Horizon

    @Prop({ type: Number, required: true })
    priority: number

    @Prop({ type: Number, required: true })
    progress: number

    @Prop([KeyResultSchema])
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
        this.priority =
            this.keyResults
                .map((kr) => kr.priority)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
        this.progress =
            this.keyResults
                .map((kr) => kr.progress)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
    }
    next()
})

enum Horizon {}

enum Priority {}

enum Frequency {}
