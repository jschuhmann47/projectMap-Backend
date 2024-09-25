import { Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { signPayloadHelper } from './sign'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtServ: JwtService
    ) {}

    async signPayload(payload: { email: string }) {
        return signPayloadHelper(payload)
    }

    async validateUser(payload: { email: string }) {
        return await this.userService.findByEmail(payload['email'])
    }

    async verifyToken(
        token: string
    ): Promise<{ email: string; iat: number; exp: number }> {
        return this.jwtServ.verify(token, {
            secret: process.env.SECRET_KEY,
        })
    }
}
