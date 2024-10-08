import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Participant } from './participant.schema'
import { User } from 'src/user/user.schema'
import { OrganizationChart } from './orgChart'

@Schema()
export class Project {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    titulo: string

    @Prop({ type: String, require: true })
    description: string

    @Prop({ type: String, require: true })
    name: string

    @Prop({ type: String, require: true })
    id: string

    @Prop({ type: String, require: true })
    color: string

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    coordinators: User[]

    @Prop({ type: [Participant] })
    participants: Participant[]

    @Prop({ type: OrganizationChart })
    chart: OrganizationChart

    constructor(name: string, description: string, color: string) {
        this.name = name
        this.description = description
        this.color = color
    }
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
