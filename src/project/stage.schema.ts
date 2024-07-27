import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@Schema()
export class Stage {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    id: string

    @Prop({ type: String, require: true })
    permission: 'read' | 'write' | 'view'
}

export const ProjectSchema = SchemaFactory.createForClass(Stage)
