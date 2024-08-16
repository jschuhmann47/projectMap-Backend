import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Sphere } from './sphere.schema'

@Schema()
export class Participant {
    @Prop({ type: String })
    userEmail: string

    @Prop()
    spehres: Sphere[]
}

export const ProjectSchema = SchemaFactory.createForClass(Participant)
