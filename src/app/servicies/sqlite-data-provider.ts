import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { DataProvider } from "./data-provider";
import { DatabaseService } from "./database.service";
import { TeamMember } from "../models/team-members.modal";
import { Customer } from "../models/customer.model";
import { Activity } from "../models/activity.modal";
import { Lesson } from "../models/lesson.model";


export class SqliteDataProvider implements DataProvider {
  constructor(private databaseService: DatabaseService) {}
  
  /**
   * Initializes the database connection.
   * 
   * @return A promise that resolves when the database is initialized.
   */
  async initialize(): Promise<void> {
    await this.databaseService.initializePlugin();
  }
  
  /**
   * Gets the database connection.
   * 
   * @return A promise that resolves to the SQLite database connection.
   */
  private async getDb(): Promise<SQLiteDBConnection> {
    return await this.databaseService.getDatabaseConnection();
  }

  /**
   * Gets all team members from the database.
   * 
   * @return A promise that resolves to an array of TeamMember objects.
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const db = await this.getDb();
    const teamMembers = await db.query('SELECT * FROM teamMember WHERE deleted = 0');
    return teamMembers.values || [];
  }


  /**
   * Adds a new team member to the database.
   * 
   * @param teamMember The TeamMember object to add.
   * @return A promise that resolves when the team member is added.
   */
  async addTeamMember(teamMember: TeamMember): Promise<void> {
    const db = await this.getDb();
    await db.run('INSERT INTO teamMember (name, surname, profilePic) VALUES (?, ?, ?)', [teamMember.name, teamMember.surname, teamMember.profilePic]);
  }

  /**
   * Deletes a team member from the database (soft delete).
   * 
   * @param teamMember The TeamMember object to delete.
   * @return A promise that resolves when the team member is deleted.
   */
  async deleteTeamMember(teamMember: TeamMember): Promise<void> {
    const db = await this.getDb();
    await db.run('UPDATE teamMember SET deleted = 1 WHERE id = ?', [teamMember.id]);
  }

  /**
   * Gets all customers from the database.
   * 
   * @return A promise that resolves to an array of Customer objects.
   */
  async getCustomers(): Promise<Customer[]> {
    const db = await this.getDb();
    const customers = await db.query('SELECT * FROM customer ORDER BY id DESC');
    return customers.values || [];
  }

  /**
   * Gets customers from the database filtered by a specific year.
   * 
   * @param year The year to filter customers by.
   * 
   * @return A promise that resolves to an array of Customer objects.
   */
  async getCustomersByYear(year: number): Promise<Customer[]> {
    const db = await this.getDb();
    const customers = await db.query(`SELECT * FROM customer WHERE strftime('%Y', departureDate) = ? ORDER BY id DESC`, [year.toString()]);
    return customers.values || [];
  }

  /**
   * Gets all unpaid customers from the database.
   * 
   * @return A promise that resolves to an array of unpaid Customer objects.
   */
  async getUnpaidCustomers(): Promise<Customer[]> {
    const db = await this.getDb();
    const customers = await db.query('SELECT * FROM customer WHERE paid = 0 ORDER BY id DESC');
    return customers.values || [];
  }

  /**
   * Adds a new customer to the database.
   * 
   * @param customer The Customer object to add.
   * 
   * @return A promise that resolves when the customer is added.
   */
  async addCustomer(customer: Customer): Promise<void> {
    const db = await this.getDb();
    await db.run('INSERT INTO customer (name, surname, homeAddress, hotel, hotelRoom, email, phoneNumber, departureDate, signature, terms, paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [customer.name, customer.surname, customer.homeAddress, customer.hotel, customer.hotelRoom, customer.email, customer.phoneNumber, customer.departureDate, customer.signature, customer.terms, customer.paid]);
  }

  /**
   * Updates an existing customer in the database.
   * 
   * @param customer The Customer object to update.
   * 
   * @return A promise that resolves when the customer is updated.
   */
  async updateCustomer(customer: Customer): Promise<void> {
    const db = await this.getDb();
    await db.run('UPDATE customer SET name = ?, surname = ?, homeAddress = ?, hotel = ?, hotelRoom = ?, email = ?, phoneNumber = ?, departureDate = ?, signature = ?, terms = ?, paid = ? WHERE id = ?', [customer.name, customer.surname, customer.homeAddress, customer.hotel, customer.hotelRoom, customer.email, customer.phoneNumber, customer.departureDate, customer.signature, customer.terms, customer.paid, customer.id]);
  }

  /**
   * Adds a new activity to the database.
   * 
   * @param activity The Activity object to add.
   * 
   * @return A promise that resolves when the activity is added.
   */
  async addActivity(activity: Activity): Promise<void> {
    const db = await this.getDb();
    await db.run('INSERT INTO activity (customerId, name, type, amount, teamMemberId) VALUES (?, ?, ?, ?, ?)', [activity.customerId, activity.name, activity.type, activity.amount, activity.teamMemberId]);
  }

  /**
   * Gets all activities for a specific customer from the database.
   * 
   * @param customerId The ID of the customer.
   * 
   * @return A promise that resolves to an array of Activity objects.
   */
  async getActivityForCustomer(customerId: number): Promise<Activity[]> {
    const db = await this.getDb();
    const activitiesForCustomer = await db.query('SELECT * FROM activity WHERE customerId = ?', [customerId]);
    return activitiesForCustomer.values || [];
  }

  /**
   * Gets all lessons from the database.
   * 
   * @return A promise that resolves to an array of Lesson objects.
   */
  async getLessons(): Promise<Lesson[]> {
    const db = await this.getDb();
    const lessons = await db.query('SELECT * FROM lesson');
    return lessons.values || [];
  }

  /**
   * Adds a new lesson to the database.
   * 
   * @param lesson The Lesson object to add.
   * 
   * @return A promise that resolves when the lesson is added. 
   */
  async addLesson(lesson: Lesson): Promise<void> {
    const db = await this.getDb();
    await db.run('INSERT INTO lesson (customerId, teacherId, lessonType, lessonHours, lessonDate) VALUES (?, ?, ?, ?, ?)', [lesson.customerId, lesson.teacherId, lesson.lessonType, lesson.lessonHours, lesson.lessonDate]);

    // await db.run('UPDATE teamMember SET totalHoursTaught = (SELECT SUM(lessonHours) FROM lesson WHERE teacherId = ?)', [lesson.teacherId]);

    // const currentDate = new Date().toISOString().split('T')[0];
    // await db.run(`UPDATE teamMember SET hoursTaughtThisMonth = (SELECT SUM(lessonHours) FROM lesson WHERE strftime('%Y-%m', lessonDate) = ? AND teacherId = ?)`, [currentDate.substring(0, 7), lesson.teacherId]); 
  }
}