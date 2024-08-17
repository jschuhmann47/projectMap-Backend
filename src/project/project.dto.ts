import { ApiProperty } from '@nestjs/swagger'
import { Stage } from './stage.schema'

// TODO this should be a list
export class UpdateParticipantDto {
    @ApiProperty()
    userEmail: string

    stages: Stage[]
}

export class UpdateCoordinatorRolesDro {
    @ApiProperty()
    userEmails: string[]
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
