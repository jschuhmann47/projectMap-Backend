import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConsultoraService } from './consultora.service'
import { ConsultoraController } from './consultora.controller'
import { Consultora, ConsultoraSchema } from './consultora.schema'
import { UserModule } from '../user/user.module'
import { ProjectModule } from '../project/project.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Consultora.name, schema: ConsultoraSchema },
        ]),
        UserModule,
        ProjectModule,
    ],
    providers: [ConsultoraService],
    controllers: [ConsultoraController],
    exports: [ConsultoraService],
})
export class ConsultoraModule {}
