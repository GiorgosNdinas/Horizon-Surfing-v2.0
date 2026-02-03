import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Activity } from '../models/activity.modal';
import { Customer } from '../models/customer.model';
import { Lesson } from '../models/lesson.model';
import { TeamMember } from '../models/team-members.modal';
import { DataProvider } from './data-provider';
import { DatabaseService } from './database.service';

export class SqliteDataProvider implements DataProvider {
  constructor(private databaseService: DatabaseService) {}

  async initialize(): Promise<void> {
    await this.databaseService.initializePlugin();
  }

  private async getDb(): Promise<SQLiteDBConnection> {
    return await this.databaseService.getDatabaseConnection1();
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const db = await this.getDb();
    const teamMembers = await db.query('SELECT * FROM teamMember WHERE deleted = 0');
    return teamMembers.values || [];
  }

  async addTeamMember(teamMember: TeamMember): Promise<void> {
    const db = await this.getDb();
    const query = `INSERT INTO teamMember (name, surname, profilePic) VALUES ('${teamMember.name}', '${teamMember.surname}', '${teamMember.profilePic}')`;
    await db.query(query);
  }

  async deleteTeamMember(teamMember: TeamMember): Promise<void> {
    const db = await this.getDb();
    const query = `UPDATE teamMember SET deleted = 1 WHERE id = ${teamMember.id}`;
    await db.query(query);
  }

  async getCustomers(): Promise<Customer[]> {
    const db = await this.getDb();
    const customers = await db.query('SELECT * FROM customer ORDER BY id DESC');
    return customers.values || [];
  }

  async getUnpaidCustomers(): Promise<Customer[]> {
    const db = await this.getDb();
    const customers = await db.query('SELECT * FROM customer WHERE paid = 0 ORDER BY id DESC');
    return customers.values || [];
  }

  async addCustomer(customer: Customer): Promise<void> {
    const db = await this.getDb();
    const query = `INSERT INTO customer (name, surname, homeAddress, hotel, hotelRoom, email, phoneNumber, departureDate, signature, terms, paid) VALUES ('${customer.name}', '${customer.surname}', '${customer.homeAddress}', '${customer.hotel}', '${customer.hotelRoom}', '${customer.email}', '${customer.phoneNumber}', '${customer.departureDate}', '${customer.signature}' , ${customer.terms}, ${customer.paid})`;
    await db.query(query);
  }

  async updateCustomer(customer: Customer): Promise<void> {
    const db = await this.getDb();
    const query = `UPDATE customer SET name = '${customer.name}', surname = '${customer.surname}', homeAddress = '${customer.homeAddress}', hotel = '${customer.hotel}', hotelRoom = '${customer.hotelRoom}', email = '${customer.email}', phoneNumber = '${customer.phoneNumber}', departureDate = '${customer.departureDate}', signature = '${customer.signature}', terms = ${customer.terms}, paid = ${customer.paid} WHERE id = ${customer.id}`;
    await db.query(query);
  }

  async addActivity(activity: Activity): Promise<void> {
    const db = await this.getDb();
    const query = `INSERT INTO activity(customerId, name, type, amount, teamMemberId) VALUES (${activity.customerId}, '${activity.name}', '${activity.type}', '${activity.amount}', ${activity.teamMemberId})`;
    await db.query(query);
  }

  async getActivityForCustomer(customerId: number): Promise<Activity[]> {
    const db = await this.getDb();
    const query = `SELECT * FROM activity WHERE customerId = ${customerId}`;
    const activitiesForCustomer = await db.query(query);
    return activitiesForCustomer.values || [];
  }

  async getLessons(): Promise<Lesson[]> {
    const db = await this.getDb();
    const lessons = await db.query('SELECT * FROM lesson');
    return lessons.values || [];
  }

  async addLesson(lesson: Lesson): Promise<void> {
    const db = await this.getDb();
    const query = `INSERT INTO lesson (customerId, teacherId, lessonType, lessonHours, lessonDate) VALUES (${lesson.customerId}, ${lesson.teacherId}, '${lesson.lessonType}', '${lesson.lessonHours}', '${lesson.lessonDate}')`;
    await db.query(query);

    const totalHoursQuery = `UPDATE teamMember SET totalHoursTaught = (SELECT SUM(lessonHours) FROM lesson WHERE teacherId = ${lesson.teacherId})`;
    await db.query(totalHoursQuery);

    const currentDate = new Date().toISOString().split('T')[0];
    const monthlyHoursQuery = `UPDATE teamMember SET hoursTaughtThisMonth = (SELECT SUM(lessonHours) FROM lesson WHERE strftime('%Y-%m', lessonDate) = '${currentDate.substring(0, 7)}')`;
    await db.query(monthlyHoursQuery);
  }
}
