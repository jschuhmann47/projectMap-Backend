import { Horizon } from './horizon'

export enum Frequency {
    SIX_MONTHS = 180,
    THREE_MONTHS = 90,
    TWO_MONTHS = 60,
    MONTHLY = 30,
    FIFTEEN_DAYS = 15,
    WEEKLY = 7,
    DAILY = 1,
}

/*
A 15 dias: diario, semanal
A 1 mes: semanal, quincenal
A 3 meses: quincenal, mensual
A 6 meses: mensual, bimestral, trimestral
A 1 año: mensual, bimestral, trimestral
*/
export const validFrequenciesByHorizon = new Map<Horizon, Array<Frequency>>([
    [Horizon.FORTNIGHT, [Frequency.DAILY, Frequency.WEEKLY]],
    [Horizon.MONTH, [Frequency.WEEKLY, Frequency.FIFTEEN_DAYS]],
    [Horizon.BIMESTER, [Frequency.WEEKLY, Frequency.FIFTEEN_DAYS]],
    [Horizon.QUARTER, [Frequency.FIFTEEN_DAYS, Frequency.MONTHLY]],
    [
        Horizon.SEMESTER,
        [Frequency.MONTHLY, Frequency.TWO_MONTHS, Frequency.THREE_MONTHS],
    ],
    [
        Horizon.YEAR,
        [Frequency.MONTHLY, Frequency.TWO_MONTHS, Frequency.THREE_MONTHS],
    ],
])

export const frequencyToPeriodName = new Map<Frequency, string>([
    [Frequency.SIX_MONTHS, 'Semestre'],
    [Frequency.THREE_MONTHS, 'Trimestre'],
    [Frequency.TWO_MONTHS, 'Bimestre'],
    [Frequency.MONTHLY, 'Mes'],
    [Frequency.FIFTEEN_DAYS, 'Quincena'],
    [Frequency.WEEKLY, 'Semana'],
    [Frequency.DAILY, 'Día'],
])
