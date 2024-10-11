import { Area, Importancia, Intensidad, Tendencia } from '../enums'

export const mapImportanciaToValue = (key: Importancia): number => {
    return {
        [Importancia['Muy importante']]: 5,
        [Importancia.Importante]: 4,
        [Importancia.Indiferente]: 3,
        [Importancia['Poco importante']]: 2,
        [Importancia['Sin importancia']]: 1,
    }[key]
}

export const mapIntensidadToValue = (key: Intensidad, area: Area): number => {
    switch (area) {
        case Area.POLITICO:
        case Area.ECONOMICO:
            return {
                [Intensidad['Muy fuerte']]: 5,
                [Intensidad.Fuerte]: 4,
                [Intensidad.Promedio]: 3,
                [Intensidad.Debil]: 2,
                [Intensidad['Muy debil']]: 1,
            }[key]
        case Area.SOCIAL:
        case Area.TECNOLOGICO:
        case Area.AMBIENTAL:
        case Area.LEGAL:
            return {
                [Intensidad['Muy fuerte']]: 1,
                [Intensidad.Fuerte]: 2,
                [Intensidad.Promedio]: 3,
                [Intensidad.Debil]: 4,
                [Intensidad['Muy debil']]: 5,
            }[key]
    }
}

export const mapTendenciaToValue = (key: Tendencia, area: Area): number => {
    switch (area) {
        case Area.POLITICO:
        case Area.SOCIAL:
            return {
                [Tendencia['Mejora mucho']]: 5,
                [Tendencia.Mejora]: 4,
                [Tendencia['Se mantiene']]: 3,
                [Tendencia.Empeora]: 2,
                [Tendencia['Empeora Mucho']]: 1,
            }[key]
        case Area.ECONOMICO:
        case Area.TECNOLOGICO:
        case Area.AMBIENTAL:
        case Area.LEGAL:
            return {
                [Tendencia['Mejora mucho']]: 1,
                [Tendencia.Mejora]: 2,
                [Tendencia['Se mantiene']]: 3,
                [Tendencia.Empeora]: 4,
                [Tendencia['Empeora Mucho']]: 5,
            }[key]
    }
}
