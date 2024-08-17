import { ApiProperty } from '@nestjs/swagger'
import { Sphere } from './sphere.schema'

// // TODO this should be a list
// export class UpdateParticipantDto {
//     @ApiProperty()
//     userEmail: string

//     sphere: Sphere
// }

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
