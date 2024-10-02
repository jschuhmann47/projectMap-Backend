import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
export class DiagramNode {
    @Prop({ type: String })
    id: string

    @Prop({ type: Number })
    height: number

    @Prop({ type: String })
    width: string // CHECK

    @Prop({ type: String })
    type: string

    @Prop({ type: { label: String } })
    data: {
        label: string
    }

    @Prop({ type: String })
    source: string
}
