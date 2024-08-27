import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [UserModule, JwtModule.register({})],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
