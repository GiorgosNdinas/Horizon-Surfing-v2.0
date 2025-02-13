import { Injectable, signal } from "@angular/core";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Activity } from "../models/activity.modal";
import { DatabaseService } from "./database.service";
import { TeamMemberService } from "./team-member.service";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private db: SQLiteDBConnection = this.databaseService.getDatabaseConnection();

  dbActivitiesForCustomer = signal<Activity[]>([]);

  constructor(private databaseService: DatabaseService) { }

  /**
   * Adds a new activity to the database.
   *
   * @param {Activity} activity - The activity object containing the details to be added.
   * @returns {Promise<void>} A promise that resolves when the activity is successfully added.
   *
   * @throws Will throw an error if the database query fails.
   */
  async addActivity(activity: Activity) {
    const query = `INSERT INTO activity(customerId, name, type, amount, teamMemberId) VALUES (${activity.customerId}, '${activity.name}', '${activity.type}', '${activity.amount}', ${activity.teamMemberId})`;
    await this.db.query(query)
      .then(() => {
        console.log('Activity added successfully.');
      })
      .catch((error) => {
        console.error(error);
      })
  }


  /**
   * Retrieves activities for a specific customer from the database.
   *
   * @param {number} customerId - The ID of the customer whose activities are to be fetched.
   * @returns {Promise<Activity[]>} A promise that resolves to an array of activities for the specified customer.
   *
   * @throws Will throw an error if the database query fails.
   */
  async getActivityForCustomer(customerId: number) {
    const query = `SELECT * FROM activity WHERE customerId = ${customerId}`;
    const activitiesForCustomer = await this.db.query(query);
    this.dbActivitiesForCustomer.set(activitiesForCustomer.values || []);
  }
}