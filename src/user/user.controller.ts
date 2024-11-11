import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { UpdateUserDto } from './user.dto'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':userId')
    @ApiOperation({ summary: 'Retrieve user by ID' })
    @ApiParam({ name: 'userId', description: 'ID of the user' })
    @ApiResponse({ status: 200, description: 'Returns user details' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findById(@Param('userId') userId: string) {
        return this.userService.findById(userId)
    }

    @Get('user/search')
    @ApiOperation({ summary: 'Find user by email' })
    @ApiQuery({ name: 'email', description: 'Email of the user to search' })
    @ApiResponse({ status: 200, description: 'Returns user details by email' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findByEmail(@Query() query: { email: string }) {
        return this.userService.findByEmail(query.email)
    }

    @Put(':userId')
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiParam({ name: 'userId', description: 'ID of the user to update' })
    @ApiResponse({ status: 200, description: 'User successfully updated' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async update(
        @Param('userId') userId: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(userId, updateUserDto)
    }

    @Post('user/password/recovery')
    @ApiOperation({ summary: 'Send password recovery email' })
    @ApiResponse({ status: 200, description: 'Password recovery email sent' })
    @ApiResponse({ status: 400, description: 'Invalid email address' })
    async sendPasswordRecoverEmail(@Body() body: { email: string }) {
        return this.userService.sendPasswordRecoverEmail(body.email)
    }

    @Post('user/password/code')
    @ApiOperation({ summary: 'Verify password recovery code' })
    @ApiResponse({ status: 200, description: 'Code verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid code' })
    async verifyPasswordRecoveryCode(@Body() body: { code: number }) {
        return this.userService.verifyPasswordRecoveryCode(body.code)
    }

    @Post('user/password')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update user password' })
    @ApiResponse({ status: 200, description: 'Password successfully updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updatePassword(
        @Body() body: { newPassword: string },
        @Req() req: { user: { id: string } }
    ) {
        return this.userService.updatePassword(req.user.id, body.newPassword)
    }
}
