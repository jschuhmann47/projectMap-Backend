import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    Post,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FactorDto, FodaDto } from './foda.dto'
import { FodaService } from './foda.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger'

@UseGuards(AuthGuard('jwt'))
@ApiTags('foda')
@ApiBearerAuth() // Requiere autenticación JWT
@Controller('foda')
export class FodaController {
    constructor(private fodaService: FodaService) {}

    @Get('options')
    @ApiOperation({ summary: 'Retrieve FODA options' })
    @ApiResponse({
        status: 200,
        description: 'Returns available options for FODA',
    })
    async getOptions() {
        const options = await this.fodaService.getOptions()
        return options
    }

    @Get('preSeeds')
    @ApiOperation({ summary: 'Retrieve pre-seed data for FODA' })
    @ApiResponse({
        status: 200,
        description: 'Returns pre-seed data for FODA analysis',
    })
    async getPreSeeds() {
        const preSeeds = await this.fodaService.getPreSeeds()
        return preSeeds
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific FODA by ID' })
    @ApiParam({ name: 'id', description: 'ID of the FODA to retrieve' })
    @ApiResponse({ status: 200, description: 'Returns the FODA data' })
    @ApiResponse({ status: 404, description: 'FODA not found' })
    async getOne(@Param('id') id: string) {
        const foda = await this.fodaService.getOne(id)
        return foda
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new FODA' })
    @ApiResponse({ status: 201, description: 'FODA successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() fodaDTO: FodaDto) {
        const foda = await this.fodaService.create(fodaDTO)
        return foda
    }

    @Post(':id/factor')
    @ApiOperation({ summary: 'Add a factor to an existing FODA' })
    @ApiParam({ name: 'id', description: 'ID of the FODA to add a factor to' })
    @ApiResponse({ status: 201, description: 'Factor successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insertRelation(
        @Param('id') id: string,
        @Body() factorDTO: FactorDto
    ) {
        const foda = await this.fodaService.insertFactor(id, factorDTO)
        return foda
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing FODA' })
    @ApiParam({ name: 'id', description: 'ID of the FODA to update' })
    @ApiResponse({ status: 200, description: 'FODA successfully updated' })
    @ApiResponse({ status: 404, description: 'FODA not found' })
    async update(@Param('id') id: string, @Body() fodaDTO: FodaDto) {
        const foda = await this.fodaService.update(id, fodaDTO)
        return foda
    }

    @Put(':id/factor/:idFactor')
    @ApiOperation({ summary: 'Update a specific factor in a FODA' })
    @ApiParam({ name: 'id', description: 'ID of the FODA' })
    @ApiParam({ name: 'idFactor', description: 'ID of the factor to update' })
    @ApiResponse({ status: 200, description: 'Factor successfully updated' })
    @ApiResponse({ status: 404, description: 'FODA or factor not found' })
    async updateFactor(
        @Param('id') id: string,
        @Param('idFactor') idFactor: string,
        @Body() factorDTO: FactorDto
    ) {
        const foda = await this.fodaService.updateFactor(
            id,
            idFactor,
            factorDTO
        )
        return foda
    }

    @Delete(':id/factor/:idFactor')
    @ApiOperation({ summary: 'Delete a specific factor from a FODA' })
    @ApiParam({ name: 'id', description: 'ID of the FODA' })
    @ApiParam({ name: 'idFactor', description: 'ID of the factor to delete' })
    @ApiResponse({ status: 200, description: 'Factor successfully deleted' })
    @ApiResponse({ status: 404, description: 'FODA or factor not found' })
    async deleteFactor(
        @Param('id') id: string,
        @Param('idFactor') idFactor: string
    ) {
        const response = await this.fodaService.deleteFactor(id, idFactor)
        return response
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a FODA by ID' })
    @ApiParam({ name: 'id', description: 'ID of the FODA to delete' })
    @ApiResponse({ status: 200, description: 'FODA successfully deleted' })
    @ApiResponse({ status: 404, description: 'FODA not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.fodaService.delete(id)
        return {
            _id: documentId,
        }
    }
}
