import { Frequency } from '../frequency'
import { Horizon } from '../horizon'

export class OkrDto {
    _id: string
    projectId: string
    description: string
    area: string
    horizon: Horizon
    priority: number
    progress: number
    keyResults: KeyResultDto[]
}

export class KeyResultDto {
    _id: string
    description: string
    responsible: string
    priority: number
    baseline: number
    currentScore: number
    goal: number
    progress: number
    frequency: Frequency
    keyStatus: KeyStatusDto[]
}

export class KeyStatusDto {
    _id: string
    period: string
    value: number

    constructor(period: string, value: number) {
        this.period = period
        this.value = value
    }
}
