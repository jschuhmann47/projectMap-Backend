import { ForbiddenException, HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { ProjectService } from '../project/project.service';
import { fromToolToStage, isValidTool, Permission } from '../project/stage.schema';
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth/auth.service';

@UseGuards(AuthGuard('jwt'))
@Injectable()
export class ProjectStageUserEditionMiddleware implements NestMiddleware {

  constructor(private projectService: ProjectService, private authService: AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split('Bearer ')[1];
    const { email } = await this.authService.verifyToken(token);
    const { projectId } = req.body;
    const tool = req.path.slice(1);

    if (!projectId || !email || !tool || !isValidTool(tool)) {
      throw new HttpException('Campos faltantes', HttpStatus.BAD_REQUEST)
    }

    const stage = fromToolToStage(tool);

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
      console.log(`El usuario: ${email} no tiene permisos para editar la herramietna ${tool} bajo el stage: ${stage}`)
      throw new ForbiddenException(
        'User is not available to edit this stage'
      )
    }
    next();
  }
}
