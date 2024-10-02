import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
class Position {
    x: number
    y: number
}

@Schema({ _id: false })
class NodeData {
    label: string
}

@Schema({ _id: false })
export class DiagramNode {
    @Prop({ type: String })
    id: string

    @Prop({ type: { label: String } })
    data: NodeData

    @Prop({ type: String })
    type: string

    @Prop({ type: { x: Number, y: Number } })
    position: Position

    @Prop({ type: Number })
    width: number

    @Prop({ type: Number })
    height: number

    @Prop({ type: Boolean })
    selected: boolean

    @Prop({ type: { x: Number, y: Number } })
    positionAbsolute: Position

    @Prop({ type: Boolean })
    dragging: boolean
}

@Schema({ _id: false })
export class DiagramEdge {
    @Prop({ type: String })
    id: string

    @Prop({ type: String })
    source: string

    @Prop({ type: String })
    sourceHandle: string | null

    @Prop({ type: String })
    target: string

    @Prop({ type: String })
    targetHandle: string | null

    @Prop({ type: String })
    type: string

    @Prop({ type: Boolean })
    selected: boolean
}

@Schema({ _id: false })
export class OrganizationChart {
    @Prop({ type: [DiagramNode] })
    nodes: DiagramNode[]

    @Prop({ type: [DiagramEdge] })
    edges: DiagramEdge[]

    constructor(nodes: DiagramNode[], edges: DiagramEdge[]) {
        this.nodes = nodes
        this.edges = edges
    }
}

export function getParentsFromNode(areaId: string, chart: OrganizationChart) {
    return chart.edges
        .filter((e) => e.target == areaId)
        .flatMap((e) => chart.nodes.filter((n) => n.id == e.source))
}
