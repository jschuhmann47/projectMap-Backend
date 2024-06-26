import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import type { User } from '../user/user.schema'

@Schema()
export class Project {
    _id: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: User

    @Prop({ type: String, require: true })
    titulo: string

    @Prop({ type: String, require: true })
    descripcion: string

    @Prop({ type: String, require: true })
    color: string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
