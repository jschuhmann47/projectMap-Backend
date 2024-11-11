import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { FactorDto, PestelDto } from './pestel.dto'
import { PestelService } from './pestel.service'

@UseGuards(AuthGuard('jwt'))
@ApiTags('pestel')
@Controller('pestel')
export class PestelController {
    constructor(private pestelService: PestelService) {}

    @Get('')
    @ApiOperation({ summary: 'Retrieve all PESTEL records' })
    @ApiResponse({ status: 200, description: 'List of all PESTEL records' })
    async getAll() {
        const pestels = await this.pestelService.getAll()
        return pestels
    }

    @Get('options')
    @ApiOperation({ summary: 'Retrieve PESTEL options' })
    @ApiResponse({
        status: 200,
        description: 'Returns available options for PESTEL',
    })
    async getOptions() {
        return await this.pestelService.getOptions()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific PESTEL record by ID' })
    @ApiParam({
        name: 'id',
        description: 'ID of the PESTEL record to retrieve',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the PESTEL record details',
    })
    @ApiResponse({ status: 404, description: 'PESTEL record not found' })
    async getOne(@Param('id') id: string) {
        const pestel = await this.pestelService.getOne(id)
        return pestel
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new PESTEL record' })
    @ApiResponse({
        status: 201,
        description: 'PESTEL record successfully created',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() pestelDTO: PestelDto) {
        const pestel = await this.pestelService.create(pestelDTO)
        return pestel
    }

    @Post(':id/factor')
    @ApiOperation({ summary: 'Add a factor to an existing PESTEL record' })
    @ApiParam({ name: 'id', description: 'ID of the PESTEL record' })
    @ApiResponse({ status: 201, description: 'Factor successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insertRelation(
        @Param('id') id: string,
        @Body() factorDTO: FactorDto
    ) {
        const pestel = await this.pestelService.insertFactor(id, factorDTO)
        return pestel
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing PESTEL record' })
    @ApiParam({ name: 'id', description: 'ID of the PESTEL record' })
    @ApiResponse({
        status: 200,
        description: 'PESTEL record successfully updated',
    })
    @ApiResponse({ status: 404, description: 'PESTEL record not found' })
    async update(@Param('id') id: string, @Body() pestelDTO: PestelDto) {
        const pestel = await this.pestelService.update(id, pestelDTO)
        return pestel
    }

    @Delete(':id/factor/:idFactor')
    @ApiOperation({ summary: 'Delete a factor from a PESTEL record' })
    @ApiParam({ name: 'id', description: 'ID of the PESTEL record' })
    @ApiParam({ name: 'idFactor', description: 'ID of the factor to delete' })
    @ApiResponse({ status: 200, description: 'Factor successfully deleted' })
    @ApiResponse({
        status: 404,
        description: 'PESTEL record or factor not found',
    })
    async deleteFactor(
        @Param('id') id: string,
        @Param('idFactor') idFactor: string
    ) {
        const response = await this.pestelService.deleteFactor(id, idFactor)
        return response
    }

    @Put(':id/factor/:idFactor')
    @ApiOperation({ summary: 'Edit a factor in a PESTEL record' })
    @ApiParam({ name: 'id', description: 'ID of the PESTEL record' })
    @ApiParam({ name: 'idFactor', description: 'ID of the factor to edit' })
    @ApiResponse({ status: 200, description: 'Factor successfully updated' })
    @ApiResponse({
        status: 404,
        description: 'PESTEL record or factor not found',
    })
    async editFactor(
        @Param('id') id: string,
        @Param('idFactor') idFactor: string,
        @Body() updatedFactor: FactorDto
    ) {
        const response = await this.pestelService.editFactor(
            id,
            idFactor,
            updatedFactor
        )
        return response
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a PESTEL record by ID' })
    @ApiParam({ name: 'id', description: 'ID of the PESTEL record to delete' })
    @ApiResponse({
        status: 200,
        description: 'PESTEL record successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'PESTEL record not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.pestelService.delete(id)
        return {
            _id: documentId,
        }
    }
}
