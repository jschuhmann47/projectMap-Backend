import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StickyNote, StickyNoteSchema } from './stickyNote.schema';
import { StickyNoteService } from './stickyNote.service';
import { StickyNoteController } from './stickyNote.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StickyNote.name, schema: StickyNoteSchema },
    ]),
    ProjectModule,
  ],
  providers: [StickyNoteService],
  controllers: [StickyNoteController],
  exports: [StickyNoteService],
})
export class StickyNoteModule {}
