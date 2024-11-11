import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'

export class ActionDto {
    @ApiProperty({
        example: '615c1b5f1c4b4d001f8d1a5c',
        description: 'Unique identifier for the action',
    })
    id: mongoose.Types.ObjectId

    @ApiProperty({
        example: 'Complete customer feedback analysis',
        description: 'Name of the action to be performed',
    })
    name: string

    @ApiProperty({
        example: 'Jane Doe',
        description: 'Person responsible for this action',
        required: false,
    })
    responsible?: string

    @ApiProperty({
        example: 50,
        description: 'Current progress of the action in percentage',
        required: false,
    })
    progress?: number

    @ApiProperty({
        example: '2023-12-31T00:00:00Z',
        description: 'Deadline for the action',
        required: false,
    })
    deadline?: Date
}

export class PdcaDto {
    @ApiProperty({
        example: '615c1b5f1c4b4d001f8d1a5d',
        description: 'Unique identifier for the PDCA',
    })
    id: mongoose.Types.ObjectId

    @ApiProperty({
        example: 'PDCA for Project XYZ',
        description: 'Name of the PDCA cycle',
    })
    name: string

    @ApiProperty({
        example: 75,
        description: 'Current progress of the PDCA cycle in percentage',
    })
    progress: number

    @ApiProperty({
        example: '7891011',
        description: 'Project ID associated with this PDCA cycle',
    })
    projectId: string

    @ApiProperty({
        type: () => ActionDto,
        isArray: true,
        description: 'List of actions within the PDCA cycle',
        example: [
            {
                id: '615c1b5f1c4b4d001f8d1a5c',
                name: 'Complete customer feedback analysis',
                responsible: 'Jane Doe',
                progress: 50,
                deadline: '2023-12-31T00:00:00Z',
            },
            {
                id: '615c1b5f1c4b4d001f8d1a5d',
                name: 'Implement feedback improvements',
                responsible: 'John Doe',
                progress: 30,
                deadline: '2024-01-15T00:00:00Z',
            },
        ],
    })
    actions: ActionDto[]
}
