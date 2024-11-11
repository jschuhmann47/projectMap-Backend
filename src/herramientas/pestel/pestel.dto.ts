import { ApiProperty } from '@nestjs/swagger'
import { Area, Importancia, Intensidad, Tendencia } from './enums'

export class PestelDto {
    @ApiProperty({
        example: 'PESTEL Analysis for Project XYZ',
        description: 'Title of the PESTEL analysis',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Date when the PESTEL analysis was created, in ISO format',
    })
    createdAt: string

    @ApiProperty({
        type: () => FactorDto,
        isArray: true,
        description: 'List of factors within the PESTEL analysis',
        example: [
            {
                factor: 'Economic Growth',
                area: 'Económico',
                descripcion: 'Expected economic growth rate in target market',
                importancia: 'Muy importante',
                intensidad: 'Fuerte',
                tendencia: 'Mejora',
            },
        ],
    })
    factores: FactorDto[]
}

export class FactorDto {
    @ApiProperty({
        enum: Area,
        example: Area.ECONOMICO,
        description: 'Area of influence',
    })
    area: Area

    @ApiProperty({
        example: 'Expected economic growth rate in target market',
        description: 'Description of the factor',
    })
    descripcion: string

    @ApiProperty({
        enum: Importancia,
        example: Importancia['Muy importante'],
        description: 'Importance level',
    })
    importancia: Importancia

    @ApiProperty({
        enum: Intensidad,
        example: Intensidad.Fuerte,
        description: 'Intensity level',
    })
    intensidad: Intensidad

    @ApiProperty({
        enum: Tendencia,
        example: Tendencia.Mejora,
        description: 'Trend of the factor',
    })
    tendencia: Tendencia
}
