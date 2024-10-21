import {
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
    private toolServiceMap: Map<
        Tool,
        (toolId: string) => Promise<Document | null>
    >
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
        this.toolServiceMap = new Map()

        this.toolServiceMap.set(Tool.Porter, (toolId) =>
            this.porterService.getById(toolId)
        )
        this.toolServiceMap.set(Tool.Pestel, (toolId) =>
            this.pestelService.getOne(toolId)
        )
        this.toolServiceMap.set(Tool.Foda, (toolId) =>
            this.fodaService.getOne(toolId)
        )
        this.toolServiceMap.set(Tool.Ansoff, (toolId) =>
            this.ansoffService.findById(toolId)
        )
        this.toolServiceMap.set(Tool.McKinsey, (toolId) =>
            this.mckinseyService.findById(toolId)
        )
        this.toolServiceMap.set(Tool.Questionnaires, (toolId) =>
            this.questionnairesService.findById(toolId)
        )
        this.toolServiceMap.set(Tool.BalacedScorecard, (toolId) =>
            this.balancedScorecardService.findById(toolId)
        )
        this.toolServiceMap.set(Tool.Okr, (toolId) =>
            this.okrService.findById(toolId)
        )
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
        const toolId = req.url.slice(1).split('/')[0]
        const tool = req.baseUrl.slice(1)

        // if we're POSTing a new instance of a tool, the projectId will come from the body,
        // and toolId will be '', as it doesn't exist yet :P
        let projectId: string
        if (toolId) {
            projectId = await this.getProjectId(tool, toolId)
        } else {
            projectId = req.body.projectId
        }

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
            !userStagePermission.permission ||
            (userStagePermission &&
                userStagePermission.permission != Permission.Edit)
        ) {
            throw new ForbiddenException(
                'User is not available to edit this stage'
            )
        }
        next()
    }

    async getProjectId(tool: string, toolId: string) {
        if (!isValidTool(tool)) {
            return ''
        }
        let document: Document | null
        if (this.toolServiceMap.has(tool as Tool)) {
            document = await this.toolServiceMap.get(tool as Tool)!(toolId)
            if (document) {
                return document.id // check
            }
            return ''
        } else {
            throw new Error('Unknown tool type')
        }
    }
}
