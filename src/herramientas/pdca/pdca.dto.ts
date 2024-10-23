import mongoose from 'mongoose'

export class ActionDto {
    id: mongoose.Types.ObjectId
    name: string
    responsible?: string
    progress?: number
    deadline?: Date
}

export class PdcaDto {
    id: mongoose.Types.ObjectId
    name: string
    progress: number
    projectId: string
    actions: ActionDto[]
}
