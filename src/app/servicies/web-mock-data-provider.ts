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

  constructor(private http: HttpClient) { }

  /**
   * Initializes the mock data provider by seeding localStorage with mock data if not already present.
   * 
   * @returns A promise that resolves when initialization is complete.
   */
  async initialize(): Promise<void> {
    await Promise.all([
      this.seedIfMissing<TeamMember[]>(this.teamMembersKey, 'assets/mock-data/team-members.json', []),
      this.seedIfMissing<Customer[]>(this.customersKey, 'assets/mock-data/customers.json', []),
      this.seedIfMissing<Activity[]>(this.activitiesKey, 'assets/mock-data/activities.json', []),
      this.seedIfMissing<Lesson[]>(this.lessonsKey, 'assets/mock-data/lessons.json', [])
    ]);
  }

  /**
   * Retrieves the list of team members from localStorage, filtering out any that are marked as deleted.
   * 
   * @returns A promise that resolves to an array of TeamMember objects.
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    return teamMembers.filter((teamMember) => teamMember.deleted !== 1);
  }

  /**
   * Adds a new team member to localStorage.
   * 
   * @param teamMember - The team member object to be added.
   * 
   * @returns A promise that resolves when the team member is added.
   */
  async addTeamMember(teamMember: TeamMember): Promise<void> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    const nextId = this.getNextId(teamMembers);
    teamMembers.push({ ...teamMember, id: nextId, deleted: 0 });
    this.write(this.teamMembersKey, teamMembers);
  }

  /**
   * Marks a team member as deleted in localStorage by setting the 'deleted' property to 1.
   * 
   * @param teamMember - The team member object to be marked as deleted.
   * 
   * @returns A promise that resolves when the team member is marked as deleted.
   */
  async deleteTeamMember(teamMember: TeamMember): Promise<void> {
    const teamMembers = this.read<TeamMember[]>(this.teamMembersKey, []);
    const index = teamMembers.findIndex((member) => member.id === teamMember.id);
    if (index !== -1) {
      teamMembers[index] = { ...teamMembers[index], deleted: 1 };
      this.write(this.teamMembersKey, teamMembers);
    }
  }

  /**
   * Retrieves the list of customers from localStorage, sorted by ID in descending order.
   * 
   * @returns A promise that resolves to an array of Customer objects.
   */
  async getCustomers(): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return [...customers].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  /** 
   * Retrieves the list of customers from localStorage filtered by a specific year, sorted by ID in descending order.
   * 
   * @param year - The year to filter customers by.
   * 
   * @return A promise that resolves to an array of Customer objects for the specified year.
   */
  async getCustomersByYear(year: number): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return customers
      .filter((customer) => new Date(customer.departureDate).getFullYear() === year)
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }
  /**
   * Retrieves the list of unpaid customers from localStorage, sorted by ID in descending order.
   * 
   * @returns A promise that resolves to an array of Customer objects where 'paid' is 0.
   */
  async getUnpaidCustomers(): Promise<Customer[]> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    return customers
      .filter((customer) => customer.paid === 0)
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  /**
   * Adds a new customer to localStorage.
   * 
   * @param customer - The customer object to be added.
   * 
   * @returns A promise that resolves when the customer is added.
   */
  async addCustomer(customer: Customer): Promise<void> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    const nextId = this.getNextId(customers);
    customers.push({ ...customer, id: nextId });
    this.write(this.customersKey, customers);
  }

  /**
   * Updates an existing customer in localStorage.
   * 
   * @param customer - The customer object to be updated.
   * 
   * @returns A promise that resolves when the customer is updated.
   */
  async updateCustomer(customer: Customer): Promise<void> {
    const customers = this.read<Customer[]>(this.customersKey, []);
    const index = customers.findIndex((item) => item.id === customer.id);
    if (index !== -1) {
      customers[index] = { ...customer };
      this.write(this.customersKey, customers);
    }
  }

  /**
   * Adds a new activity to localStorage.
   * 
   * @param activity - The activity object to be added.
   * 
   * @returns A promise that resolves when the activity is added.
   */
  async addActivity(activity: Activity): Promise<void> {
    const activities = this.read<Activity[]>(this.activitiesKey, []);
    const nextId = this.getNextId(activities);
    activities.push({ ...activity, id: nextId });
    this.write(this.activitiesKey, activities);
  }

  /**
   * Retrieves the list of activities for a specific customer from localStorage.
   * 
   * @param customerId - The ID of the customer whose activities are to be retrieved.
   * 
   * @returns A promise that resolves to an array of Activity objects for the specified customer.
   */
  async getActivityForCustomer(customerId: number): Promise<Activity[]> {
    const activities = this.read<Activity[]>(this.activitiesKey, []);
    return activities.filter((activity) => activity.customerId === customerId);
  }

  /**
   * Retrieves the list of lessons from localStorage.
   * 
   * @returns A promise that resolves to an array of Lesson objects.
   */
  async getLessons(): Promise<Lesson[]> {
    return this.read<Lesson[]>(this.lessonsKey, []);
  }

  /**
   * Adds a new lesson to localStorage.
   * 
   * @param lesson - The lesson object to be added.
   * 
   * @returns A promise that resolves when the lesson is added.
   */
  async addLesson(lesson: Lesson): Promise<void> {
    const lessons = this.read<Lesson[]>(this.lessonsKey, []);
    const nextId = this.getNextId(lessons);
    lessons.push({ ...lesson, id: nextId });
    this.write(this.lessonsKey, lessons);

    this.updateTeamMemberTotals(lesson.teacherId);
  }

  /**
   * Seeds localStorage with data from a specified asset path if the key is not already present. If loading from the asset fails, it falls back to a provided default value.
   * 
   * @param key - The localStorage key to check and seed.
   * @param assetPath - The path to the asset file containing the seed data.
   * @param fallback - The default value to use if loading from the asset fails.
   * 
   * @returns A promise that resolves when the seeding process is complete.
   */
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

  /**
   * Updates the total hours taught for team members based on the lessons data. If a teacherId is provided, it updates totals for that specific teacher; otherwise, it updates totals for all teachers.
   * 
   * @param teacherId - Optional ID of the teacher for whom to update totals. If not provided, totals for all teachers will be updated.
   */
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

  /**
   * Reads a value from localStorage and parses it as JSON. If the key is not found or parsing fails, it returns a provided fallback value.
   * 
   * @param key - The localStorage key to read.
   * @param fallback - The default value to return if the key is not found or parsing fails.
   * 
   * @returns The parsed value from localStorage or the fallback value.
   */
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

  /**
   * Writes a value to localStorage after serializing it as JSON.
   * 
   * @param key - The localStorage key to write to.
   * @param value - The value to be written.
   */
  private write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Calculates the next available ID for a new item based on the existing items in an array. It finds the maximum existing ID and returns one greater than that. If there are no items, it returns 1.
   * 
   * @param items - An array of items that may contain an 'id' property.
   * 
   * @returns The next available ID for a new item.
   */
  private getNextId<T extends { id?: number }>(items: T[]): number {
    const maxId = items.reduce((max, item) => Math.max(max, item.id ?? 0), 0);
    return maxId + 1;
  }
}
