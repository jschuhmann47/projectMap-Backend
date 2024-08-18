import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from 'src/user/user.schema'
import { Sphere } from './sphere.schema'
import mongoose from 'mongoose'

@Schema({ _id: false })
export class Participant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

    @Prop({ type: Object })
    spheres: Sphere[]
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
