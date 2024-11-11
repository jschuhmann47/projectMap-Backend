import { SituacionDelMercado } from './situacionDelMercado'
import { SituacionDelProducto } from './situacionDelProducto'
import { Exito } from './exito'
import { Estrategia } from './estrategia'
import { ApiProperty } from '@nestjs/swagger'

export class AnsoffDto {
    @ApiProperty({
        example: '123456',
        description: 'Unique identifier for the project',
    })
    projectId: string

    @ApiProperty({
        example: 'Project Title',
        description: 'Title of the project',
    })
    titulo: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Creation date in ISO format',
    })
    createdAt: string

    @ApiProperty({
        type: () => AnsoffProductDto,
        isArray: true,
        description: 'List of products associated with the project',
    })
    productos: AnsoffProductDto[]
}

export class AnsoffProductDto {
    @ApiProperty({
        example: '654321',
        description: 'Unique identifier for the product',
    })
    _id: string

    @ApiProperty({
        example: 'Product Name',
        description: 'Name of the product',
    })
    nombre: string

    @ApiProperty({
        enum: SituacionDelMercado,
        example: SituacionDelMercado.MERCADO_EXISTENTE,
        description: 'Market situation of the product',
    })
    situacionDelMercado: SituacionDelMercado

    @ApiProperty({
        enum: SituacionDelProducto,
        example: SituacionDelProducto.PRODUCTO_EXISTENTE,
        description: 'Product situation in the market',
    })
    situacionDelProducto: SituacionDelProducto

    @ApiProperty({
        enum: Exito,
        example: Exito.MUY_EXITOSO,
        description: 'Success level of the product',
    })
    exito: Exito

    @ApiProperty({
        enum: Estrategia,
        example: Estrategia.PENETRACION,
        description:
            'Strategy associated with the product based on market and product situation',
    })
    estrategia: Estrategia
}
