import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserService } from '../user/user.service'
import { ProjectDto, UpdateParticipantDto } from './project.dto'
import { Project } from './project.schema'
import { Stage } from './stage.schema'
import { insensitiveRegExp } from './utils/escape_string'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project') private projectModel: Model<Project>,
        private userService: UserService
    ) {}

    async getOne(id: string) {
        const project = await this.projectModel
            .findById(id)
            .populate('coordinators', '-password')
            .populate({
                path: 'participants.user',
                model: 'User',
                select: '-password',
            })
            .exec()
        return project
    }

    async getSharedUsers(projectId: string) {
        return this.userService.findUsersBySharedProject(projectId)
    }

    async create(req: ProjectDto) {
        if (!this.userService.isAdmin(req.requestorId)) {
            throw new HttpException('No autorizado', HttpStatus.FORBIDDEN)
        }
        if (!req.titulo || !req.descripcion || !req.color) {
            throw new HttpException('Campos faltantes', HttpStatus.BAD_REQUEST)
        }
        const projectToCreate = new Project(
            req.titulo,
            req.descripcion,
            req.color
        )
        return this.projectModel.create(projectToCreate)
    }

    async shareProject(id: string, userIds: string[]) {
        const project = await this.getOne(id)
        await Promise.all(
            userIds.map((userId) =>
                this.userService.assignProjects(userId, [project])
            )
        )
        return this.getSharedUsers(id)
    }

    async shareProjectByEmail(id: string, email: string) {
        const project = await this.getOne(id)
        const user = await this.userService.findUserByEmail(email)
        await this.userService.assignProjects(user._id.toString(), [project])
        return this.getSharedUsers(id)
    }

    async removeUserFromProjectByEmail(id: string, emails: string[]) {
        const users = await Promise.all(
            emails.map((email) => this.userService.findUserByEmail(email))
        )
        await Promise.all(users.map(() => this.userService.removeProjects()))
        return this.getSharedUsers(id)
    }

    async removeUserFromProject(id: string) {
        await this.userService.removeProjects()
        return this.getSharedUsers(id)
    }

    // eslint-disable-next-line
    async findUserProjects(owner: string) {
        //return this.projectModel.find({ owner })
        return this.projectModel.find({})
    }

    async findProjectsByName(name: string) {
        return this.projectModel.find({
            name: insensitiveRegExp(name),
        })
    }

    async findSharedProjects() {
        //const user = await this.userService.findById(userId)
        return [] // user.sharedProjects TODO: borrar
    }
    async update(id: string, updated: ProjectDto) {
        return this.projectModel.findOneAndUpdate({ _id: id }, updated)
    }

    async delete(id: string) {
        const users = await this.getSharedUsers(id)

        await Promise.all(users.map(() => this.userService.removeProjects()))
        const result = await this.projectModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    async updateParticipantRole(
        projectId: string,
        participantDto: UpdateParticipantDto[]
    ) {
        const project = await this.getOne(projectId)

        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        if (project) {
            for (let i = 0; i < participantDto.length; i++) {
                const participant = project.participants.find(
                    (participant) =>
                        participant.user.email == participantDto[i].userEmail
                )

                if (participant) {
                    participant.stages = participantDto[i].stages
                } else {
                    const user = await this.userService.findByEmail(
                        participantDto[i].userEmail
                    )
                    project.participants.push({
                        user,
                        stages: participantDto[i].stages,
                    })
                }
            }
        }
        return project.save()
    }

    async updateCoordinatorRole(projectId: string, userEmails: string[]) {
        const project = await this.getOne(projectId)

        if (project) {
            for (let i = 0; i < userEmails.length; i ++) {
                const userEmail = userEmails[i];

                const matchedUser = project.coordinators.find(
                    (coordinator) => coordinator.email == userEmail
                )

                if (!matchedUser) {
                    const user = await this.userService.findByEmail(userEmail);

                    if (user) {
                        project.coordinators.push(user)
                    }
                }
            }
        }

        return project.save()
    }

    async getUserStagePermission(
        projectId: string,
        userEmail: string,
        stageId: string
    ): Promise<Stage> {
        const project = await this.getOne(projectId)
        let stage = null

        if (project) {
            const matchedUser = project.participants.find(
                (participant) => participant.user.email == userEmail
            )

            if (matchedUser) {
                stage = matchedUser.stages.find((stage) => stage.id == stageId)
            }
        }

        return stage
    }

    async addUserToProject(
        projectId: string,
        userEmail: string,
        role: string,
        requestorId: string
    ) {
        const isAdmin = await this.userService.isAdmin(requestorId)
        if (!isAdmin) {
            throw new HttpException('No autorizado', HttpStatus.FORBIDDEN)
        }
        if (!projectId || !userEmail || !role) {
            throw new HttpException('Campos faltantes', HttpStatus.BAD_REQUEST)
        }
        if (!this.isValidRole(role)) {
            throw new HttpException('Rol invalido', HttpStatus.BAD_REQUEST)
        }

        const project = await this.projectModel.findById(projectId)
        if (!project) {
            throw new HttpException(
                'Proyecto no encontrado',
                HttpStatus.NOT_FOUND
            )
        }

        if (
            project.participants.some((p) => p.user.email == userEmail) ||
            project.coordinators.some((c) => c.email == userEmail)
        ) {
            throw new HttpException(
                'Usuario ya existe en el proyecto',
                HttpStatus.BAD_REQUEST
            )
        }

        const existingUser = await this.userService.findByEmail(userEmail)

        switch (role) {
            case 'participant':
                project.participants.push({
                    user: existingUser,
                    stages: [],
                })
                break
            case 'coordinator':
                project.coordinators.push(existingUser)
                break
        }
        project.save()
    }

    private isValidRole(role: string) {
        return role == 'participant' || role == 'coordinator'
    }
}
