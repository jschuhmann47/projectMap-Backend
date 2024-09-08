import { Horizon } from './horizon'

export enum Frequency {
    YEAR = 360,
    SIX_MONTHS = 180,
    THREE_MONTHS = 90,
    TWO_MONTHS = 60,
    MONTHLY = 30,
    FIFTEEN_DAYS = 15,
    WEEKLY = 7,
    DAILY = 1,
}

export const validFrequenciesByHorizon = new Map<Horizon, Array<Frequency>>([
    [Horizon.FORTNIGHT, [Frequency.DAILY, Frequency.WEEKLY]],
    [Horizon.MONTH, [Frequency.WEEKLY, Frequency.FIFTEEN_DAYS]],
    [
        Horizon.BIMESTER,
        [Frequency.WEEKLY, Frequency.FIFTEEN_DAYS, Frequency.MONTHLY],
    ],
    [Horizon.QUARTER, [Frequency.FIFTEEN_DAYS, Frequency.MONTHLY]],
    [
        Horizon.SEMESTER,
        [Frequency.MONTHLY, Frequency.TWO_MONTHS, Frequency.THREE_MONTHS],
    ],
    [
        Horizon.YEAR,
        [Frequency.MONTHLY, Frequency.TWO_MONTHS, Frequency.THREE_MONTHS],
    ],
    [
        Horizon.TWO_YEARS,
        [Frequency.TWO_MONTHS, Frequency.THREE_MONTHS, Frequency.SIX_MONTHS],
    ],
    [
        Horizon.THREE_YEARS,
        [Frequency.THREE_MONTHS, Frequency.SIX_MONTHS, Frequency.YEAR],
    ],
    [Horizon.FOUR_YEARS, [Frequency.SIX_MONTHS, Frequency.YEAR]],
    [Horizon.FIVE_YEARS, [Frequency.SIX_MONTHS, Frequency.YEAR]],
])

export const frequencyToPeriodName = new Map<Frequency, string>([
    [Frequency.YEAR, 'Año'],
    [Frequency.SIX_MONTHS, 'Semestre'],
    [Frequency.THREE_MONTHS, 'Trimestre'],
    [Frequency.TWO_MONTHS, 'Bimestre'],
    [Frequency.MONTHLY, 'Mes'],
    [Frequency.FIFTEEN_DAYS, 'Quincena'],
    [Frequency.WEEKLY, 'Semana'],
    [Frequency.DAILY, 'Día'],
])

export function getStatusFromFrequencyAndHorizon(
    frequency: Frequency,
    horizon: Horizon
) {
    const validFrequencies = validFrequenciesByHorizon.get(horizon)
    if (!validFrequencies) {
        return {
            invalid: true,
        }
    }
    const validFrequency = validFrequencies.filter((f) => f == frequency)
    if (!validFrequency || validFrequency.length == 0) {
        return {
            invalid: true,
        }
    }
    return {
        lengthOfPeriods: Math.floor(horizon / frequency),
        periodName: frequencyToPeriodName.get(frequency),
        invalid: false,
    }
}
