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

  async getCustomers(){
    const customers = await this.db.query('SELECT * FROM customer');
    this.dbCustomers.set(customers.values || []);
    this.dbSearchCustomers.set(this.dbCustomers());
  }

  async addCustomer(customer: Customer){
    const query = `INSERT INTO customer (name, surname, homeAddress, hotel, hotelRoom, email, phoneNumber, activity, activityType, insurance, departureDate, signature, terms, paid, attachedTeacher) VALUES ('${customer.name}', '${customer.surname}', '${customer.homeAddress}', '${customer.hotel}', '${customer.hotelRoom}', '${customer.email}', '${customer.phoneNumber}', '${customer.activity}', '${customer.activityType}', '${customer.insurance}','${customer.departureDate}', '${customer.signature}' , ${customer.terms}, ${customer.paid}, ${customer.attachedTeacher})`;
    const result = await this.db.query(query);

    this.getCustomers();
  }

  async updateCustomer(customer: Customer){
    const query = `UPDATE customer SET name = '${customer.name}', surname = '${customer.surname}', homeAddress = '${customer.homeAddress}', hotel = '${customer.hotel}', hotelRoom = '${customer.hotelRoom}', email = '${customer.email}', phoneNumber = '${customer.phoneNumber}', activity = '${customer.activity}', activityType = '${customer.activityType}', insurance = '${customer.insurance}', departureDate = '${customer.departureDate}', signature = '${customer.signature}', terms = ${customer.terms}, paid = ${customer.paid}, attachedTeacher = ${customer.attachedTeacher} WHERE id = ${customer.id}`;
    const result = await this.db.query(query);

    this.getCustomers();
  }
}
