import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BulkEditQuestions, PorterDto, PreguntaDto } from './porter.dto'
import { Porter } from './porter.schema'
import { PorterService } from './porter.service'

@ApiTags('porter')
@Controller('porter')
export class PorterController {
    constructor(private porterService: PorterService) {}

    @Post('')
    async insert(@Body() porterDto: PorterDto) {
        const porter = await this.porterService.create(porterDto)
        return porter
    }

    @Get('options')
    async getOptions() {
        return await this.porterService.getOptions()
    }

    @Get('preguntas')
    async getPreguntas() {
        return this.porterService.getPreguntas()
    }

    @Get(':porterId')
    async findById(@Param('porterId') porterId: string) {
        const porters = await this.porterService.getById(porterId)
        return porters
    }

    @Post(':porterId/preguntas')
    async addPregunta(
        @Param('porterId') porterId: string,
        @Body() question: PreguntaDto
    ) {
        return this.porterService.addQuestion(porterId, question)
    }

    @Delete(':porterId/preguntas/:questionId')
    async deletePregunta(
        @Param('porterId') porterId: string,
        @Param('questionId') questionId: string
    ) {
        return this.porterService.deleteQuestion(porterId, questionId)
    }

    @Put(':porterId/preguntas/:questionId')
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
    async replaceQuestions(
        @Param('porterId') porterId: string,
        @Body() questions: BulkEditQuestions
    ) {
        return this.porterService.replaceQuestions(porterId, questions)
    }

    @Get(':porterId/consejos')
    async getConsejos(@Param('porterId') porterId: string) {
        const porter = await this.porterService.getById(porterId)
        return this.porterService.calcularConsejos((porter as Porter).preguntas)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        const documentId = await this.porterService.delete(id)
        return {
            _id: documentId,
        }
    }
}
