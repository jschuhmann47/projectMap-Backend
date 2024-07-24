import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { BalancedScorecardService } from '../herramientas/balancedScorecard/balancedScorecard.service'
import { FodaService } from '../herramientas/foda/foda.service'
import { PestelService } from '../herramientas/pestel/pestel.service'
import { AnsoffService } from '../herramientas/ansoff/ansoff.service'
import { MckinseyService } from '../herramientas/mckinsey/mckinsey.service'
import { OkrService } from '../herramientas/okr/okr.service'
import { PorterService } from '../herramientas/porter/porter.service'
import { QuestionnaireService } from '../herramientas/questionnaire/questionnaire.service'
import {
    ProjectDto,
    ShareProjectDto,
    ShareProjectEmailDto,
    StopSharingProjectEmailDto,
    UpdateParticipantDto,
} from './project.dto'
import { ProjectService } from './project.service'

@UseGuards(AuthGuard('jwt'))
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(
        private projectService: ProjectService,
        private fodaService: FodaService,
        private pestelService: PestelService,
        private ansoffService: AnsoffService,
        private porterService: PorterService,
        private mckinseyService: MckinseyService,
        private okrService: OkrService,
        private balancedService: BalancedScorecardService,
        private questionnaireService: QuestionnaireService
    ) {}

    @Get('')
    async getAllUserProjects(@Req() req: { user: { id: string } }) {
        const { id } = req.user
        const projects = await this.projectService.findUserProjects(id)
        return projects
    }

    @Get('search')
    async searchProjects(@Query() query) {
        const name = query['name']
        const projects = await this.projectService.findProjectsByName(name)
        return projects
    }

    @Get('shared')
    async getAllSharedProjects() {
        const projects = await this.projectService.findSharedProjects()
        return projects
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const project = await this.projectService.getOne(id)
        return project
    }

    @Get(':projectId/shared')
    async getSharedUsers(@Param('projectId') projectId: string) {
        return this.projectService.getSharedUsers(projectId)
    }

    @Get(':id/foda')
    async getFoda(@Param('id') id: string) {
        const fodas = await this.fodaService.getAllByProjectId(id)
        return fodas
    }

    @Get(':id/pestel')
    async getPestel(@Param('id') id: string) {
        const pestels = await this.pestelService.getAllByProjectId(id)
        return pestels
    }

    @Get(':id/ansoff')
    async getAnsoff(@Param('id') id: string) {
        const ansoffs = await this.ansoffService.getAllByProjectId(id)
        return ansoffs
    }

    @Get(':projectId/porter')
    async getPorter(@Param('projectId') projectId: string) {
        const porters = await this.porterService.getAllByProjectId(projectId)
        return porters
    }

    @Get(':projectId/mckinsey')
    async getMcKinsey(@Param('projectId') projectId: string) {
        const mckinseys =
            await this.mckinseyService.getAllByProjectId(projectId)
        return mckinseys
    }

    @Get(':projectId/okr-projects')
    async getOkr(@Param('projectId') projectId: string) {
        return this.okrService.getAllByProjectId(projectId)
    }

    @Get(':projectId/balanced-scorecards')
    async getBalancedScorecards(@Param('projectId') projectId: string) {
        return this.balancedService.getAllByProjectId(projectId)
    }

    @Get(':projectId/questionnaires')
    async getQuestionnaires(@Param('projectId') projectId: string) {
        return this.questionnaireService.findByProjectId(projectId)
    }

    @Post('')
    async insert(
        @Req() req: { user: { id: string } },
        @Body() projectDTO: ProjectDto
    ) {
        const { id } = req.user

        projectDTO.owner = id

        const project = await this.projectService.create(projectDTO)
        return project
    }

    @Post(':projectId/share')
    async shareProject(
        @Param('projectId') projectId: string,
        @Body() shareProjectDto: ShareProjectDto
    ) {
        const project = await this.projectService.shareProject(
            projectId,
            shareProjectDto.users
        )
        return project
    }

    @Post(':projectId/share/email')
    async shareProjectEmail(
        @Param('projectId') projectId: string,
        @Body() shareProjectDto: ShareProjectEmailDto
    ) {
        return this.projectService.shareProjectByEmail(
            projectId,
            shareProjectDto.email
        )
    }

    @Delete(':projectId/share')
    async stopSharing(
        @Param('projectId') projectId: string,
        @Param('userId') userId: string
    ) {
        const project = await this.projectService.removeUserFromProject(
            projectId,
            userId
        )
        return project
    }

    @Put(':projectId/share/email/stop')
    async stopSharingEmail(
        @Param('projectId') projectId: string,
        @Body() stopSharingProjectEmailDto: StopSharingProjectEmailDto
    ) {
        return this.projectService.removeUserFromProjectByEmail(
            projectId,
            stopSharingProjectEmailDto.emails
        )
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() projectDTO: ProjectDto) {
        const project = await this.projectService.update(id, projectDTO)
        return project
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const projectId = await this.projectService.delete(id)
        return {
            _id: projectId,
        }
    }

    @Put(':id/update-participant-role')
    async updateParticipantRole(
        @Param('id') projectId: string,
        @Body() projectDTO: UpdateParticipantDto
    ) {
        console.log('vengo por aca')
        console.log({ projectDTO })
        const project = await this.projectService.updateParticipantRole(
            projectId,
            projectDTO
        )
        return project
    }

    @Put(':id/update-coordinator-role')
    async updateCoordinatorRole(
        @Param('id') projectId: string,
        @Body() projectDTO: { userEmail: string }
    ) {
        const project = await this.projectService.updateCoordinatorRole(
            projectId,
            projectDTO.userEmail
        )
        return project
    }
}
