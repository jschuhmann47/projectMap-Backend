import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/user/user.schema'
import { Sphere } from './sphere.schema'

@Schema()
export class Participant {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    user: User

    @Prop({ type: Object })
    sphere: Sphere
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
