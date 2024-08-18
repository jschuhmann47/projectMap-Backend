import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export enum Permission {
    View = 'view',
    Edit = 'edit',
    Hide = 'hide',
}

@Schema()
export class Sphere {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, require: true })
    id: SphereType

    @Prop({ type: String, require: true })
    permission: Permission

    constructor(type: SphereType, permission: Permission) {
        this.id = type
        this.permission = permission
    }
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

export function isValidPermission(value: string) {
    return Object.values(Permission).includes(value as Permission)
}

export function defaultSpheres() {
    return Object.values(SphereType).map((t) => new Sphere(t, Permission.Hide))
}

export const ProjectSchema = SchemaFactory.createForClass(Sphere)
