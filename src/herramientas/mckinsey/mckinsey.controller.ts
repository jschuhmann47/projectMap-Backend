import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { MckinseyService } from './mckinsey.service'
import { McKinseyDto, UnidadDeNegocioDto } from './mckinsey.dto'
import {
    ApiExtraModels,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger'

@Controller('mckinsey')
@ApiTags('mckinsey')
@ApiExtraModels(UnidadDeNegocioDto) // Registra el modelo adicional para documentación de Swagger
export class MckinseyController {
    constructor(private mckinseyService: MckinseyService) {}

    @Post('')
    @ApiOperation({ summary: 'Create a new McKinsey record' })
    @ApiResponse({
        status: 201,
        description: 'McKinsey record successfully created',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() mcKinseyDto: McKinseyDto) {
        const mckinsey = await this.mckinseyService.create(mcKinseyDto)
        return mckinsey
    }

    @Get('projects/:projectId')
    @ApiOperation({
        summary: 'Get all McKinsey records for a specific project',
    })
    @ApiParam({
        name: 'projectId',
        description: 'ID of the project to retrieve McKinsey records for',
    })
    @ApiResponse({
        status: 200,
        description: 'List of McKinsey records for the specified project',
    })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async findByProjectId(@Param('projectId') projectId: string) {
        const mcKinsey = await this.mckinseyService.getAllByProjectId(projectId)
        return mcKinsey
    }

    @Get(':mcKinseyId')
    @ApiOperation({ summary: 'Find a McKinsey record by ID' })
    @ApiParam({
        name: 'mcKinseyId',
        description: 'ID of the McKinsey record to retrieve',
    })
    @ApiResponse({ status: 200, description: 'McKinsey record details' })
    @ApiResponse({ status: 404, description: 'McKinsey record not found' })
    async findById(@Param('mcKinseyId') mcKinseyId: string) {
        const mcKinsey = await this.mckinseyService.findById(mcKinseyId)
        return mcKinsey
    }

    @Put(':mcKinseyId/unidades/:unidadId')
    @ApiOperation({ summary: 'Edit a business unit in a McKinsey record' })
    @ApiParam({ name: 'mcKinseyId', description: 'ID of the McKinsey record' })
    @ApiParam({
        name: 'unidadId',
        description: 'ID of the business unit to edit',
    })
    @ApiResponse({
        status: 200,
        description: 'Business unit successfully updated',
    })
    @ApiResponse({
        status: 404,
        description: 'McKinsey record or business unit not found',
    })
    async editUnidadDeNegocio(
        @Param('mcKinseyId') mcKinseyId: string,
        @Param('unidadId') unidadId: string,
        @Body() unidadDeNegocioDto: UnidadDeNegocioDto
    ) {
        const mcKinsey = await this.mckinseyService.editUnidadDeNegocio(
            mcKinseyId,
            unidadId,
            unidadDeNegocioDto
        )
        return mcKinsey
    }

    @Delete(':mcKinseyId/unidades/:unidadId')
    @ApiOperation({ summary: 'Delete a business unit from a McKinsey record' })
    @ApiParam({ name: 'mcKinseyId', description: 'ID of the McKinsey record' })
    @ApiParam({
        name: 'unidadId',
        description: 'ID of the business unit to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'Business unit successfully deleted',
    })
    @ApiResponse({
        status: 404,
        description: 'McKinsey record or business unit not found',
    })
    async removeUnidadDeNegocio(
        @Param('mcKinseyId') mcKinseyId: string,
        @Param('unidadId') unidadId: string
    ) {
        const mcKinsey = await this.mckinseyService.removeUnidadDeNegocio(
            mcKinseyId,
            unidadId
        )
        return mcKinsey
    }

    @Post(':mcKinseyId/unidades')
    @ApiOperation({ summary: 'Add a business unit to a McKinsey record' })
    @ApiParam({ name: 'mcKinseyId', description: 'ID of the McKinsey record' })
    @ApiResponse({
        status: 201,
        description: 'Business unit successfully added',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addUnidadDeNegocio(
        @Param('mcKinseyId') mcKinseyId: string,
        @Body() unidadDeNegocioDto: UnidadDeNegocioDto
    ) {
        const mcKinsey = await this.mckinseyService.addUnidadDeNegocio(
            mcKinseyId,
            unidadDeNegocioDto
        )
        return mcKinsey
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a McKinsey record by ID' })
    @ApiParam({
        name: 'id',
        description: 'ID of the McKinsey record to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'McKinsey record successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'McKinsey record not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.mckinseyService.delete(id)
        return {
            _id: documentId,
        }
    }
}
