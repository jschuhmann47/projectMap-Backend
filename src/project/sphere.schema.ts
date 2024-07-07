import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import type { User } from '../user/user.schema'
import { Participant } from 'sample-data/models'

@Schema()
export class Sphere {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: String, require: true })
    id: string

    @Prop({ type: String, require: true })
    permission: "read" | "write" | "view";
}

export const ProjectSchema = SchemaFactory.createForClass(Sphere)
