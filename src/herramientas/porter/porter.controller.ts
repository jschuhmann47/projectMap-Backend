import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { BulkEditQuestions, PorterDto, PreguntaDto } from './porter.dto'
import { Porter } from './porter.schema'
import { PorterService } from './porter.service'

@ApiTags('porter')
@Controller('porter')
export class PorterController {
    constructor(private porterService: PorterService) {}

    @Post('')
    @ApiOperation({ summary: 'Create a new Porter record' })
    @ApiResponse({
        status: 201,
        description: 'Porter record successfully created',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async insert(@Body() porterDto: PorterDto) {
        const porter = await this.porterService.create(porterDto)
        return porter
    }

    @Get('options')
    @ApiOperation({ summary: 'Retrieve Porter options' })
    @ApiResponse({
        status: 200,
        description: 'Returns available options for Porter',
    })
    async getOptions() {
        return await this.porterService.getOptions()
    }

    @Get('preguntas')
    @ApiOperation({ summary: 'Retrieve all questions' })
    @ApiResponse({ status: 200, description: 'List of all questions' })
    async getPreguntas() {
        return this.porterService.getPreguntas()
    }

    @Get(':porterId')
    @ApiOperation({ summary: 'Get a specific Porter record by ID' })
    @ApiParam({
        name: 'porterId',
        description: 'ID of the Porter record to retrieve',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the Porter record details',
    })
    @ApiResponse({ status: 404, description: 'Porter record not found' })
    async findById(@Param('porterId') porterId: string) {
        const porters = await this.porterService.getById(porterId)
        return porters
    }

    @Post(':porterId/preguntas')
    @ApiOperation({ summary: 'Add a question to a Porter record' })
    @ApiParam({ name: 'porterId', description: 'ID of the Porter record' })
    @ApiResponse({ status: 201, description: 'Question successfully added' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async addPregunta(
        @Param('porterId') porterId: string,
        @Body() question: PreguntaDto
    ) {
        return this.porterService.addQuestion(porterId, question)
    }

    @Delete(':porterId/preguntas/:questionId')
    @ApiOperation({ summary: 'Delete a question from a Porter record' })
    @ApiParam({ name: 'porterId', description: 'ID of the Porter record' })
    @ApiParam({
        name: 'questionId',
        description: 'ID of the question to delete',
    })
    @ApiResponse({ status: 200, description: 'Question successfully deleted' })
    @ApiResponse({
        status: 404,
        description: 'Porter record or question not found',
    })
    async deletePregunta(
        @Param('porterId') porterId: string,
        @Param('questionId') questionId: string
    ) {
        return this.porterService.deleteQuestion(porterId, questionId)
    }

    @Put(':porterId/preguntas/:questionId')
    @ApiOperation({ summary: 'Edit a question in a Porter record' })
    @ApiParam({ name: 'porterId', description: 'ID of the Porter record' })
    @ApiParam({ name: 'questionId', description: 'ID of the question to edit' })
    @ApiResponse({ status: 200, description: 'Question successfully updated' })
    @ApiResponse({
        status: 404,
        description: 'Porter record or question not found',
    })
    async editQuestion(
        @Param('porterId') porterId: string,
        @Param('questionId') questionId: string,
        @Body() questionDto: PreguntaDto
    ) {
        const porter = await this.porterService.editQuestion(
            porterId,
            questionId,
            questionDto
        )
        return porter
    }

    @Post(':porterId/preguntas/replace')
    @ApiOperation({ summary: 'Replace all questions in a Porter record' })
    @ApiParam({ name: 'porterId', description: 'ID of the Porter record' })
    @ApiResponse({
        status: 200,
        description: 'Questions successfully replaced',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async replaceQuestions(
        @Param('porterId') porterId: string,
        @Body() questions: BulkEditQuestions
    ) {
        return this.porterService.replaceQuestions(porterId, questions)
    }

    @Get(':porterId/consejos')
    @ApiOperation({ summary: 'Get consejos for a Porter record' })
    @ApiParam({ name: 'porterId', description: 'ID of the Porter record' })
    @ApiResponse({
        status: 200,
        description: 'Returns calculated consejos based on questions',
    })
    async getConsejos(@Param('porterId') porterId: string) {
        const porter = await this.porterService.getById(porterId)
        return this.porterService.calcularConsejos((porter as Porter).preguntas)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Porter record by ID' })
    @ApiParam({ name: 'id', description: 'ID of the Porter record to delete' })
    @ApiResponse({
        status: 200,
        description: 'Porter record successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'Porter record not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.porterService.delete(id)
        return {
            _id: documentId,
        }
    }
}
