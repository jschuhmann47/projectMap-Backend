import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { Frequency } from '../frequency'
import { Horizon } from '../horizon'

export class OkrDto {
    @ApiProperty({
        example: '123456',
        description: 'Unique identifier for the OKR',
    })
    _id: string

    @ApiProperty({
        example: '7891011',
        description: 'Project ID associated with this OKR',
    })
    projectId: string

    @ApiProperty({
        example: 'Improve customer satisfaction',
        description: 'Description of the OKR',
    })
    description: string

    @ApiProperty({
        example: 'Customer Service',
        description: 'Area to which this OKR belongs',
    })
    area: string

    @ApiProperty({
        example: '1001',
        description: 'ID of the area associated with this OKR',
    })
    areaId: string

    @ApiProperty({
        enum: Horizon,
        example: Horizon.YEAR,
        description: 'Time horizon for the OKR, e.g., YEAR, SEMESTER, QUARTER',
    })
    horizon: Horizon

    @ApiProperty({
        example: 1,
        description:
            'Priority of the OKR, where a lower number means higher priority',
    })
    priority: number

    @ApiProperty({
        example: 50,
        description: 'Current progress of the OKR in percentage',
    })
    progress: number

    @ApiProperty({
        example: '2023-01-01T00:00:00Z',
        description: 'Starting date of the OKR in ISO format',
    })
    startingDate: Date

    @ApiProperty({
        type: () => KeyResultDto,
        isArray: true,
        description: 'List of key results associated with this OKR',
    })
    keyResults: KeyResultDto[]
}

export enum OkrType {
    NORMAL = 'normal',
    CHECKLIST = 'checklist',
}

export class KeyStatusDto {
    @ApiProperty({
        example: '345678',
        description: 'Unique identifier for the key status entry',
    })
    _id: string

    @ApiProperty({
        example: 'Q1 2023',
        description: 'Period of the key status entry',
    })
    period: string

    @ApiProperty({
        example: 80,
        description: 'Value for this key status entry',
    })
    value: number

    constructor(period: string, value: number) {
        this.period = period
        this.value = value
    }
}

export class ChecklistKeyStatusDto {
    @ApiProperty({
        example: '456789',
        description: 'Unique identifier for the checklist key status entry',
    })
    _id: string

    @ApiProperty({
        example: 'Complete customer feedback survey',
        description: 'Description of the checklist item',
    })
    description: string

    @ApiProperty({
        example: true,
        description: 'Whether the checklist item is completed',
    })
    checked: boolean

    constructor(description: string, checked: boolean) {
        this.description = description
        this.checked = checked
    }
}

export class KeyResultDto {
    @ApiProperty({
        example: '234567',
        description: 'Unique identifier for the key result',
    })
    _id: string

    @ApiProperty({
        example: 'Increase NPS score',
        description: 'Description of the key result',
    })
    description: string

    @ApiProperty({
        example: 'John Doe',
        description: 'Responsible person for this key result',
    })
    responsible: string

    @ApiProperty({ example: 1, description: 'Priority of the key result' })
    priority: number

    @ApiProperty({
        example: 30,
        description: 'Current progress of the key result in percentage',
    })
    progress: number

    @ApiProperty({
        example: 75,
        description: 'Current score of the key result',
    })
    currentScore: number

    @ApiProperty({
        enum: OkrType,
        example: OkrType.NORMAL,
        description: 'Type of the key result, either NORMAL or CHECKLIST',
    })
    type: OkrType

    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(KeyStatusDto) },
            { $ref: getSchemaPath(ChecklistKeyStatusDto) },
        ],
        isArray: true,
        description:
            'Status of the key result, which could be key metrics or checklist items',
    })
    keyStatus: (KeyStatusDto | ChecklistKeyStatusDto)[]

    @ApiProperty({
        example: 50,
        description: 'Baseline value for normal key results',
        required: false,
    })
    baseline: number

    @ApiProperty({
        example: 100,
        description: 'Goal value for normal key results',
        required: false,
    })
    goal: number

    @ApiProperty({
        enum: Frequency,
        example: Frequency.MONTHLY,
        description: 'Frequency of updates for the key result',
        required: false,
    })
    frequency: Frequency
}
