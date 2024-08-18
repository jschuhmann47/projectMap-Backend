import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export enum Permission {
    View = 'view',
    Edit = 'edit',
    Hide = 'hide',
}

@Schema()
export class Stage {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    id: StageType

    @Prop({ type: String, require: true })
    permission: Permission

    constructor(type: StageType, permission: Permission) {
        this.id = type
        this.permission = permission
    }
}

export enum StageType {
    ExternalEnvironment = 'externalEnvironment',
    InternalSituation = 'internalSituation',
    StrategicGuidelines = 'strategicGuidelines',
    CompetitiveStrategy = 'competitiveStrategy',
    TransformationPlans = 'transformationPlans',
    FinancialPlanning = 'financialPlanning',
    ContinuousImprovement = 'continuousImprovement',
}

export function isValidStageType(value: string) {
    return Object.values(StageType).includes(value as StageType)
}

export function isValidPermission(value: string) {
    return Object.values(Permission).includes(value as Permission)
}

export function defaultStages() {
    return Object.values(StageType).map((t) => new Stage(t, Permission.Hide))
}

export const ProjectSchema = SchemaFactory.createForClass(Stage)
