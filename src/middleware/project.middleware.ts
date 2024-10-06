import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { NextFunction, Request, Response } from 'express'
import { OkrService } from '../herramientas/okr/okr.service'
import { AuthService } from '../auth/auth.service'
import { ProjectService } from '../project/project.service'
import {
    fromToolToStage,
    isValidTool,
    Permission,
    Tool,
} from '../project/stage.schema'
import { Document } from 'mongoose'
import { PorterService } from 'src/herramientas/porter/porter.service'
import { PestelService } from 'src/herramientas/pestel/pestel.service'
import { FodaService } from 'src/herramientas/foda/foda.service'
import { AnsoffService } from 'src/herramientas/ansoff/ansoff.service'
import { QuestionnaireService } from 'src/herramientas/questionnaire/questionnaire.service'
import { BalancedScorecardService } from 'src/herramientas/balancedScorecard/balancedScorecard.service'
import { MckinseyService } from 'src/herramientas/mckinsey/mckinsey.service'

@UseGuards(AuthGuard('jwt'))
@Injectable()
export class ProjectStageUserEditionMiddleware implements NestMiddleware {
    private toolServiceMap: Map<Tool, any>
    constructor(
        private okrService: OkrService,
        private projectService: ProjectService,
        private authService: AuthService,
        private porterService: PorterService,
        private pestelService: PestelService,
        private fodaService: FodaService,
        private ansoffService: AnsoffService,
        private mckinseyService: MckinseyService,
        private questionnairesService: QuestionnaireService,
        private balancedScorecardService: BalancedScorecardService
    ) {
        this.toolServiceMap = new Map([
            [Tool.Porter, (toolId) => this.porterService.getById(toolId)],
            [Tool.Pestel, (toolId) => this.pestelService.getOne(toolId)],
            [Tool.Foda, (toolId) => this.fodaService.getOne(toolId)],
            [Tool.Ansoff, (toolId) => this.ansoffService.findById(toolId)],
            [Tool.McKinsey, (toolId) => this.mckinseyService.findById(toolId)],
            [Tool.Questionnaires, (toolId) => this.questionnairesService.findById(toolId)],
            [Tool.BalacedScorecard, (toolId) => this.balancedScorecardService.findById(toolId)],
            [Tool.Okr, (toolId) => this.okrService.findById(toolId)]
        ]);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException(
                'Authorization token missing or invalid'
            )
        }

        const token = authHeader.split('Bearer ')[1]
        if (token == 'undefined' || !token) {
            throw new UnauthorizedException()
        }
        const { email } = await this.authService.verifyToken(token)
        const toolId = req.url.slice(1)
        const tool = req.baseUrl.slice(1)
        const projectId = await this.getTool(tool, toolId)

        if (!email || !projectId) {
            throw new HttpException('Campos faltantes', HttpStatus.BAD_REQUEST)
        }

        const stage = fromToolToStage(tool)

        const userStagePermission =
            await this.projectService.getUserStagePermission(
                projectId,
                email,
                stage
            )

        if (
            !userStagePermission ||
            (userStagePermission &&
                userStagePermission.permission != Permission.Edit)
        ) {
            throw new ForbiddenException(
                'User is not available to edit this stage'
            )
        }
        next()
    }

    async getTool(tool: string, toolId: string) {
        if (!isValidTool(tool)) {
            return ''
        }
        let projectId: Document
        switch (tool) {
            case Tool.Porter:
                projectId = await this.porterService.getById(toolId)
                break
            case Tool.Pestel:
                projectId = await this.pestelService.getOne(toolId)
                break
            case Tool.Foda:
                projectId = await this.fodaService.getOne(toolId)
                break
            case Tool.Ansoff:
                projectId = await this.ansoffService.findById(toolId)
                break
            case Tool.McKinsey:
                projectId = await this.mckinseyService.findById(toolId)
                break
            case Tool.Questionnaires:
                projectId = await this.questionnairesService.findById(toolId)
                break
            case Tool.BalacedScorecard:
                projectId = await this.balancedScorecardService.findById(toolId)
                break
            case Tool.Okr:
                projectId = await this.okrService.findById(toolId)
                break
            default:
                throw new BadRequestException('Invalid tool')
        }
        if (projectId) {
            return projectId._id.toString()
        }
        return ''
    }
}
