import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Email of the user',
    })
    email: string

    @ApiProperty({
        example: 'password123',
        description: 'Password of the user',
    })
    password: string
}

export class CreateUserDto {
    @ApiProperty({ example: 'John', description: 'First name of the user' })
    firstName: string

    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    lastName: string

    @ApiProperty({
        example: 'password123',
        description: 'Password of the user',
    })
    password: string

    @ApiProperty({
        example: 'password123',
        description: 'Password confirmation',
    })
    confirmPassword: string

    @ApiProperty({
        example: 'user@example.com',
        description: 'Email of the user',
    })
    email: string

    @ApiProperty({
        example: 'Software developer with 10 years of experience.',
        description: 'Biography of the user',
    })
    biography: string
}

export class UpdateUserDto {
    @ApiProperty({ example: 'John', description: 'First name of the user' })
    firstName: string

    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    lastName: string

    @ApiProperty({
        example: 'calendlyUser123',
        description: 'Calendly username for scheduling meetings',
    })
    calendlyUser: string

    @ApiProperty({
        example: 'Experienced project manager and team leader.',
        description: 'Biography of the user',
    })
    biography: string
}
