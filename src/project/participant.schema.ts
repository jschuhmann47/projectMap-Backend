import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Sphere } from './sphere.schema'

@Schema()
export class Participant {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    userId: string

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sphere' }] })
    spehres: Sphere[]
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
