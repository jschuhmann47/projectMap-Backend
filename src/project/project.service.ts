import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { UserService } from '../user/user.service'
import { ProjectDto, toParticipant, UpdateUserRolesDto } from './project.dto'
import { Project } from './project.schema'
import { defaultStages, Permission, Stage, StageType } from './stage.schema'
import { insensitiveRegExp } from './utils/escape_string'
import { User } from 'src/user/user.schema'
import { getParentsFromNode, OrganizationChart } from './orgChart'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project') private projectModel: Model<Project>,
        private userService: UserService
    ) {}

    async getOne(id: string) {
        const project = await this.getPopulatedProject(id)
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

    async findUserProjects(requestorId: string) {
        const isAdmin = await this.userService.isAdmin(requestorId)
        if (isAdmin) {
            return this.projectModel.find({})
        } else {
            return this.projectModel.find({
                $or: [
                    { 'participants.user': requestorId },
                    { 'coordinators.user': requestorId },
                ],
            })
        }
    }

    async findProjectsByName(name: string) {
        return this.projectModel.find({
            name: insensitiveRegExp(name),
        })
    }

    async update(id: string, updated: ProjectDto) {
        return this.projectModel.findOneAndUpdate({ _id: id }, updated)
    }

    async delete(id: string) {
        const result = await this.projectModel.deleteOne({ _id: id })
        if (result.deletedCount) return id
        else throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    async updateUserRoles(
        requestorId: string,
        projectId: string,
        req: UpdateUserRolesDto
    ) {
        const project = await this.projectModel.findById(projectId)
        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
        }

        const isCoordinator = project.coordinators.find(
            (c) => c._id.toString() == requestorId
        )
        const isAdmin = await this.userService.isAdmin(requestorId)
        if (!isAdmin && !isCoordinator) {
            throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN)
        }

        const participants = req.users
            .filter((u) => u.role === 'participant')
            .map((u) => toParticipant(u))
        const coordinators = req.users
            .filter((u) => u.role === 'coordinator')
            .map((u) => {
                const user = new User()
                user._id = new mongoose.mongo.ObjectId(u.userId)
                return user
            })

        project.participants = participants
        project.coordinators = coordinators

        project.save()
    }

    async getUserStagePermission(
        projectId: string,
        userEmail: string,
        stageId: string
    ): Promise<Stage> {
        const user = await this.userService.findByEmail(userEmail)
        const canEdit = new Stage(
            // StageType can be anything here since we are checking only for the permission
            StageType.CompetitiveStrategy,
            Permission.Edit
        )
        if (!user) {
            return null
        }
        if (user.isAdmin) {
            return canEdit
        }
        const project = await this.getOne(projectId)
        let stage = null

        if (project) {
            const matchedUser = project.participants.find(
                (participant) => participant.user.email == userEmail
            )

            if (matchedUser) {
                stage = matchedUser.stages.find((stage) => stage.id == stageId)
            }
            const isCoordinator = project.coordinators.some(
                (c) => c.email == userEmail
            )
            if (isCoordinator) {
                return canEdit
            }
        }

        return stage
    }

    async addChart(projectId: string, chart: OrganizationChart) {
        chart.nodes.forEach((node) => {
            if (getParentsFromNode(node.id, chart).length > 1) {
                throw new HttpException(
                    'Diagrama tiene algún área con más de un área padre',
                    HttpStatus.BAD_REQUEST
                )
            }
        })
        const project = await this.projectModel.findById(projectId)
        project.chart = chart
        project.save()
    }

    async getChart(projectId: string) {
        const project = await this.projectModel.findById(projectId)
        return project.chart
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

        const project = await this.getPopulatedProject(projectId)
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

        const existingUser = await this.userService.findUserByEmail(userEmail)

        switch (role) {
            case 'participant':
                project.participants.push({
                    user: existingUser,
                    stages: defaultStages(),
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

    private async getPopulatedProject(projectId: string) {
        return this.projectModel
            .findById(projectId)
            .populate({
                path: 'coordinators',
                model: 'User',
                select: '-password',
            })
            .populate({
                path: 'participants.user',
                model: 'User',
                select: '-password',
            })
    }
}
