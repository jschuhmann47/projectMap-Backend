import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export class Action {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true })
    responsible: string

    @Prop({ type: Number, required: true, default: 0, min: 0, max: 100 })
    progress: number

    @Prop({ type: Date, required: false })
    deadline: Date
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
