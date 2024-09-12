import { Prop, Schema } from '@nestjs/mongoose'

@Schema({_id: false})
export class Edge {
    @Prop({type: String})
    id: string

    @Prop({type: String})
    source: string

    @Prop({type: String})
    target: string
}
