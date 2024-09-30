import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PestelController } from './pestel.controller'
import { Pestel, PestelSchema } from './pestel.schema'
import { PestelService } from './pestel.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Pestel.name, schema: PestelSchema },
        ]),
    ],
    providers: [PestelService],
    controllers: [PestelController],
    exports: [PestelService],
})
export class PestelModule {}
