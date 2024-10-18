import { Module } from '@nestjs/common'
import { PdcaService } from './pdca.service'
import { PdcaController } from './pdca.controller'
import { Pdca, pdcaSchema } from './pdca.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Pdca.name, schema: pdcaSchema }]),
    ],
    controllers: [PdcaController],
    providers: [PdcaService],
    exports: [PdcaService],
})
export class PdcaModule {}
