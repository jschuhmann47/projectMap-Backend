import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, FilterQuery } from 'mongoose'
import mongoose, { Model } from 'mongoose'
import { UserService } from '../user/user.service'
import { ProjectDto, toParticipant, UpdateUserRolesDto } from './project.dto'
import { Project } from './project.schema'
import { defaultStages, Permission, Stage } from './stage.schema'
import { User } from 'src/user/user.schema'
import { getParentsFromNode, OrganizationChart } from './orgChart'
import { OkrService } from 'src/herramientas/okr/okr.service'
import { insensitiveRegExp } from './utils/escape_string'
import { FodaService } from 'src/herramientas/foda/foda.service'
import { PorterService } from 'src/herramientas/porter/porter.service'
import { PestelService } from 'src/herramientas/pestel/pestel.service'
import { AnsoffService } from 'src/herramientas/ansoff/ansoff.service'
import { MckinseyService } from 'src/herramientas/mckinsey/mckinsey.service'
import { QuestionnaireService } from 'src/herramientas/questionnaire/questionnaire.service'
import { BalancedScorecardService } from 'src/herramientas/balancedScorecard/balancedScorecard.service'
import { PdcaService } from 'src/herramientas/pdca/pdca.service'

type ProjectQuery = FilterQuery<{
    'participants.user'?: string
    coordinators?: string
    name?: { $regex: RegExp }
}>
@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>,
        private userService: UserService,
        @Inject(forwardRef(() => OkrService)) private okrService: OkrService,
        private fodaService: FodaService,
        private porterService: PorterService,
        private pestelService: PestelService,
        private ansoffService: AnsoffService,
        private mckinseyService: MckinseyService,
        private questionnaireService: QuestionnaireService,
        private balancedScorecardService: BalancedScorecardService,
        private pdcaService: PdcaService,
        @InjectConnection() private connection: Connection
    ) {
        console.log({ connection: this.connection })
    }

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

    async findUserProjects(
        requestorId: string,
        limit: number,
        offset: number,
        search: string
    ) {
        const isAdmin = await this.userService.isAdmin(requestorId)

        let query: ProjectQuery = isAdmin
            ? {}
            : {
                  $or: [
                      { 'participants.user': requestorId },
                      { coordinators: requestorId },
                  ],
              }

        if (search) {
            query = {
                $and: [query, { name: { $regex: insensitiveRegExp(search) } }],
            } as ProjectQuery
        }

        const total = await this.projectModel.countDocuments(query)

        const projects = await this.projectModel
            .find(query)
            .skip(offset)
            .limit(limit)
            .exec()

        return [projects, total]
    }

    async update(id: string, updated: ProjectDto) {
        return this.projectModel.findOneAndUpdate({ _id: id }, updated)
    }

    async delete(id: string) {
        const session = await this.connection.startSession()
        let error = false

        try {
            await session.withTransaction(async () => {
                await this.porterService.deleteAllWithProjectId(id, session)
                await this.pestelService.deleteAllWithProjectId(id, session)
                await this.fodaService.deleteAllWithProjectId(id)
                await this.ansoffService.deleteAllWithProjectId(id)
                await this.mckinseyService.deleteAllWithProjectId(id)
                await this.questionnaireService.deleteAllWithProjectId(id)
                await this.okrService.deleteAllWithProjectId(id)
                await this.balancedScorecardService.deleteAllWithProjectId(id)
                await this.pdcaService.deleteAllWithProjectId(id)
                await this.projectModel.deleteOne({ _id: id })
            })
        } catch (e) {
            console.error({ e })
            error = true
        } finally {
            session.endSession()
        }

        if (error) {
            throw new HttpException(
                'There was an error while trying to remove the project or some tools from the project',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }

        return id
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
