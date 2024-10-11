import { Frequency } from '../frequency'
import { Horizon } from '../horizon'

export class OkrDto {
    _id: string
    projectId: string
    description: string
    area: string
    areaId: string
    horizon: Horizon
    priority: number
    progress: number
    startingDate: Date
    keyResults: KeyResultDto[]
}

export class KeyResultDto {
    _id: string
    description: string
    responsible: string
    priority: number
    progress: number
    currentScore: number
    type: OkrType
    keyStatus: (KeyStatusDto | ChecklistKeyStatusDto)[]

    // for normal kr
    baseline: number
    goal: number
    frequency: Frequency
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

export class ChecklistKeyStatusDto {
    _id: string
    description: string
    checked: boolean

    constructor(description: string, checked: boolean) {
        this.description = description
        this.checked = checked
    }
}

export enum OkrType {
    NORMAL = 'normal',
    CHECKLIST = 'checklist',
}
