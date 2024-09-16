import { Prop, Schema } from '@nestjs/mongoose'
import { Edge } from './edge.schema'
import { Node } from './node.schema'

@Schema({ _id: false })
export class OrganizationalChart {
    @Prop()
    nodes: Node[]

    @Prop()
    edges: Edge[]
}
