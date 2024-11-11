import { ApiProperty } from '@nestjs/swagger'
import { Frequency } from '../frequency'
import { Horizon } from '../horizon'
import { BSCCategory } from './bsc_category'
import { Trend } from './trends'

export class CheckpointDto {
    @ApiProperty({
        example: '123456',
        description: 'Unique identifier for the checkpoint',
    })
    _id: string

    @ApiProperty({
        example: 'Q1 2024',
        description: 'Period of the checkpoint',
    })
    period: string

    @ApiProperty({
        example: 75,
        description: 'Current value at this checkpoint',
    })
    current: number
}

export class ObjectiveDto {
    @ApiProperty({
        example: '654321',
        description: 'Unique identifier for the objective',
    })
    _id: string

    @ApiProperty({
        example: 'Increase customer satisfaction',
        description: 'Action to achieve the objective',
    })
    action: string

    @ApiProperty({
        example: 'Customer satisfaction score',
        description: 'Metric used to measure progress',
    })
    measure: string

    @ApiProperty({ example: 90, description: 'Target goal value' })
    goal: number

    @ApiProperty({
        example: 70,
        description: 'Baseline value before starting the objective',
    })
    baseline: number

    @ApiProperty({
        enum: BSCCategory,
        example: BSCCategory.Financiera,
        description:
            'Category of the objective in the Balanced Scorecard. Options include: Financiera, Clientes, ProcesosInternos, Aprendizaje.',
    })
    category: BSCCategory

    @ApiProperty({
        type: [CheckpointDto],
        description: 'List of checkpoints for the objective',
    })
    checkpoints: CheckpointDto[]

    @ApiProperty({ example: 80, description: 'Current progress percentage' })
    progress: number

    @ApiProperty({
        enum: Trend,
        example: Trend.Upwards,
        description:
            'Trend of the objective’s progress. Options include: Upwards, Downwards, Stable.',
    })
    trend: Trend

    @ApiProperty({
        example: 'John Doe',
        description: 'Person responsible for this objective',
    })
    responsible: string

    @ApiProperty({
        enum: Frequency,
        example: Frequency.MONTHLY,
        description: 'Frequency of updates for this objective',
    })
    frequency: Frequency
}

export class BalancedScorecardDto {
    @ApiProperty({
        example: '789012',
        description: 'Unique identifier for the Balanced Scorecard',
    })
    _id: string

    @ApiProperty({
        example: '456789',
        description:
            'Project identifier associated with this Balanced Scorecard',
    })
    projectId: string

    @ApiProperty({
        example: 'Balanced Scorecard for improving company performance',
        description: 'Description of the Balanced Scorecard',
    })
    description: string

    @ApiProperty({
        example: '2024-11-11T00:00:00Z',
        description: 'Date when the Balanced Scorecard was created',
    })
    createdAt: Date

    @ApiProperty({
        example: '2025-01-01T00:00:00Z',
        description: 'Starting date for the Balanced Scorecard',
    })
    startingDate: Date

    @ApiProperty({
        type: [ObjectiveDto],
        description: 'List of objectives within the Balanced Scorecard',
    })
    objectives: ObjectiveDto[]

    @ApiProperty({
        enum: Horizon,
        example: Horizon.FIVE_YEARS,
        description:
            'Time horizon for the Balanced Scorecard, representing the period for strategic goals. Options include: FIVE_YEARS (1800 days), FOUR_YEARS (1440 days), THREE_YEARS (1080 days), TWO_YEARS (720 days), YEAR (360 days), SEMESTER (180 days), QUARTER (90 days), BIMESTER (60 days), MONTH (30 days), FORTNIGHT (15 days).',
    })
    horizon: Horizon
}
