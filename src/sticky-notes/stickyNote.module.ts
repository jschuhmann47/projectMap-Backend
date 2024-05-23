import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { StickyNoteController } from './stickyNote.controller';
import { StickyNote, StickyNoteSchema } from './stickyNote.schema';
import { StickyNoteService } from './stickyNote.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StickyNote.name, schema: StickyNoteSchema },
    ]),
    ProjectModule,
    UserModule,
  ],
  providers: [StickyNoteService],
  controllers: [StickyNoteController],
  exports: [StickyNoteService],
})
export class StickyNoteModule {}
