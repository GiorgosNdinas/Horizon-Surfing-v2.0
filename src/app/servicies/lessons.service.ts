import { Inject, Injectable, signal } from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { TeamMemberService } from './team-member.service';
import { DATA_PROVIDER, DataProvider } from './data-provider';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  dbLessons = signal<Lesson[]>([]);

  constructor(
    @Inject(DATA_PROVIDER) private dataProvider: DataProvider,
    private teamMemberService: TeamMemberService
  ) { }

  async getLessons() {
    const lessons = await this.dataProvider.getLessons();
    this.dbLessons.set(lessons);
  }

  async addLesson(lesson: Lesson) {
    await this.dataProvider.addLesson(lesson);
    await this.getLessons();
    this.teamMemberService.getTeamMembers();
  }

  getLessonsForTeacher(teacherId: number, studentId: number) {
    return this.dbLessons().filter(lesson => lesson.teacherId === teacherId && lesson.customerId === studentId);
  }

  getLessonsForCustomer(customerId: number) {
    return this.dbLessons().filter(lesson => lesson.customerId === customerId)
  }

}
