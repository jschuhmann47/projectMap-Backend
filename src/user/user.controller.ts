import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
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
    async findByEmail(@Query() query: { email: string }) {
        return this.userService.findByEmail(query.email)
    }

    @Put(':userId') // TODO change this route since conflicts with everything
    async update(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(userId, updateUserDto)
    }

    @Post('user/password/recovery')
    async sendPasswordRecoverEmail(@Body() body: { email: string }) {
        return this.userService.sendPasswordRecoverEmail(body.email)
    }

    @Post('user/password/code')
    async verifyPasswordRecoveryCode(@Body() body: { code: number }) {
        return this.userService.verifyPasswordRecoveryCode(body.code)
    }
}
