//import { Roles } from './user.schema'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
    @ApiProperty()
    email: string

    @ApiProperty()
    password: string
}

export class CreateUserDto {
    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    password: string

    @ApiProperty()
    confirmPassword: string

    @ApiProperty()
    email: string

    // @ApiProperty({ enum: Roles })
    // type: Roles

    @ApiProperty()
    biography: string
}

export class UpdateUserDto {
    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string

    @ApiProperty()
    calendlyUser: string

    @ApiProperty()
    biography: string
}
