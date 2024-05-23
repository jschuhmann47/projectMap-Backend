import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OkrController } from './okr.controller';
import { OkrProject, okrProjectSchema } from './okr.schema';
import { OkrService } from './okr.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OkrProject.name, schema: okrProjectSchema },
    ]),
  ],
  providers: [OkrService],
  controllers: [OkrController],
  exports: [OkrService],
})
export class OkrModule {}
