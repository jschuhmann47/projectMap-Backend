import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class Node {
    @Prop()
    id: string

    @Prop()
    height: number

    @Prop()
    width: string

    @Prop()
    type: string

    @Prop()
    data: {
        label: string
    }

    @Prop()
    source: string
}
