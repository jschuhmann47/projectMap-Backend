import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/user/user.schema'
import { Participant } from './participant.schema'
import mongoose from 'mongoose'
import { Stage } from './stage.schema'

export class ProjectDto {
    @ApiProperty({
        example: '123456',
        description: 'ID of the user requesting the project',
    })
    requestorId: string

    @ApiProperty({
        example: 'New Project',
        description: 'Title of the project',
    })
    titulo: string

    @ApiProperty({
        example: 'Project description goes here',
        description: 'Description of the project',
    })
    descripcion: string

    @ApiProperty({
        example: '#FF5733',
        description: 'Hex color code for the project',
    })
    color: string
}

export class UpdateUserRolesDto {
    @ApiProperty({
        type: () => UpdateUserRolesData,
        isArray: true,
        description: 'List of users and their roles to update',
    })
    users: UpdateUserRolesData[]
}

export class UpdateUserRolesData {
    @ApiProperty({ example: '123456', description: 'ID of the user' })
    userId: string

    @ApiProperty({
        example: 'coordinator',
        description: 'Role of the user',
        enum: ['coordinator', 'participant'],
    })
    role: string

    @ApiProperty({
        type: [Stage],
        description: 'Stages assigned to the user if role is participant',
        required: false,
    })
    stages: Stage[]
}

export function toParticipant(u: UpdateUserRolesData) {
    const p = new Participant()
    p.user = new User()
    p.user._id = new mongoose.mongo.ObjectId(u.userId)
    p.stages = u.stages
    return p
}
