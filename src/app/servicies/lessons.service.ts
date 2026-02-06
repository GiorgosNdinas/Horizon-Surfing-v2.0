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

  /**
   * Fetches lessons from the data provider and updates the dbLessons signal.
   * 
   * @return A promise that resolves when the lessons have been fetched and the signal updated.
   */
  async getLessons() {
    const lessons = await this.dataProvider.getLessons();
    this.dbLessons.set(lessons);
  }

  /**
   * Adds a new lesson using the data provider, refreshes the lessons list, and updates team members.
   * 
   * @param lesson The lesson to be added.
   * @return A promise that resolves when the lesson has been added and the necessary updates have been made.
   */
  async addLesson(lesson: Lesson) {
    await this.dataProvider.addLesson(lesson);
    await this.getLessons();
    this.teamMemberService.getTeamMembers();
  }

  /**
 * Filters lessons for a given teacher and student from the cached lessons list.
 *
 * @param teacherId - The ID of the teacher.
 * @param studentId - The ID of the student (customer).
 * 
 * @returns An array of lessons matching the given teacher and student.
 */
  getLessonsForTeacher(teacherId: number, studentId: number) {
    return this.dbLessons().filter(lesson => lesson.teacherId === teacherId && lesson.customerId === studentId);
  }

  /**
 * Filters lessons for a given customer from the cached lessons list.
 *
 * @param customerId - The ID of the customer (student).
 * 
 * @returns An array of lessons for the given customer.
 */
  getLessonsForCustomer(customerId: number) {
    return this.dbLessons().filter(lesson => lesson.customerId === customerId)
  }

}
