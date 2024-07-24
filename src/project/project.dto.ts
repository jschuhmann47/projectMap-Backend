import { ApiProperty } from '@nestjs/swagger'

export class UpdateParticipantDto {
    @ApiProperty()
    userEmail: string

    sphere: 'read' | 'write' | 'view'
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
