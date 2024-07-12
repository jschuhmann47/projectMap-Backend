import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { UpdateUserDto } from './user.dto'

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':userId') // TODO change this route since conflicts with everything
    async findById(@Param('userId') userId: string) {
        return this.userService.findById(userId)
    }

    @Get('user/search')
    async findByEmail(@Query() query) {
        const email = query['email']
        return this.userService.findByPayload(email)
    }

    @Put(':userId') // TODO change this route since conflicts with everything
    async update(
        @Param('userId') userId,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(userId, updateUserDto)
    }
}
