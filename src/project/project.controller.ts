import {
    Body,
    Controller,
    Delete,
    Get,
    ImATeapotException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger'
import { ProjectDto } from './project.dto'
import { ProjectService } from './project.service'

@UseGuards(AuthGuard('jwt'))
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(private projectService: ProjectService) {}

    @Get('/shared')
    @ApiOperation({ summary: 'Throws an HTTP 418 error' })
    @ApiResponse({ status: 418, description: "I'm a teapot" })
    async goAway() {
        throw new ImATeapotException()
    }

    @Get('')
    @ApiOperation({ summary: 'Retrieve all projects associated with the user' })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit of projects to retrieve',
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        description: 'Offset for pagination',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term to filter projects',
    })
    @ApiResponse({ status: 200, description: 'List of user projects' })
    async getAllUserProjects(
        @Req() req: { user: { id: string } },
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('search') search: string
    ) {
        const { id } = req.user

        const [projects, total] = await this.projectService.findUserProjects(
            id,
            limit || 10,
            offset || 0,
            search
        )

        return {
            items: projects,
            total,
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a project by ID' })
    @ApiParam({ name: 'id', description: 'ID of the project' })
    @ApiResponse({ status: 200, description: 'Project details' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async findById(@Param('id') id: string) {
        const project = await this.projectService.getOne(id)
        return project
    }

    @Get(':projectId/shared')
    @ApiOperation({ summary: 'Get users who have access to a shared project' })
    @ApiParam({ name: 'projectId', description: 'ID of the project' })
    @ApiResponse({ status: 200, description: 'List of shared users' })
    async getSharedUsers(@Param('projectId') projectId: string) {
        return this.projectService.getSharedUsers(projectId)
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(
        @Req() req: { user: { id: string } },
        @Body() projectDTO: ProjectDto
    ) {
        const { id } = req.user

        projectDTO.requestorId = id

        const project = await this.projectService.create(projectDTO)
        return project
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing project' })
    @ApiParam({ name: 'id', description: 'ID of the project to update' })
    @ApiResponse({ status: 200, description: 'Project successfully updated' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async update(@Param('id') id: string, @Body() projectDTO: ProjectDto) {
        const project = await this.projectService.update(id, projectDTO)
        return project
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project by ID' })
    @ApiParam({ name: 'id', description: 'ID of the project to delete' })
    @ApiResponse({ status: 200, description: 'Project successfully deleted' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async delete(@Param('id') id: string) {
        const projectId = await this.projectService.delete(id)
        return {
            _id: projectId,
        }
    }
}
