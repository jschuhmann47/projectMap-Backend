import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/user/user.schema'
import { Participant } from './participant.schema'
import { Sphere } from './sphere.schema'
import mongoose from 'mongoose'

export class ProjectDto {
    @ApiProperty()
    requestorId: string

    @ApiProperty()
    titulo: string

    @ApiProperty()
    descripcion: string

    @ApiProperty()
    color: string
}

export class ShareProjectDto {
    @ApiProperty()
    users: string[]
}

export class ShareProjectEmailDto {
    @ApiProperty()
    email: string
}

export class StopSharingProjectEmailDto {
    @ApiProperty()
    emails: string[]
}

export class UpdateUserRolesDto {
    @ApiProperty()
    users: UpdateUserRolesData[]
}

export class UpdateUserRolesData {
    @ApiProperty()
    userId: string

    @ApiProperty()
    role: string

    // Only if participant
    @ApiProperty()
    spheres: Sphere[]
}

export function toParticipant(u: UpdateUserRolesData) {
    const p = new Participant()
    p.user = new User()
    p.user._id = new mongoose.mongo.ObjectId(u.userId)
    p.spheres = u.spheres
    return p
}
