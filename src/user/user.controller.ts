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
    async findByEmail(@Query() query) {
        const email = query['email']
        return this.userService.findByEmail(email)
    }

    @Put(':userId') // TODO change this route since conflicts with everything
    async update(
        @Param('userId') userId,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(userId, updateUserDto)
    }

    @Post('user/password/recovery')
    async sendPasswordRecoverEmail(@Body() body: { email: string }) {
        const email = body.email
        return this.userService.sendPasswordRecoverEmail(email)
    }

    @Post('user/password/code')
    async verifyPasswordRecoveryCode(@Body() body: { email: string, code: number }) {
        return this.userService.verifyPasswordRecoveryCode(body.email, body.code)
    }
}
