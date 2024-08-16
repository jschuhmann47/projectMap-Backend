import { ApiProperty } from '@nestjs/swagger'
import { Sphere } from './sphere.schema'

export class UpdateParticipantDto {
    @ApiProperty()
    userEmail: string

    spheres: Sphere[]
}

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
