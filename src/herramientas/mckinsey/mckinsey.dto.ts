import { ApiProperty } from '@nestjs/swagger'

export class McKinseyDto {
    @ApiProperty({
        example: '123456',
        description: 'Unique identifier for the McKinsey analysis',
    })
    _id: string

    @ApiProperty({
        example: '7891011',
        description:
            'Project identifier associated with this McKinsey analysis',
    })
    projectId: string

    @ApiProperty({
        example: 'Market Analysis for Project XYZ',
        description: 'Title of the McKinsey analysis',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description:
            'Date when the McKinsey analysis was created, in ISO format',
    })
    createdAt: string

    @ApiProperty({
        type: () => UnidadDeNegocioDto,
        isArray: true,
        description: 'List of business units involved in the McKinsey analysis',
        example: [
            {
                _id: '1',
                nombre: 'Business Unit A',
                fuerzaCompetitiva: 7,
                atractivoDeMercado: 6,
                cuadrante: 3,
            },
            {
                _id: '2',
                nombre: 'Business Unit B',
                fuerzaCompetitiva: 4,
                atractivoDeMercado: 5,
                cuadrante: 2,
            },
        ],
    })
    unidadesDeNegocio: UnidadDeNegocioDto[]
}

export class UnidadDeNegocioDto {
    @ApiProperty({
        example: '1',
        description: 'Unique identifier for the business unit',
    })
    _id: string

    @ApiProperty({
        example: 'Business Unit A',
        description: 'Name of the business unit',
    })
    nombre: string

    @ApiProperty({
        example: 7,
        description:
            'Competitive strength score of the business unit on a scale (e.g., 1-10)',
    })
    fuerzaCompetitiva: number

    @ApiProperty({
        example: 6,
        description:
            'Market attractiveness score of the business unit on a scale (e.g., 1-10)',
    })
    atractivoDeMercado: number

    @ApiProperty({
        example: 3,
        description:
            'Quadrant position of the business unit in the analysis grid (e.g., 1-4)',
    })
    cuadrante: number
}
