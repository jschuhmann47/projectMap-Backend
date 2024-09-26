import { Frequency } from '../frequency'
import { addDateByFrequency } from './dates'

// YYYY-MM-DD
test('0 times gets same date', () => {
    expect(
        addDateByFrequency(new Date('2020-01-01'), Frequency.DAILY, 0)
    ).toStrictEqual(new Date('2020-01-01'))
})

test('1 time with frequency less than a month adds days', () => {
    expect(
        addDateByFrequency(new Date('2020-01-01'), Frequency.FIFTEEN_DAYS, 1)
    ).toStrictEqual(new Date('2020-01-16'))
})

test('2 times with frequency less than a month adds days', () => {
    expect(
        addDateByFrequency(new Date('2020-01-01'), Frequency.FIFTEEN_DAYS, 2)
    ).toStrictEqual(new Date('2020-01-31'))
})

test('1 time with frequency more than a month adds month', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.TWO_MONTHS, 1)
    ).toStrictEqual(new Date('2024-11-01'))
})

test('3 times with frequency more than a month adds months', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.TWO_MONTHS, 3)
    ).toStrictEqual(new Date('2025-03-01'))
})

test('1 time with three months', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.THREE_MONTHS, 1)
    ).toStrictEqual(new Date('2024-12-01'))
})

test('1 time with six months', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.SIX_MONTHS, 1)
    ).toStrictEqual(new Date('2025-03-01'))
})

test('adding one year', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.YEAR, 1)
    ).toStrictEqual(new Date('2025-09-01'))
})

test('adding five years', () => {
    expect(
        addDateByFrequency(new Date('2024-09-01'), Frequency.YEAR, 5)
    ).toStrictEqual(new Date('2029-09-01'))
})
