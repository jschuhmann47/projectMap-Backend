import { Prop, Schema } from '@nestjs/mongoose'
import { Stage } from './stage.schema'
import { User } from 'src/user/user.schema'
import mongoose from 'mongoose'

@Schema({ _id: false })
export class Participant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

    @Prop()
    stages: Stage[]
}
