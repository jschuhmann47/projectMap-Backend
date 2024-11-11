import { ApiProperty } from '@nestjs/swagger'

export class AnswerDto {
    @ApiProperty({
        example: 1,
        description: 'ID of the question being answered',
    })
    questionId: number

    @ApiProperty({ example: 2, description: 'ID of the selected answer' })
    answerId: number

    @ApiProperty({
        example: 1,
        description: 'ID of the chapter containing the question',
    })
    chapterId: number
}

export class QuestionnaireDto {
    @ApiProperty({
        example: '7891011',
        description: 'Project ID associated with this questionnaire',
    })
    projectId: string

    @ApiProperty({
        example: 'Customer Feedback Survey',
        description: 'Title of the questionnaire',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Creation date of the questionnaire in ISO format',
    })
    createdAt: Date
}
