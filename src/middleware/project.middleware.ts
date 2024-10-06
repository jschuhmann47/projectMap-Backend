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

@UseGuards(AuthGuard('jwt'))
@Injectable()
export class ProjectStageUserEditionMiddleware implements NestMiddleware {
    constructor(
        private okrService: OkrService,
        private projectService: ProjectService,
        private authService: AuthService
    ) {}

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
        const toolId = req.url.slice(1) //check
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
            case Tool.Okr:
                projectId = await this.okrService.findById(toolId)
                if (projectId) {
                    return projectId._id.toString()
                }
                break
        }
        return ''
    }
}
