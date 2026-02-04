import { Inject, Injectable, signal } from "@angular/core";
import { Activity } from "../models/activity.modal";
import { DATA_PROVIDER, DataProvider } from "./data-provider";

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  dbActivitiesForCustomer = signal<Activity[]>([]);

  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider){}
  /**
   * Adds a new activity to the database.
   *
   * @param {Activity} activity - The activity object containing the details to be added.
   * @returns {Promise<void>} A promise that resolves when the activity is successfully added.
   *
   * @throws Will throw an error if the database query fails.
   */
  async addActivity(activity: Activity) {
    await this.dataProvider.addActivity(activity);
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
    const activities = await this.dataProvider.getActivityForCustomer(customerId);
    this.dbActivitiesForCustomer.set(activities);
  }
}

