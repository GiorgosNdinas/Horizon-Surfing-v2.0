import { Injectable, signal } from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DatabaseService } from './database.service';
import { TeamMemberService } from './team-member.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private db: SQLiteDBConnection = this.databaseSErvice.getDatabaseConnection();

  dbLessons = signal<Lesson[]>([]);

  constructor(private databaseSErvice: DatabaseService, private teamMemberService: TeamMemberService) { }

  async getLessons() {
    const lessons = await this.db.query('SELECT * FROM lesson');
    this.dbLessons.set(lessons.values || []);
  }

  async addLesson(lesson: Lesson) {
    const query = `INSERT INTO lesson (customerId, teacherId, lessonType, lessonHours, lessonDate) VALUES (${lesson.customerId}, ${lesson.teacherId}, '${lesson.lessonType}', '${lesson.lessonHours}', '${lesson.lessonDate}')`;
    const result = await this.db.query(query);

    this.addTotalHours(lesson);

    this.getLessons();
  }

  // Adds the created hour to the total hours sum of the teacher
  async addTotalHours(lesson: Lesson) {
    const query = `UPDATE teamMember SET totalHoursTaught = (SELECT SUM(lessonHours) FROM lesson WHERE teacherId = ${lesson.teacherId})`;
    const result = await this.db.query(query);

    this.addHoursTaughtThisMonth();
  }

  // Adds the created hour to the hours taught this month
  async addHoursTaughtThisMonth(){
    const currentDate = new Date().toISOString().split("T")[0];
    const query = `UPDATE teamMember SET hoursTaughtThisMonth = (SELECT SUM(lessonHours) FROM lesson WHERE strftime('%Y-%m', lessonDate) = '${currentDate.substring(0, 7)}')`;
    const result = await this.db.query(query);

    this.teamMemberService.getTeamMembers();
  }

  getLessonsForTeacher(teacherId: number, studentId: number) {
    return this.dbLessons().filter(lesson => lesson.teacherId === teacherId && lesson.customerId === studentId);
  }

  getLessonsForCustomer(customerId: number) {
    return this.dbLessons().filter(lesson => lesson.customerId === customerId)
  }

}
