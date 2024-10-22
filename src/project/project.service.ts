import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { UserService } from '../user/user.service'
import { ProjectDto, toParticipant, UpdateUserRolesDto } from './project.dto'
import { Project } from './project.schema'
import { defaultStages, Permission, Stage } from './stage.schema'
import { insensitiveRegExp } from './utils/escape_string'
import { User } from 'src/user/user.schema'
import { getParentsFromNode, OrganizationChart } from './orgChart'
import { OkrService } from 'src/herramientas/okr/okr.service'

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>,
        private userService: UserService,
        @Inject(forwardRef(() => OkrService)) private okrService: OkrService
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
                    { coordinators: requestorId },
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
    ): Promise<Permission> {
        const user = await this.userService.findByEmail(userEmail)
        if (!user) {
            return Permission.Hide
        }
        if (user.isAdmin) {
            return Permission.Edit
        }
        const project = await this.getOne(projectId)
        let stage: Stage | undefined

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
                return Permission.Edit
            }
        }

        return stage?.permission || Permission.Hide
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
        if (!project) {
            throw new NotFoundException()
        }
        if (project.chart) {
            this.updateMissingAreas(project, chart)
        }
        project.chart = chart
        project.save()
    }

    async getChart(projectId: string) {
        const project = await this.projectModel.findById(projectId)
        if (!project) {
            throw new NotFoundException()
        }
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

    private updateMissingAreas(project: Project, newChart: OrganizationChart) {
        const existingAreas = project.chart.nodes
        const newAreas = newChart.nodes
        const deletedAreas = existingAreas
            .filter((node) =>
                newAreas.every((n) => n.data.label != node.data.label)
            )
            .map((n) => n.data.label)
        this.okrService.updateMissingAreas(project._id.toString(), deletedAreas)
    }
}
