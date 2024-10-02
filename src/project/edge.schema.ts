import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
export class OrgDiagramEdge {
    @Prop({ type: String })
    id: string

    @Prop({ type: String })
    source: string

    @Prop({ type: String })
    target: string
}
