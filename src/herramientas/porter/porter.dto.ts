import { ApiProperty } from '@nestjs/swagger'
import { Fuerza } from './fuerza'
import { NivelDeConcordancia } from './nivelDeConcordancia'
import { Pregunta } from './porter.schema'
import { Valoracion } from './valoracion'

export class PorterDto {
    @ApiProperty({
        example: '123456',
        description: 'Unique identifier for the Porter analysis',
    })
    _id: string

    @ApiProperty({
        example: '7891011',
        description: 'Project identifier associated with this Porter analysis',
    })
    projectId: string

    @ApiProperty({
        example: 'Analysis of competitive forces',
        description: 'Title of the Porter analysis',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Date when the Porter analysis was created',
    })
    createdAt: string

    @ApiProperty({
        type: [Pregunta],
        description: 'List of questions associated with the Porter analysis',
    })
    preguntas: Pregunta[]
}

export class PreguntaDto {
    @ApiProperty({
        example: '654321',
        description: 'Unique identifier for the question',
    })
    _id: string

    @ApiProperty({ example: 1, description: 'ID of the question' })
    preguntaId: number

    @ApiProperty({
        enum: Fuerza,
        example: Fuerza.RIVALIDAD_ENTRE_COMPETIDORES,
        description: 'Force associated with the question',
    })
    fuerza: Fuerza

    @ApiProperty({
        enum: NivelDeConcordancia,
        example: NivelDeConcordancia.CONCUERDO_TOTALMENTE,
        description: 'Agreement level',
    })
    nivelDeConcordancia: NivelDeConcordancia

    @ApiProperty({
        enum: Valoracion,
        example: Valoracion.MUY_IMPORTANTE,
        description: 'Valuation of the force',
    })
    valoracion: Valoracion
}

export class BulkEditQuestions {
    @ApiProperty({
        type: () => Object,
        description:
            'A mapping of forces to questions. Each force contains a mapping of question numbers to BulkQuestionItem objects.',
        example: {
            RIVALIDAD_ENTRE_COMPETIDORES: {
                1: {
                    nivelDeConcordancia: 'Concuerdo totalmente',
                    valoracion: 'Muy importante',
                },
                2: {
                    nivelDeConcordancia: 'Concuerdo en parte',
                    valoracion: 'Importante',
                },
            },
            PODER_DE_NEGOCIACION_CON_LOS_CLIENTES: {
                3: {
                    nivelDeConcordancia: 'Indiferente',
                    valoracion: 'No importante',
                },
            },
        },
    })
    preguntas: Record<Fuerza, Record<number, BulkQuestionItem>>
}

export class BulkQuestionItem {
    @ApiProperty({
        enum: NivelDeConcordancia,
        example: NivelDeConcordancia.CONCUERDO_TOTALMENTE,
        description: 'Level of agreement for the question',
    })
    nivelDeConcordancia: NivelDeConcordancia

    @ApiProperty({
        enum: Valoracion,
        example: Valoracion.MUY_IMPORTANTE,
        description: 'Valuation of the question',
    })
    valoracion: Valoracion
}
