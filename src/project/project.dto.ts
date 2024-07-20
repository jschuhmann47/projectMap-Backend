import { ApiProperty } from '@nestjs/swagger'

export class ProjectDto {
    @ApiProperty()
    requestorId: string

    @ApiProperty()
    name: string

    @ApiProperty()
    description: string
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
