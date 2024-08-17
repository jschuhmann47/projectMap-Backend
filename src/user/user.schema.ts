import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Project } from '../project/project.schema'

@Schema()
export class User {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    firstName: string

    @Prop({ type: String, required: true })
    lastName: string

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true })
    password: string

    @Prop({ type: Boolean, required: true, default: false })
    isAdmin: boolean

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
    projectsId: Project[]
}
export const UserSchema = SchemaFactory.createForClass(User)
