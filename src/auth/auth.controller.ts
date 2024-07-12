import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { LoginDTO } from './login.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    @Get('/onlyauth')
    @UseGuards(AuthGuard('jwt'))
    async hiddenInformation() {
        return 'hidden information'
    }

    @Post('/register')
    async register(@Body() userDTO: CreateUserDto) {
        const user = await this.userService.create(userDTO)
        const payload = {
            email: user.email,
        }

        const token = await this.authService.signPayload(payload)
        return { user, token }
    }

    @Post('login')
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
    async getProfile(@Req() req: { user: User }) {
        const { email } = req.user
        const payload = {
            email,
        }
        const token = await this.authService.signPayload(payload)
        const { email: userEmail, firstName, lastName, isAdmin } = req.user;

        return {
            user: {
                email: userEmail, firstName, lastName, isAdmin
            }, token
        }
    }
}
