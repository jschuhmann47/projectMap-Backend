import { BSCCategory } from './bsc_category'
import { Trend } from './trends'

export class CheckpointDto {
    _id: string
    month: string
    target: number
    actual: number
}

export class ObjectiveDto {
    _id: string
    action: string
    measure: string
    target: number
    category: BSCCategory
    checkpoints: CheckpointDto[]
    progress: number
    trend: Trend
    responsible: string
}

export class BalancedScorecardDto {
    _id: string
    projectId: string
    titulo: string
    createdAt: Date
    objectives: ObjectiveDto[]
}
