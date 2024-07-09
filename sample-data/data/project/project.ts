import { Project } from '../../models/project.model'

const projects: Project[] = [
    {
        name: 'Project name',
        id: 'PRO1',
        coordinators: [],
        participants: [
            {
                userId: 'AA2',
                spheres: [
                    {
                        id: 'SP21',
                        permission: 'write',
                    },
                ],
            },
        ],
    },
]

export = projects
