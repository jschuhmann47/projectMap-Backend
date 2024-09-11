import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export enum Horizon {
    YEAR = 360,
    SEMESTER = 180,
    QUARTER = 90,
    BIMESTER = 60,
    MONTH = 30,
    FORTNIGHT = 15,
}

export enum Priority {
    LOW = 0,
    MEDIUM,
    HIGH,
}

export enum Frequency {
    SIX_MONTHS = 180,
    THREE_MONTHS = 90,
    TWO_MONTHS = 60,
    MONTHLY = 30,
    FIFTEEN_DAYS = 15,
    WEEKLY = 7,
    DAILY = 1,
}

@Schema({ _id: false })
export class KeyStatus {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    period: string

    @Prop({ type: Number, required: true })
    value: number

    constructor(period: string, value: number) {
        this.period = period
        this.value = value
    }
}
export const KeyStatusSchema = SchemaFactory.createForClass(KeyStatus)

@Schema()
export class KeyResult {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    responsible: string

    @Prop({ type: Number, default: Priority.MEDIUM, enum: Priority })
    priority: Priority

    @Prop({ type: Number, required: true })
    baseline: number

    @Prop({ type: Number, required: true })
    goal: number

    @Prop({ type: Number, required: false })
    progress: number

    @Prop({ type: Number, required: true, enum: Frequency })
    frequency: Frequency

    @Prop({ type: [KeyStatusSchema], default: [] })
    keyStatus: KeyStatus[]

    @Prop({ type: Number, required: false })
    currentScore: number

    constructor(
        description: string,
        responsible: string,
        baseline: number,
        goal: number,
        frequency: Frequency,
        priority = Priority.MEDIUM,
        keyStatus: KeyStatus[] = []
    ) {
        this.description = description
        this.goal = goal
        this.responsible = responsible
        this.priority = priority
        ;(this.baseline = baseline),
            (this.frequency = frequency),
            (this.keyStatus = keyStatus)
    }
}
export const KeyResultSchema = SchemaFactory.createForClass(KeyResult)
KeyResultSchema.pre('save', function (next) {
    this.progress = Math.round(
        (this.keyStatus.map((k) => k.value).reduce((a, b) => a + b) * 100) /
            this.goal
    )
    this.currentScore = this.keyStatus
        .map((k) => k.value)
        .reduce((a, b) => a + b, 0)
    next()
})

@Schema()
export class Okr {
    _id: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    projectId: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true })
    area: string

    @Prop({ type: Number, required: true, enum: Horizon })
    horizon: Horizon

    @Prop({ type: Number, enum: Priority })
    priority: Priority

    @Prop({ type: Number, default: 0 })
    progress: number

    @Prop({ type: [KeyResultSchema], default: [] })
    keyResults: KeyResult[]

    constructor(
        description: string,
        area: string,
        horizon: Horizon,
        priority: Priority
    ) {
        this.description = description
        this.area = area
        this.horizon = horizon
        this.priority = priority
    }
}
export const OkrSchema = SchemaFactory.createForClass(Okr)
OkrSchema.pre('save', function (next) {
    if (this.keyResults.length) {
        this.priority = Math.round(
            this.keyResults
                .map((kr) => kr.priority)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
        )
        this.progress = Math.round(
            this.keyResults
                .map((kr) => kr.progress)
                .reduce((a, b) => a + b, 0) / this.keyResults.length
        )
    }
    next()
})

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

/*
A 15 dias: diario, semanal
A 1 mes: semanal, quincenal
A 3 meses: quincenal, mensual
A 6 meses: mensual, bimestral, trimestral
A 1 año: mensual, bimestral, trimestral
*/
const validFrequenciesByHorizon = new Map<Horizon, Array<Frequency>>([
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

const frequencyToPeriodName = new Map<Frequency, string>([
    [Frequency.SIX_MONTHS, 'Semestre'],
    [Frequency.THREE_MONTHS, 'Trimestre'],
    [Frequency.TWO_MONTHS, 'Bimestre'],
    [Frequency.MONTHLY, 'Mes'],
    [Frequency.FIFTEEN_DAYS, 'Quincena'],
    [Frequency.WEEKLY, 'Semana'],
    [Frequency.DAILY, 'Día'],
])
