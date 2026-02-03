import { Inject, Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { DATA_PROVIDER, DataProvider } from './data-provider';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbCustomers = signal<Customer[]>([]);

  // private dbSearchCustomers = signal<Customer[]>(this.dbCustomers());

  get dbCustomersSignal() {
    return this.dbCustomers;
  }


  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider) {}

  // Function that gets all the customers from the database.
  async getCustomers() {
    const customers = await this.dataProvider.getCustomers();
    this.dbCustomers.set(customers);
    // this.dbSearchCustomers.set(this.dbCustomers());
  }

  // Function that gets all customers that haven't paid yet
  async getUnpaidCustomers() {
    const customers = await this.dataProvider.getUnpaidCustomers();
    this.dbCustomers.set(customers);
    // this.dbSearchCustomers.set(this.dbCustomers());
  }

  // Function that adds a customer to the database
  async addCustomer(customer: Customer) {
    await this.dataProvider.addCustomer(customer);

    this.getUnpaidCustomers();
  }

  // Function to edit a customer from the database
  async updateCustomer(customer: Customer) {
    await this.dataProvider.updateCustomer(customer);

    this.getUnpaidCustomers();
  }
}
