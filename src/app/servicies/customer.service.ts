import { DatabaseService } from 'src/app/servicies/database.service';
import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private db: SQLiteDBConnection = this.databaseService.getDatabaseConnection();

  dbCustomers = signal<Customer[]>([]);

  dbSearchCustomers = signal<Customer[]>(this.dbCustomers());



  constructor(private databaseService: DatabaseService) {}

  // Function that gets all the customers from the database.
  async getCustomers(){
    const customers = await this.db.query('SELECT * FROM customer');
    this.dbCustomers.set(customers.values || []);
    this.dbSearchCustomers.set(this.dbCustomers());
  }

  // Function that adds a customer to the database
  async addCustomer(customer: Customer){
    const query = `INSERT INTO customer (name, surname, homeAddress, hotel, hotelRoom, email, phoneNumber, departureDate, signature, terms, paid) VALUES ('${customer.name}', '${customer.surname}', '${customer.homeAddress}', '${customer.hotel}', '${customer.hotelRoom}', '${customer.email}', '${customer.phoneNumber}', '${customer.departureDate}', '${customer.signature}' , ${customer.terms}, ${customer.paid})`;
    await this.db.query(query);

    this.getCustomers();
  }

  // Function to edit a customer from the database
  async updateCustomer(customer: Customer){
    const query = `UPDATE customer SET name = '${customer.name}', surname = '${customer.surname}', homeAddress = '${customer.homeAddress}', hotel = '${customer.hotel}', hotelRoom = '${customer.hotelRoom}', email = '${customer.email}', phoneNumber = '${customer.phoneNumber}', departureDate = '${customer.departureDate}', signature = '${customer.signature}', terms = ${customer.terms}, paid = ${customer.paid} WHERE id = ${customer.id}`;
    await this.db.query(query);

    this.getCustomers();
  }
}
