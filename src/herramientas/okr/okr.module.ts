import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OkrController } from './okr.controller'
import { Okr, OkrSchema } from './okr.schema'
import { OkrService } from './okr.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Okr.name, schema: OkrSchema }]),
    ],
    providers: [OkrService],
    controllers: [OkrController],
    exports: [OkrService],
})
export class OkrModule {}
