import { Frequency } from '../frequency'
import { Horizon } from '../horizon'
import { BSCCategory } from './bsc_category'
import { Trend } from './trends'

export class CheckpointDto {
    _id: string
    period: string
    current: number
}

export class ObjectiveDto {
    _id: string
    action: string
    measure: string
    goal: number
    baseline: number
    category: BSCCategory
    checkpoints: CheckpointDto[]
    progress: number
    trend: Trend
    responsible: string
    frequency: Frequency
}

export class BalancedScorecardDto {
    _id: string
    projectId: string
    description: string
    createdAt: Date
    startingDate: Date
    objectives: ObjectiveDto[]
    horizon: Horizon
}
