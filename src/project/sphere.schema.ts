import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

@Schema()
export class Sphere {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    id: SphereType

    @Prop({ type: String, require: true })
    permission: 'edit' | 'view' | 'hide'
}

export enum SphereType {
    ExternalEnvironment = 'externalEnvironment',
    InternalSituation = 'internalSituation',
    StrategicGuidelines = 'strategicGuidelines',
    CompetitiveStrategy = 'competitiveStrategy',
    TransformationPlans = 'transformationPlans',
    FinancialPlanning = 'financialPlanning',
    ContinuousImprovement = 'continuousImprovement',
}

export function isValidSphereType(value: string) {
    return Object.values(SphereType).includes(value as SphereType)
}

export const ProjectSchema = SchemaFactory.createForClass(Sphere)
