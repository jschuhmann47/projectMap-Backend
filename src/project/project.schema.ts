import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Participant } from './participant.schema'
import { User } from 'src/user/user.schema'

@Schema()
export class Project {
    _id: mongoose.Types.ObjectId

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    // owner: User

    // @Prop({ type: String, require: true })
    // titulo: string

    // @Prop({ type: String, require: true })
    // descripcion: string

    // @Prop({ type: String, require: true })
    // color: string

    @Prop({ type: String, require: true })
    description: string

    @Prop({ type: String, require: true })
    name: string

    @Prop({ type: String, require: true })
    id: string

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } })
    coordinators: User[] // userIds

    @Prop({ type: Object })
    participants: Participant[] // userIds
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
