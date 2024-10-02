import {
    DiagramEdge,
    DiagramNode,
    OrganizationChart,
    getParentsFromNode,
} from './orgChart'

// Create example nodes
const nodeA = new DiagramNode()
nodeA.id = 'nodeA'
nodeA.height = 100
nodeA.width = 150
nodeA.type = 'employee'

const nodeB = new DiagramNode()
nodeB.id = 'nodeB'
nodeB.height = 100
nodeB.width = 150
nodeB.type = 'employee'

const nodeC = new DiagramNode()
nodeC.id = 'nodeC'
nodeC.height = 100
nodeC.width = 150
nodeC.type = 'employee'

const nodeD = new DiagramNode()
nodeD.id = 'nodeD'
nodeD.height = 100
nodeD.width = 150
nodeD.type = 'manager'

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
const orgChart = new OrganizationChart(
    [nodeA, nodeB, nodeC, nodeD],
    [edge1, edge2, edge3]
)

test('Child node gets its direct parent', () => {
    expect(getParentsFromNode('nodeB', orgChart)[0].id).toStrictEqual('nodeA')
})

test('The first node gets no parent', () => {
    expect(getParentsFromNode('nodeA', orgChart).length).toStrictEqual(0)
})

test('The last node gets its first parent', () => {
    const parents = getParentsFromNode('nodeD', orgChart)
    expect(parents[0].id).toStrictEqual('nodeB')
    expect(parents.length).toStrictEqual(1)
})
