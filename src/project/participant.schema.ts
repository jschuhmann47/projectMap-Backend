import { Prop, Schema } from '@nestjs/mongoose'
import { Stage } from './stage.schema'
import { User } from 'src/user/user.schema'

@Schema()
export class Participant {
    @Prop({ type: String })
    user: User

    @Prop()
    stages: Stage[]
}
