import { OrgDiagramEdge } from './edge.schema'
import { OrgDiagramNode } from './node.schema'
import { OrganizationalChart } from './organizationalChart.schema'

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
class DiagramNode {
    id: string
    data: NodeData
    type: string
    position: Position
    width: number
    height: number
    selected: boolean
    positionAbsolute: Position
    dragging: boolean

    constructor(
        id: string,
        data: NodeData,
        type: string,
        position: Position,
        width: number,
        height: number,
        selected: boolean,
        positionAbsolute: Position,
        dragging: boolean
    ) {
        this.id = id
        this.data = data
        this.type = type
        this.position = position
        this.width = width
        this.height = height
        this.selected = selected
        this.positionAbsolute = positionAbsolute
        this.dragging = dragging
    }
}

// Define the Edge type
class DiagramEdge {
    source: string
    sourceHandle: string | null
    target: string
    targetHandle: string | null
    type: string
    id: string
    selected: boolean

    constructor(
        source: string,
        sourceHandle: string | null,
        target: string,
        targetHandle: string | null,
        type: string,
        id: string,
        selected: boolean
    ) {
        this.source = source
        this.sourceHandle = sourceHandle
        this.target = target
        this.targetHandle = targetHandle
        this.type = type
        this.id = id
        this.selected = selected
    }
}

// Define the Graph class that holds nodes and edges
class Graph {
    nodes: DiagramNode[]
    edges: DiagramEdge[]

    constructor(nodes: DiagramNode[], edges: DiagramEdge[]) {
        this.nodes = nodes
        this.edges = edges
    }

    public toOrganizationalChart() {
        const orgChart = new OrganizationalChart()
        orgChart.nodes = this.nodes.map((n) => {
            const node = new OrgDiagramNode()
            // TODO add fields
            return node
        })
        orgChart.edges = this.edges.map((e) => {
            const edge = new OrgDiagramEdge()
            // TODO add fields
            return edge
        })
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

// Create nodes and edges from example data
const nodes = exampleGraphData.nodes.map(
    (nodeData) =>
        new DiagramNode(
            nodeData.id,
            nodeData.data,
            nodeData.type,
            nodeData.position,
            nodeData.width,
            nodeData.height,
            nodeData.selected,
            nodeData.positionAbsolute,
            nodeData.dragging
        )
)

const edges = exampleGraphData.edges.map(
    (edgeData) =>
        new DiagramEdge(
            edgeData.source,
            edgeData.sourceHandle,
            edgeData.target,
            edgeData.targetHandle,
            edgeData.type,
            edgeData.id,
            edgeData.selected
        )
)

// Create the Graph instance
const graph = new Graph(nodes, edges)
