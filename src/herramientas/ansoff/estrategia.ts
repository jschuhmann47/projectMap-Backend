import { Producto } from './ansoff.schema'
import { SituacionDelMercado } from './situacionDelMercado'
import { SituacionDelProducto } from './situacionDelProducto'

/**
 * Enum representing the possible strategies based on market and product situation.
 */
export enum Estrategia {
    PENETRACION = 'Penetracion',
    DIVERSIFICAICON = 'Diversificacion',
    DESARROLLO_DE_PRODUCTO = 'Desarrollo de Producto',
    DESARROLLO_DE_MERCADO = 'Desarrollo de Mercado',
}

/**
 * Determines the strategy based on the market and product situation.
 * @param situacionDelMercado - Current market situation
 * @param situacionDelProducto - Current product situation
 * @returns The appropriate strategy as per the Ansoff Matrix
 */
export function calculate(
    situacionDelMercado: SituacionDelMercado,
    situacionDelProducto: SituacionDelProducto
): Estrategia {
    switch (situacionDelMercado) {
        case SituacionDelMercado.MERCADO_EXISTENTE:
            if (
                situacionDelProducto === SituacionDelProducto.PRODUCTO_EXISTENTE
            ) {
                return Estrategia.PENETRACION
            } else {
                return Estrategia.DESARROLLO_DE_PRODUCTO
            }
        case SituacionDelMercado.NUEVO:
            if (
                situacionDelProducto === SituacionDelProducto.PRODUCTO_EXISTENTE
            ) {
                return Estrategia.DESARROLLO_DE_MERCADO
            } else {
                return Estrategia.DIVERSIFICAICON
            }
    }
}

/**
 * Calculates the strategy for a given product.
 * @param product - The product for which the strategy needs to be calculated
 * @returns The calculated strategy based on the product's market and product situation
 */
export function calcularEstrategia(product: Producto): Estrategia {
    return calculate(
        product.situacionDelMercado as SituacionDelMercado,
        product.situacionDelProducto as SituacionDelProducto
    )
}
