import { DatabaseService } from 'src/app/servicies/database.service';
import { effect, Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private dbCustomers = signal<Customer[]>([]);

  get dbCustomersSignal() {
    return this.dbCustomers;
  }


  constructor(private databaseService: DatabaseService) {
    effect(() => {
      if (this.databaseService.isReady()) {
        this.getCustomers();
      }
    });
  }

  private async getDb(): Promise<SQLiteDBConnection> {
    return await this.databaseService.getDatabaseConnection();
  }

  // Function that gets all the customers from the database.
  async getCustomers() {
    const db = await this.getDb();
    const customers = await db.query('SELECT * FROM customer ORDER BY id DESC');
    this.dbCustomers.set(customers.values || []);
  }

  // Function that adds a customer to the database
  async addCustomer(customer: Customer) {
    const db = await this.getDb();

    await db.run(
      `INSERT INTO customer
      (name, surname, homeAddress, hotel, hotelRoom, email, phoneNumber, departureDate, signature, terms, paid)
     VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer.name,
        customer.surname,
        customer.homeAddress,
        customer.hotel,
        customer.hotelRoom,
        customer.email,
        customer.phoneNumber,
        customer.departureDate,
        customer.signature,
        customer.terms,
        customer.paid,
      ]
    );

    await this.getCustomers();
  }

  // Function to edit a customer from the database
  async updateCustomer(customer: Customer) {
    const db = await this.getDb();

    await db.run(
      `UPDATE customer SET
      name = ?,
      surname = ?,
      homeAddress = ?,
      hotel = ?,
      hotelRoom = ?,
      email = ?,
      phoneNumber = ?,
      departureDate = ?,
      signature = ?,
      terms = ?,
      paid = ?
     WHERE id = ?`,
      [
        customer.name,
        customer.surname,
        customer.homeAddress,
        customer.hotel,
        customer.hotelRoom,
        customer.email,
        customer.phoneNumber,
        customer.departureDate,
        customer.signature,
        customer.terms,
        customer.paid,
        customer.id,
      ]
    );

    await this.getCustomers();
  }

}
