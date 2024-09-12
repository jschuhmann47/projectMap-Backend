import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
export class Node {
    @Prop({ type: String })
    id: string

    @Prop({ type: Number })
    height: number

    @Prop({ type: String })
    width: string

    @Prop({ type: String })
    type: string

    @Prop()
    data: {
        label: string
    }

    @Prop({ type: String })
    source: string
}
