import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class Edge {
    @Prop({})
    id: string

    @Prop()
    source: string

    @Prop()
    target: string
}
