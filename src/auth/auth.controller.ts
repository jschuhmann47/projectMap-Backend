import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { LoginDTO } from './login.dto'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger'
import { User } from 'src/user/user.schema'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Get('/onlyauth')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Access protected information' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Returns hidden information for authenticated users only.',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async hiddenInformation() {
        return 'hidden information'
    }

    @Post('/register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered along with a JWT token.',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async register(@Body() userDTO: CreateUserDto) {
        const user = await this.userService.create(userDTO)
        const payload = {
            email: user.email,
        }

        const token = await this.authService.signPayload(payload)
        return { user, token }
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user and return a JWT token' })
    @ApiResponse({
        status: 200,
        description: 'User successfully authenticated with a JWT token.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized: Invalid login credentials',
    })
    async login(@Body() loginDTO: LoginDTO) {
        const user = await this.userService.findByLogin(loginDTO)
        const payload = {
            email: user.email,
        }
        const token = await this.authService.signPayload(payload)
        return { user, token }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    @ApiOperation({ summary: 'Get the profile of the authenticated user' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description:
            'Returns the profile of the authenticated user along with a JWT token.',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Req() req: { user: User }) {
        const { email } = req.user
        const payload = {
            email,
        }
        const token = await this.authService.signPayload(payload)
        const { email: userEmail, firstName, lastName, isAdmin, _id } = req.user

        return {
            user: {
                email: userEmail,
                firstName,
                lastName,
                isAdmin,
                _id,
            },
            token,
        }
    }
}
