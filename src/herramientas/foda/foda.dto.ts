import { ApiProperty } from '@nestjs/swagger'

export class FodaDto {
    @ApiProperty({
        example: 'FODA Analysis for Project XYZ',
        description: 'Title of the FODA analysis',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Date when the FODA analysis was created, in ISO format',
    })
    createdAt: string

    @ApiProperty({
        type: () => [FactorDto],
        description: 'List of factors within the FODA analysis',
        example: [
            {
                area: 'Strengths',
                descripcion: 'Highly skilled workforce',
                importancia: 'High',
                intensidad: 'Strong',
                urgencia: 'Immediate',
                tendencia: 'Increasing',
            },
            {
                area: 'Weaknesses',
                descripcion: 'Limited funding',
                importancia: 'Medium',
                intensidad: 'Moderate',
                urgencia: 'High',
                tendencia: 'Stable',
            },
        ],
    })
    factores: FactorDto[]
}

export class FactorDto {
    @ApiProperty({
        example: 'Opportunities',
        description:
            'Area of the factor, such as Strengths, Weaknesses, Opportunities, or Threats',
    })
    area: string

    @ApiProperty({
        example: 'High',
        description: 'Importance level of the factor, e.g., Low, Medium, High',
    })
    importancia: string

    @ApiProperty({
        example: 'Strong',
        description: 'Intensity of the factor, e.g., Weak, Moderate, Strong',
    })
    intensidad: string

    @ApiProperty({
        example: 'Increasing',
        description:
            'Tendency of the factor, e.g., Increasing, Decreasing, Stable',
    })
    tendencia: string

    @ApiProperty({
        example: 'Immediate',
        description:
            'Urgency of the factor, e.g., Low, Medium, High, Immediate',
    })
    urgencia: string

    @ApiProperty({
        example: 'Highly skilled workforce with relevant experience',
        description: 'Detailed description of the factor',
    })
    descripcion: string
}
