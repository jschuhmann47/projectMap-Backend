import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NestMiddleware,
    NotFoundException,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from '../auth/auth.service'
import { ProjectService } from 'src/project/project.service'
import mongoose from 'mongoose'

@UseGuards(AuthGuard('jwt'))
@Injectable()
export class ProjectPermissionsMiddleware implements NestMiddleware {
    constructor(
        private authService: AuthService,
        private projectService: ProjectService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (token == 'undefined' || !token) {
            throw new UnauthorizedException()
        }
        const { email } = await this.authService.verifyToken(token)
        const user = await this.authService.validateUser({ email })
        const projectId = req.url.split('/')[1]
        if (projectId === '') {
            next()
            return
        }
        if (!mongoose.isValidObjectId(projectId)) {
            throw new BadRequestException()
        }
        const project = await this.projectService.getOne(projectId)
        if (!project) {
            throw new NotFoundException()
        }
        const hasPermissions =
            user.isAdmin ||
            project.coordinators.some((u) => u._id.toString() == projectId) ||
            project.participants.some((p) => p.user._id.toString() == projectId)
        if (!hasPermissions) {
            throw new ForbiddenException()
        }
        next()
    }
}
