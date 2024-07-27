import { ApiProperty } from '@nestjs/swagger'
import { Stage } from './stage.schema'

export class UpdateParticipantDto {
    @ApiProperty()
    userEmail: string

    stages: Stage[]
}

export class ProjectDto {
    @ApiProperty()
    owner: string

    @ApiProperty()
    titulo: string

    @ApiProperty()
    descripcion: string

    @ApiProperty()
    sharedUsers: string[]

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
