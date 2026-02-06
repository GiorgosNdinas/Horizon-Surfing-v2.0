import { Inject, Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { DATA_PROVIDER, DataProvider } from './data-provider';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbCustomers = signal<Customer[]>([]);

  get dbCustomersSignal() {
    return this.dbCustomers;
  }

  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider) { }

  /**
   * Function that gets all customers from the database
   * 
   * @return {Promise<void>} A promise that resolves when the customers are fetched and stored.
   * 
   * @throws Will throw an error if the database query fails.
   */
  async getCustomers() {
    const customers = await this.dataProvider.getCustomers();
    this.dbCustomers.set(customers);
  }

  /**
   * Function that gets all customers that haven't paid yet
   * 
   * @return {Promise<void>} A promise that resolves when the unpaid customers are fetched and stored.
   * 
   * @throws Will throw an error if the database query fails.
   */
  async getUnpaidCustomers() {
    const customers = await this.dataProvider.getUnpaidCustomers();
    this.dbCustomers.set(customers);
  }

  /**
   * Function to add a new customer to the database
   * 
   * @param {Customer} customer - The customer object to be added.
   * @return {Promise<void>} A promise that resolves when the customer is added and the customer list is updated.
   * 
   * @throws Will throw an error if the database insertion fails.
   */
  async addCustomer(customer: Customer) {
    await this.dataProvider.addCustomer(customer);
    await this.getCustomers();
  }

  /**
   * Function to update an existing customer in the database
   * 
   * @param customer 
   * @return {Promise<void>} A promise that resolves when the customer is updated and the customer list is refreshed.
   * 
   * @throws Will throw an error if the database update fails.
   */
  async updateCustomer(customer: Customer) {
    await this.dataProvider.updateCustomer(customer);
    await this.getCustomers();
  }
}
