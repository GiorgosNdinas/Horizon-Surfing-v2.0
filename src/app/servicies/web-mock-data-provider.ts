import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Activity } from '../models/activity.modal';
import { Customer } from '../models/customer.model';
import { Lesson } from '../models/lesson.model';
import { TeamMember } from '../models/team-members.modal';
import { DataProvider } from './data-provider';

export class WebMockDataProvider implements DataProvider {
  private teamMembersKey = 'hs.mock.teamMembers';
  private customersKey = 'hs.mock.customers';
  private activitiesKey = 'hs.mock.activities';
  private lessonsKey = 'hs.mock.lessons';

  constructor(private http: HttpClient) {}

  async initialize(): Promise<void> {
    await Promise.all([
      this.seedIfMissing<TeamMember[]>(this.teamMembersKey, 'assets/mock-data/team-members.json', []),
      this.seedIfMissing<Customer[]>(this.customersKey, 'assets/mock-data/customers.json', []),
      this.seedIfMissing<Activity[]>(this.activitiesKey, 'assets/mock-data/activities.json', []),
      this.seedIfMissing<Lesson[]>(this.lessonsKey, 'assets/mock-data/lessons.json', [])
    ]);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    return teamMembers.filter((teamMember) => teamMember.deleted !== 1);
  }

  async addTeamMember(teamMember: TeamMember): Promise<void> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    const nextId = this.getNextId(teamMembers);
    teamMembers.push({ ...teamMember, id: nextId, deleted: 0 });
    this.write(this.teamMembersKey, teamMembers);
  }

  async deleteTeamMember(teamMember: TeamMember): Promise<void> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    const index = teamMembers.findIndex((member) => member.id === teamMember.id);
    if (index !== -1) {
      teamMembers[index] = { ...teamMembers[index], deleted: 1 };
      this.write(this.teamMembersKey, teamMembers);
    }
  }

  async getCustomers(): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return [...customers].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  async getCustomersByYear(year: number): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return customers
      .filter((customer) => new Date(customer.departureDate).getFullYear() === year)
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  async getUnpaidCustomers(): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return customers
      .filter((customer) => customer.paid === 0)
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  async addCustomer(customer: Customer): Promise<void> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    const nextId = this.getNextId(customers);
    customers.push({ ...customer, id: nextId });
    this.write(this.customersKey, customers);
  }

  async updateCustomer(customer: Customer): Promise<void> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    const index = customers.findIndex((item) => item.id === customer.id);
    if (index !== -1) {
      customers[index] = { ...customer };
      this.write(this.customersKey, customers);
    }
  }

  async addActivity(activity: Activity): Promise<void> {
    const activities = this.read<Activity[]>(this.activitiesKey, []);
    const nextId = this.getNextId(activities);
    activities.push({ ...activity, id: nextId });
    this.write(this.activitiesKey, activities);
  }

  async getActivityForCustomer(customerId: number): Promise<Activity[]> {
    const activities = this.read<Activity[]>(this.activitiesKey, []);
    return activities.filter((activity) => activity.customerId === customerId);
  }

  async getLessons(): Promise<Lesson[]> {
    return this.read<Lesson[]>(this.lessonsKey, []);
  }

  async addLesson(lesson: Lesson): Promise<void> {
    const lessons = this.read<Lesson[]>(this.lessonsKey, []);
    const nextId = this.getNextId(lessons);
    lessons.push({ ...lesson, id: nextId });
    this.write(this.lessonsKey, lessons);

    this.updateTeamMemberTotals(lesson.teacherId);
  }

  private async seedIfMissing<T>(key: string, assetPath: string, fallback: T): Promise<void> {
    if (localStorage.getItem(key) !== null) {
      return;
    }

    let seedData = fallback;
    try {
      seedData = await firstValueFrom(this.http.get<T>(assetPath));
    } catch (error) {
      console.warn(`Failed to load seed data from ${assetPath}`, error);
    }

    this.write(key, seedData);
  }

  private updateTeamMemberTotals(teacherId?: number): void {
    const lessons = this.read<Lesson[]>(this.lessonsKey, []);
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    const targetTeacherId = teacherId ?? 0;

    const totalHoursForTeacher = lessons
      .filter((lesson) => lesson.teacherId === targetTeacherId)
      .reduce((total, lesson) => total + Number(lesson.lessonHours || 0), 0);

    const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
    const totalHoursThisMonth = lessons
      .filter((lesson) => lesson.lessonDate?.startsWith(currentMonth))
      .reduce((total, lesson) => total + Number(lesson.lessonHours || 0), 0);

    const updatedTeamMembers = teamMembers.map((member) => ({
      ...member,
      totalHoursTaught: totalHoursForTeacher,
      hoursTaughtThisMonth: totalHoursThisMonth
    }));

    this.write(this.teamMembersKey, updatedTeamMembers);
  }

  private read<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`Failed to parse localStorage for ${key}`, error);
      return fallback;
    }
  }

  private write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getNextId<T extends { id?: number }>(items: T[]): number {
    const maxId = items.reduce((max, item) => Math.max(max, item.id ?? 0), 0);
    return maxId + 1;
  }
}
