import { Prop, Schema } from '@nestjs/mongoose'
import { OrgDiagramEdge } from './edge.schema'
import { OrgDiagramNode } from './node.schema'

@Schema({ _id: false })
export class OrganizationalChart {
    @Prop()
    nodes: OrgDiagramNode[]

    @Prop()
    edges: OrgDiagramEdge[]

    // TODO validate length == 1 on whoever calls this
    public getParentsFromNode(areaId: string) {
        return this.edges
            .filter((e) => e.target == areaId)
            .flatMap((e) => this.nodes.filter((n) => n.id == e.source))
    }
}
