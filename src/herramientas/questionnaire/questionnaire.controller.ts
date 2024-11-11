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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { QuestionnaireService } from './questionnaire.service'
import { AnswerDto, QuestionnaireDto } from './questionnaire.dto'

@Controller('questionnaires')
@ApiTags('questionnaires')
@UseGuards(AuthGuard('jwt'))
export class QuestionnaireController {
    constructor(private questionnaireService: QuestionnaireService) {}

    @Get('questions')
    @ApiOperation({ summary: 'Retrieve all questions for questionnaires' })
    @ApiResponse({ status: 200, description: 'List of all questions' })
    getQuestions() {
        return this.questionnaireService.getQuestions()
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new questionnaire' })
    @ApiResponse({
        status: 201,
        description: 'Questionnaire successfully created',
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    create(@Body() questionnaireDto: QuestionnaireDto) {
        return this.questionnaireService.create(questionnaireDto)
    }

    @Put(':id/answers')
    @ApiOperation({ summary: 'Answer questions in a questionnaire' })
    @ApiParam({ name: 'id', description: 'ID of the questionnaire' })
    @ApiResponse({ status: 200, description: 'Answers successfully submitted' })
    @ApiResponse({ status: 404, description: 'Questionnaire not found' })
    answerQuestions(@Param('id') id: string, @Body() answers: AnswerDto[]) {
        return this.questionnaireService.answerQuestionnaire(id, answers)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a questionnaire by ID' })
    @ApiParam({
        name: 'id',
        description: 'ID of the questionnaire to retrieve',
    })
    @ApiResponse({
        status: 200,
        description: 'Returns the questionnaire details',
    })
    @ApiResponse({ status: 404, description: 'Questionnaire not found' })
    findById(@Param('id') id: string) {
        return this.questionnaireService.findById(id)
    }

    @Get(':id/chapters/:chapterId/questions/:questionId')
    @ApiOperation({ summary: 'Find a specific question in a questionnaire' })
    @ApiParam({ name: 'id', description: 'ID of the questionnaire' })
    @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
    @ApiParam({ name: 'questionId', description: 'ID of the question' })
    @ApiResponse({ status: 200, description: 'Returns the question details' })
    @ApiResponse({
        status: 404,
        description: 'Question or questionnaire not found',
    })
    findQuestion(
        @Param('id') id: string,
        @Param('chapterId') chapterId: number,
        @Param('questionId') questionId: number
    ) {
        return this.questionnaireService.getQuestion(id, chapterId, questionId)
    }

    @Put(':id/chapters/:chapterId/questions/:questionId/answers/:answerId')
    @ApiOperation({ summary: 'Edit an answer in a specific question' })
    @ApiParam({ name: 'id', description: 'ID of the questionnaire' })
    @ApiParam({ name: 'chapterId', description: 'ID of the chapter' })
    @ApiParam({ name: 'questionId', description: 'ID of the question' })
    @ApiParam({ name: 'answerId', description: 'ID of the answer to edit' })
    @ApiResponse({ status: 200, description: 'Answer successfully updated' })
    @ApiResponse({
        status: 404,
        description: 'Answer or questionnaire not found',
    })
    editAnswer(
        @Param('id') id: string,
        @Param('chapterId') chapterId: number,
        @Param('questionId') questionId: number,
        @Param('answerId') answerId: number
    ) {
        return this.questionnaireService.editAnswer(
            id,
            chapterId,
            questionId,
            answerId
        )
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a questionnaire by ID' })
    @ApiParam({ name: 'id', description: 'ID of the questionnaire to delete' })
    @ApiResponse({
        status: 200,
        description: 'Questionnaire successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'Questionnaire not found' })
    async delete(@Param('id') id: string) {
        const documentId = await this.questionnaireService.delete(id)
        return {
            _id: documentId,
        }
    }
}
