import { Prop, Schema } from '@nestjs/mongoose'
import { DiagramEdge } from './edge.schema'
import { DiagramNode } from './node.schema'

@Schema({ _id: false })
export class OrganizationalChart {
    @Prop()
    nodes: DiagramNode[]

    @Prop()
    edges: DiagramEdge[]

    // TODO validate length == 1 on whoever calls this
    public getParentFromNode(areaId: string) {
        return this.edges
            .filter((e) => e.target == areaId)
            .flatMap((e) => this.nodes.filter((n) => n.id == e.source))
    }
}
