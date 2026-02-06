import { InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Capacitor } from '@capacitor/core';
import { Activity } from "../models/activity.modal";
import { Customer } from "../models/customer.model";
import { Lesson } from "../models/lesson.model";
import { TeamMember } from "../models/team-members.modal";
import { DatabaseService } from "./database.service";
import { WebMockDataProvider } from "./web-mock-data-provider";
import { SqliteDataProvider } from "./sqlite-data-provider";


export interface DataProvider {
  initialize(): Promise<void>;
  getTeamMembers(): Promise<TeamMember[]>;
  addTeamMember(teamMember: TeamMember): Promise<void>;
  deleteTeamMember(teamMember: TeamMember): Promise<void>;
  getCustomers(): Promise<Customer[]>;
  getUnpaidCustomers(): Promise<Customer[]>;
  addCustomer(customer: Customer): Promise<void>;
  updateCustomer(customer: Customer): Promise<void>;
  addActivity(activity: Activity): Promise<void>;
  getActivityForCustomer(customerId: number): Promise<Activity[]>;
  getLessons(): Promise<Lesson[]>;
  addLesson(lesson: Lesson): Promise<void>;
}
/**
 * Injection token for the DataProvider service.
 */
export const DATA_PROVIDER = new InjectionToken<DataProvider>('DATA_PROVIDER');

/**
 * Factory function to create the appropriate DataProvider implementation
 * based on the platform (web or native).
 * 
 * @param databaseService The DatabaseService instance.
 * @param http The HttpClient instance.
 * 
 * @returns An instance of DataProvider.
 */
export function dataProviderFactory(
  databaseService: DatabaseService,
  http: HttpClient
): DataProvider {
  return Capacitor.getPlatform() === 'web'
    ? new WebMockDataProvider(http)
    : new SqliteDataProvider(databaseService);
}