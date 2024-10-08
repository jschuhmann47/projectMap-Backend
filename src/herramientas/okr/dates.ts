import { Frequency } from '../frequency'

function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

function addMonths(date: Date, months: number): Date {
    const result = new Date(date)
    const d = result.getDate()
    result.setMonth(result.getMonth() + months)
    if (result.getDate() != d) {
        result.setDate(0)
    }
    return result
}

export function addDateByFrequency(
    date: Date,
    frequency: Frequency,
    times: number
): Date {
    if (frequency < 30) {
        return addDays(date, frequency * times)
    } else {
        return addMonths(date, (frequency / 30) * times)
    }
}

export function dateToString(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date)
}
