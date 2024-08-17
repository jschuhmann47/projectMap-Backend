import { Prop, Schema } from '@nestjs/mongoose'
import { Stage } from './stage.schema'
import * as mongoose from 'mongoose'
import { User } from 'src/user/user.schema'

@Schema()
export class Participant {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    user: User

    @Prop()
    stages: Stage[]
}
