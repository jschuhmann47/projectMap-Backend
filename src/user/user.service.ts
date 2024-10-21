import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { insensitiveRegExp } from 'src/project/utils/escape_string'
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto'
import { User } from './user.schema'
import { RecoverPasswordNotification } from './../notifications/RecoverPasswordNotification'
import { signPayloadHelper } from 'src/auth/sign'

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    validatePasswordStrength(value: string): string | undefined {
        let error;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&-+=()!? "]).{8,128}$/

        if (!value) {
            error = 'La contraseña es obligatoria.';
        } else if (!passwordRegex.test(value)) {
            error = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.';
        }

        return error;
    }

    async create(userDTO: CreateUserDto) {
        await this.validate(userDTO)
        userDTO.password = await bcrypt.hash(userDTO.password, 10)
        const createUser = new this.userModel(userDTO)
        await createUser.save()

        return this.sanitizeUser(createUser)
    }

    async findByLogin(UserDTO: UserDto) {
        const { email, password } = UserDTO
        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new BadRequestException('Usuario o contraseña incorrectos')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) return this.sanitizeUser(user)
        else throw new BadRequestException('Usuario o contraseña incorrectos')
    }

    private sanitizeUser(user: User) {
        const newUser = Object.create(user)
        delete newUser.password //check
        return newUser
    }

    async findByEmail(email: string) {
        const user = await this.userModel
            .findOne({
                email: insensitiveRegExp(email),
            })
            .select('-password')
        if (!user)
            throw new HttpException(
                'Usuario no encontrado',
                HttpStatus.NOT_FOUND
            )
        return user
    }

    async findById(id: string) {
        return this.userModel.findById(id)
    }

    async update(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(userId)
        if (!user) {
            throw new NotFoundException()
        }
        if (updateUserDto.firstName) user.firstName = updateUserDto.firstName
        if (updateUserDto.lastName) user.lastName = updateUserDto.lastName
        return new this.userModel(user).save()
    }

    async findUserByEmail(email: string) {
        const user = await this.mustGetUserByEmail(email)
        return user
    }

    async findUsersBySharedProject(projectId: string) {
        return this.userModel.find({ sharedProjects: projectId })
    }

    async validate(newUser: CreateUserDto) {
        const { email, password, confirmPassword } = newUser
        if (password !== confirmPassword)
            throw new HttpException(
                'Las contraseñas no coinciden',
                HttpStatus.BAD_REQUEST
            )

        const passwordError = this.validatePasswordStrength(password);
        if (passwordError)
            throw new HttpException(passwordError, HttpStatus.BAD_REQUEST);
        const user = await this.userModel.findOne({ email })
        if (user)
            throw new HttpException(
                'El mail ingresado ya se encuentra registrado',
                HttpStatus.BAD_REQUEST
            )
    }

    async isAdmin(userId: string) {
        const user = await this.userModel.findById(userId)
        if (!user) {
            return false
        }
        return user.isAdmin
    }

    async sendPasswordRecoverEmail(email: string) {
        const user = await this.mustGetUserByEmail(email)

        const code = generateRandomSixDigitVerificationCode()
        user.verificationCode = code

        user.save()
        new RecoverPasswordNotification(user.email, code).notifyUser()

        return
    }

    async verifyPasswordRecoveryCode(code: number) {
        if (!code) {
            throw new HttpException('Código inválido', HttpStatus.BAD_REQUEST)
        }
        const user = await this.userModel
            .findOne({ verificationCode: code })
            .select('-password')
        if (!user) {
            throw new HttpException('Código inválido', HttpStatus.BAD_REQUEST)
        }
        user.verificationCode = null
        user.save()

        const token = signPayloadHelper({ email: user.email })
        return { user, token }
    }

    private async mustGetUserByEmail(email: string) {
        const user = await this.findByEmail(email)
        if (!user) {
            throw new HttpException('Email no existente', HttpStatus.NOT_FOUND)
        }
        return user
    }

    async updatePassword(userId: string, newPassword: string) {
        const user = await this.findById(userId)
        if (!user) {
            throw new HttpException('Usuario inexistente', HttpStatus.NOT_FOUND)
        }
        const passwordError = this.validatePasswordStrength(newPassword);
        if (passwordError)
            throw new HttpException(passwordError, HttpStatus.BAD_REQUEST);
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        return {}
    }
}

function generateRandomSixDigitVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000)
}
