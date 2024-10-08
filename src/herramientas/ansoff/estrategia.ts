import { Producto } from './ansoff.schema'
import { SituacionDelMercado } from './situacionDelMercado'
import { SituacionDelProducto } from './situacionDelProducto'

export enum Estrategia {
    PENETRACION = 'Penetracion',
    DIVERSIFICAICON = 'Diversificacion',
    DESARROLLO_DE_PRODUCTO = 'Desarrollo de Producto',
    DESARROLLO_DE_MERCADO = 'Desarrollo de Mercado',
}

export function calculate(
    situacionDelMercado: SituacionDelMercado,
    situacionDelProducto: SituacionDelProducto
) {
    switch (situacionDelMercado) {
        case SituacionDelMercado.MERCADO_EXISTENTE:
            if (situacionDelProducto == SituacionDelProducto.PRODUCTO_EXISTENTE)
                return Estrategia.PENETRACION
            else return Estrategia.DESARROLLO_DE_PRODUCTO
        case SituacionDelMercado.NUEVO:
            if (situacionDelProducto == SituacionDelProducto.PRODUCTO_EXISTENTE)
                return Estrategia.DESARROLLO_DE_MERCADO
            else return Estrategia.DIVERSIFICAICON
    }
}

export function calcularEstrategia(product: Producto) {
    return calculate(
        product.situacionDelMercado as SituacionDelMercado,
        product.situacionDelProducto as SituacionDelProducto
    )
}
