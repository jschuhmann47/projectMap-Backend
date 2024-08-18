export interface Spheres {
    id: string
    permission: 'edit' | 'view' | 'hide'
}

export interface Participant {
    userId: string
    spheres: Spheres[]
}

export interface Project {
    id: string
    name: string
    coordinators: string[]
    participants: Participant[]
}
