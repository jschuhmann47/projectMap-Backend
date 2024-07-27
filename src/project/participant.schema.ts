import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Stage } from './stage.schema'

@Schema()
export class Participant {
    @Prop({ type: String })
    userEmail: string

    @Prop()
    stages: Stage[]
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
