import { DiagramEdge } from './edge.schema'
import { DiagramNode } from './node.schema'
import { OrganizationalChart } from './organizationalChart.schema'

// Create example nodes
const nodeA = new DiagramNode()
nodeA.id = 'nodeA'
nodeA.height = 100
nodeA.width = '150px'
nodeA.type = 'employee'
nodeA.source = ''

const nodeB = new DiagramNode()
nodeB.id = 'nodeB'
nodeB.height = 100
nodeB.width = '150px'
nodeB.type = 'employee'
nodeB.source = 'nodeA'

const nodeC = new DiagramNode()
nodeC.id = 'nodeC'
nodeC.height = 100
nodeC.width = '150px'
nodeC.type = 'employee'
nodeC.source = 'nodeA'

const nodeD = new DiagramNode()
nodeD.id = 'nodeD'
nodeD.height = 100
nodeD.width = '150px'
nodeD.type = 'manager'
nodeD.source = 'nodeB'

// Create example edges
const edge1 = new DiagramEdge()
edge1.id = 'edge1'
edge1.source = 'nodeA'
edge1.target = 'nodeB'

const edge2 = new DiagramEdge()
edge2.id = 'edge2'
edge2.source = 'nodeA'
edge2.target = 'nodeC'

const edge3 = new DiagramEdge()
edge3.id = 'edge3'
edge3.source = 'nodeB'
edge3.target = 'nodeD'

// Create the organizational chart instance
const orgChart = new OrganizationalChart()
orgChart.nodes = [nodeA, nodeB, nodeC, nodeD]
orgChart.edges = [edge1, edge2, edge3]

test('Child node gets its direct parent', () => {
    expect(orgChart.getParentFromNode('nodeB')[0].id).toStrictEqual('nodeA')
})

test('The first node gets no parent', () => {
    expect(orgChart.getParentFromNode('nodeA').length).toStrictEqual(0)
})

test('The last node gets its first parent', () => {
    expect(orgChart.getParentFromNode('nodeD')[0].id).toStrictEqual('nodeB')
})
