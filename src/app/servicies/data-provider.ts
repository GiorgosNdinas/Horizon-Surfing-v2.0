import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { Activity } from '../models/activity.modal';
import { Customer } from '../models/customer.model';
import { Lesson } from '../models/lesson.model';
import { TeamMember } from '../models/team-members.modal';
import { DatabaseService } from './database.service';
import { SqliteDataProvider } from './sqlite-data-provider';
import { WebMockDataProvider } from './web-mock-data-provider';

export interface DataProvider {
  initialize(): Promise<void>;
  getTeamMembers(): Promise<TeamMember[]>;
  addTeamMember(teamMember: TeamMember): Promise<void>;
  deleteTeamMember(teamMember: TeamMember): Promise<void>;
  getCustomers(): Promise<Customer[]>;
  getCustomersByYear(year: number): Promise<Customer[]>;
  getUnpaidCustomers(): Promise<Customer[]>;
  addCustomer(customer: Customer): Promise<void>;
  updateCustomer(customer: Customer): Promise<void>;
  addActivity(activity: Activity): Promise<void>;
  getActivityForCustomer(customerId: number): Promise<Activity[]>;
  getLessons(): Promise<Lesson[]>;
  addLesson(lesson: Lesson): Promise<void>;
}

export const DATA_PROVIDER = new InjectionToken<DataProvider>('DATA_PROVIDER');

export function dataProviderFactory(
  databaseService: DatabaseService,
  http: HttpClient
): DataProvider {
  return Capacitor.getPlatform() === 'web'
    ? new WebMockDataProvider(http)
    : new SqliteDataProvider(databaseService);
}
