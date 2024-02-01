import { Injectable, signal } from '@angular/core';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor() { }

  private lessons = signal<Lesson[]>(
    [
      {
        id: 1,
        customerId: 2,
        teacherId: 1,
        lessonType: 'Private',
        lessonHours: '1.0',
        lessonDate: '2024-01-13'
      },
      {
        id: 2,
        customerId: 2,
        teacherId: 1,
        lessonType: 'Private',
        lessonHours: '1.0',
        lessonDate: '2024-01-14'
      },
      {
        id: 3,
        customerId: 2,
        teacherId: 1,
        lessonType: 'Private',
        lessonHours: '1.0',
        lessonDate: '2024-01-15'
      },
      {
        id: 4,
        customerId: 9,
        teacherId: 2,
        lessonType: 'Private',
        lessonHours: '1.0',
        lessonDate: '2024-01-13'
      },
      {
        id: 5,
        customerId: 6,
        teacherId: 1,
        lessonDate: '2024-01-13',
        lessonType: 'Private',
        lessonHours: '1.0'
      }
    ]
  );

  getLessons(){
    return this.lessons();
  }

  getLessonsForTeacher(teacherId: number, studentId: number) {
    return this.lessons().filter(lesson => lesson.teacherId === teacherId && lesson.customerId === studentId);
  }

  getLessonsForCustomer(customerId: number){
    return this.lessons().filter(lesson => lesson.customerId === customerId)
  }

  addNewLesson(newLesson: Lesson){
    this.lessons.set([...this.lessons(), newLesson]);
  }

}
