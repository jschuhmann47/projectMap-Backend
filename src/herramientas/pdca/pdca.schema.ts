import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { limitBetween } from '../utils'

@Schema()
export class Action {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: false })
    responsible: string

    @Prop({ type: Number, required: true, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: Date, required: false })
    deadline: Date | undefined

    constructor(
        name: string,
        responsible: string = '',
        progress: number = 0,
        deadline: Date | undefined = undefined
    ) {
        this.name = name
        this.responsible = responsible
        this.progress = progress
        this.deadline = deadline
    }
}
const actionSchema = SchemaFactory.createForClass(Action)

@Schema()
export class Pdca {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: Number, required: true, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: mongoose.Types.ObjectId, required: true })
    projectId: string

    @Prop({ type: [actionSchema], required: true, default: [] })
    actions: Action[]

    constructor() {}
}

export const pdcaSchema = SchemaFactory.createForClass(Pdca)
pdcaSchema.pre('save', function (next) {
    const progress = Math.round(
        this.actions.map((a) => a.progress).reduce((a, b) => a + b, 0) /
            this.actions.length
    )
    this.progress = limitBetween(progress, 0, 100)
    next()
})
