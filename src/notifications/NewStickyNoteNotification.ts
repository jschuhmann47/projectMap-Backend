import { Project } from '../project/project.schema';
import { StickyNote } from '../sticky-notes/stickyNote.schema';
import { EmailNotification } from './EmailNotification';

export class NewStickyNoteNotification extends EmailNotification {
  stickyNote: StickyNote;
  project: Project;
  constructor(stickyNote: StickyNote, project: Project) {
    super();
    this.stickyNote = stickyNote;
    this.project = project;
    this.bodyText = `There is a new sticky note in your project: ${this.project.titulo}. Note:${stickyNote.text}`;
    this.subject = `New note!`;
  }

  async notifyUsers(destinations: string[]) {
    return Promise.all(
      destinations.map((destination) => super.send(destination)),
    );
  }
}
