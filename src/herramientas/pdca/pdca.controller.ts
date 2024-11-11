import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { PdcaService } from './pdca.service'
import { PdcaDto } from './pdca.dto'

@ApiTags('pdca')
@Controller('pdca')
export class PdcaController {
    constructor(private readonly pdcaService: PdcaService) {}

    @Get(':pdcaId')
    @ApiOperation({ summary: 'Find a PDCA by ID' })
    @ApiParam({ name: 'pdcaId', description: 'ID of the PDCA to retrieve' })
    @ApiResponse({ status: 200, description: 'Returns the PDCA details' })
    @ApiResponse({ status: 404, description: 'PDCA not found' })
    async findById(@Param('pdcaId') pdcaId: string) {
        const pdca = await this.pdcaService.findById(pdcaId)
        return pdca
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new PDCA' })
    @ApiResponse({ status: 201, description: 'PDCA successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async createPdca(@Body() pdcaDto: PdcaDto) {
        const pdca = await this.pdcaService.createPdca(pdcaDto)
        return pdca
    }

    @Patch(':pdcaId')
    @ApiOperation({ summary: 'Edit an existing PDCA' })
    @ApiParam({ name: 'pdcaId', description: 'ID of the PDCA to edit' })
    @ApiResponse({ status: 200, description: 'PDCA successfully updated' })
    @ApiResponse({ status: 404, description: 'PDCA not found' })
    async editPdca(@Param('pdcaId') pdcaId: string, @Body() pdcaDto: PdcaDto) {
        const pdca = await this.pdcaService.editPdca(pdcaId, pdcaDto)
        return pdca
    }

    @Delete(':pdcaId')
    @ApiOperation({ summary: 'Delete a PDCA by ID' })
    @ApiParam({ name: 'pdcaId', description: 'ID of the PDCA to delete' })
    @ApiResponse({ status: 200, description: 'PDCA successfully deleted' })
    @ApiResponse({ status: 404, description: 'PDCA not found' })
    async deletePdca(@Param('pdcaId') pdcaId: string) {
        return await this.pdcaService.deletePdca(pdcaId)
    }
}
