import { Prop, Schema } from '@nestjs/mongoose'

// Define the Position type
interface Position {
    x: number
    y: number
}

// Define the NodeData type
interface NodeData {
    label: string
}

// Define the Node type
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

// Define the Edge type
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

// Define the Graph class that holds nodes and edges
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

    public getParentsFromNode(areaId: string) {
        return this.edges
            .filter((e) => e.target == areaId)
            .flatMap((e) => this.nodes.filter((n) => n.id == e.source))
    }
}

// Example of how to create a Graph instance from the provided JSON object
const exampleGraphData = {
    nodes: [
        {
            id: '1',
            data: { label: 'Gerencia general' },
            type: 'default',
            position: { x: -96.94434694164183, y: 123.92527104890166 },
            width: 150,
            height: 36,
            selected: false,
            positionAbsolute: { x: -96.94434694164183, y: 123.92527104890166 },
            dragging: false,
        },
        {
            id: '2',
            data: { label: 'Gerencia de ventas' },
            type: 'default',
            position: { x: -198.20836131619285, y: 211.07102039911788 },
            width: 150,
            height: 36,
            selected: false,
            positionAbsolute: { x: -198.20836131619285, y: 211.07102039911788 },
            dragging: false,
        },
        {
            id: '3',
            data: { label: 'asds' },
            type: 'default',
            position: { x: -10.565568134094121, y: 209.21505918477703 },
            width: 150,
            height: 36,
            selected: true,
            positionAbsolute: { x: -10.565568134094121, y: 209.21505918477703 },
            dragging: false,
        },
    ],
    edges: [
        {
            source: '1',
            sourceHandle: null,
            target: '2',
            targetHandle: null,
            type: 'step',
            id: 'reactflow__edge-1-2',
            selected: false,
        },
        {
            source: '1',
            sourceHandle: null,
            target: '3',
            targetHandle: null,
            type: 'step',
            id: 'reactflow__edge-1-3',
            selected: false,
        },
    ],
}
