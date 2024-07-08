import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Project } from '../project/project.schema'

@Schema()
export class User {
    _id: mongoose.Types.ObjectId

    @Prop({ type: String, required: true })
    userId: string

    @Prop({ type: String, required: true })
    firstName: string

    @Prop({ type: String, required: true })
    lastName: string

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true })
    password: string

    @Prop({ type: String, required: false })
    isAdmin: boolean

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
    projectsId: Project[]

    // @Prop({ type: String, default: 'Free' })
    // role: Roles

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
    // sharedProjects: Project[]

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Consultora' })
    // consultora: Consultora

    // @Prop({ type: String, required: false })
    // calendlyUser: string

    // @Prop({ type: String, required: false })
    // biography: string
}
export const UserSchema = SchemaFactory.createForClass(User)

// export enum Roles {
//     Free = 'Free',
//     Premium = 'Premium',
//     Consultant = 'Consultant',
//     ConsultantAdmin = 'ConsultantAdmin',
// }

// export function isConsultor(user: User) {
//     return user.role == Roles.Consultant || user.role == Roles.ConsultantAdmin
// }
