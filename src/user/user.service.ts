import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { ProjectAssignedNotification } from '../notifications/ProjectAssignedNotification'
import { Project } from '../project/project.schema'
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto'
import { User } from './user.schema'

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

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
        if (!user)
            throw new HttpException(
                'El mail ingresado no se encuentra registrado',
                HttpStatus.BAD_REQUEST
            )

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) return this.sanitizeUser(user)
        else
            throw new HttpException(
                'Contraseña incorrecta',
                HttpStatus.BAD_REQUEST
            )
    }

    private sanitizeUser(user: User) {
        const sanitized = user
        delete sanitized['password']
        return sanitized
    }

    async findByPayload(payload: { email: string }) {
        const { email } = payload
        return this.userModel.findOne({ email })
    }

    async findById(id: string) {
        return this.userModel
            .findById(id)
            .populate(['sharedProjects', 'consultora'])
    }

    // async updateRole(userId: string, role: Roles) {
    //     const user: User = await this.userModel.findById(userId)
    //     user.role = role
    //     return new this.userModel(user).save()
    // }

    async update(userId: string, updateUserDto: UpdateUserDto) {
        const user: User = await this.userModel.findById(userId)
        if (updateUserDto.firstName) user.firstName = updateUserDto.firstName
        if (updateUserDto.lastName) user.lastName = updateUserDto.lastName
        //if (updateUserDto.biography) user.biography = updateUserDto.biography
        /*if (updateUserDto.calendlyUser)
            user.calendlyUser = updateUserDto.calendlyUser*/
        return new this.userModel(user).save()
    }

    async findUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email: email }).exec()
        if (!user)
            throw new HttpException(
                'Usuario no encontrado',
                HttpStatus.NOT_FOUND
            )

        return user
    }

    async assignConsultora(userId: string, consultoraId: string) {
        await this.userModel
            .findByIdAndUpdate(userId, {
                consultora: consultoraId,
            })
            .exec()

        return this.userModel.findById(userId)
    }

    async assignProjects(userId: string, projects: Project[]) {
        const user = await this.userModel.findById(userId)

        //user.sharedProjects.push(...projects)

        /*user.sharedProjects = user.sharedProjects.filter(
            (value, index) => user.sharedProjects.indexOf(value) === index
        )
*/
        const userUpdated = await new this.userModel(user).save()

        projects.forEach((project) =>
            new ProjectAssignedNotification(project).notifyUsers([user.email])
        )

        return userUpdated
    }

    async replaceAssignProjects(userId: string, projects: Project[]) {
        const user = await this.userModel.findById(userId)

        //user.sharedProjects = projects

        const userUpdated = await new this.userModel(user).save()

        projects.forEach((project) =>
            new ProjectAssignedNotification(project).notifyUsers([user.email])
        )

        return userUpdated
    }

    // eslint-disable-next-line
    async removeProjects(userId: string, projectIds: string[]) {
        // const user = await this.findById(userId)
        // user.sharedProjects = user.sharedProjects.filter(
        //     (project) => !projectIds.includes(project._id.toString())
        // )
        // return new this.userModel(user).save()
    }

    async removeConsultant(userId: string) {
        return this.userModel.findByIdAndUpdate(userId, {
            $unset: { consultora: 1 },
        })
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

        const user = await this.userModel.findOne({ email })
        if (user)
            throw new HttpException(
                'El mail ingresado ya se encuentra registrado',
                HttpStatus.BAD_REQUEST
            )
    }
}
