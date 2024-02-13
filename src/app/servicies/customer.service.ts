import { DatabaseService } from 'src/app/servicies/database.service';
import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer.model';
import { TeamMember } from '../models/team-members.modal';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private db: SQLiteDBConnection = this.databaseService.getDatabaseConnection();

  // customers = signal<Customer[]>(
  //   [
  //     {
  //       id: 1,
  //       name: "John",
  //       surname: "Doe",
  //       homeAddress: "123 Main St, City",
  //       hotel: "Beach Resort",
  //       hotelRoom: "102",
  //       email: "john.doe@example.com",
  //       activity: "Windsurfing",
  //       activityType: "Rental",
  //       insurance: "1 week",
  //       departureDate: "2024-05-15",
  //       paid: 1,
  //       terms: 1
  //     },
  //     {
  //       id: 2,
  //       name: "Jane",
  //       surname: "Smith",
  //       homeAddress: "456 Oak Ave, Town",
  //       hotel: "Oceanfront Hotel",
  //       hotelRoom: "205",
  //       email: "jane.smith@example.com",
  //       activity: "Kitesurfing",
  //       activityType: "Lesson",
  //       insurance: "2 weeks",
  //       departureDate: "2024-06-01",
  //       paid: 0,
  //       terms: 1,
  //       attachedTeacher: 1
  //     },
  //     {
  //       id: 3,
  //       name: "Bob",
  //       surname: "Johnson",
  //       homeAddress: "789 Pine Ln, Village",
  //       hotel: "Seaside Lodge",
  //       hotelRoom: "301",
  //       email: "bob.johnson@example.com",
  //       activity: "Wingfoiling",
  //       activityType: "Other",
  //       insurance: "no",
  //       departureDate: "2024-07-10",
  //       paid: 1,
  //       terms: 1
  //     },
  //     {
  //       id: 4,
  //       name: "Alice",
  //       surname: "Williams",
  //       homeAddress: "101 Cedar Blvd, Hamlet",
  //       hotel: "Sunset Inn",
  //       hotelRoom: "412",
  //       email: "alice.williams@example.com",
  //       activity: "Catamaran",
  //       activityType: "Rental",
  //       insurance: "1 week",
  //       departureDate: "2024-08-20",
  //       paid: 0,
  //       terms: 1
  //     },
  //     {
  //       id: 5,
  //       name: "Eva",
  //       surname: "Rodriguez",
  //       homeAddress: "246 Maple St, Suburb",
  //       hotel: "Marina Plaza",
  //       hotelRoom: "512",
  //       email: "eva.rodriguez@example.com",
  //       activity: "Windsurfing",
  //       activityType: "Rental",
  //       insurance: "2 weeks",
  //       departureDate: "2024-09-05",
  //       paid: 0,
  //       terms: 1
  //     },
  //     {
  //       id: 6,
  //       name: "David",
  //       surname: "Lee",
  //       homeAddress: "789 Elm Dr, Countryside",
  //       hotel: "Mountain Lodge",
  //       hotelRoom: "201",
  //       email: "david.lee@example.com",
  //       activity: "Kitesurfing",
  //       activityType: "Lesson",
  //       insurance: "1 week",
  //       departureDate: "2024-10-12",
  //       paid: 0,
  //       terms: 1,
  //       attachedTeacher: 1
  //     },
  //     {
  //       id: 7,
  //       name: "Sophie",
  //       surname: "Chen",
  //       homeAddress: "321 Birch Rd, Outskirts",
  //       hotel: "Riverside Inn",
  //       hotelRoom: "105",
  //       email: "sophie.chen@example.com",
  //       activity: "Wingfoiling",
  //       activityType: "Other",
  //       insurance: "2 weeks",
  //       departureDate: "2024-11-18",
  //       paid: 0,
  //       terms: 1
  //     },
  //     {
  //       id: 8,
  //       name: "Michael",
  //       surname: "Brown",
  //       homeAddress: "555 Pine St, Downtown",
  //       hotel: "City View Hotel",
  //       hotelRoom: "405",
  //       email: "michael.brown@example.com",
  //       activity: "Catamaran",
  //       activityType: "Rental",
  //       insurance: "no",
  //       departureDate: "2024-12-03",
  //       paid: 0,
  //       terms: 1
  //     },
  //     {
  //       id: 9,
  //       name: "Olivia",
  //       surname: "Garcia",
  //       homeAddress: "888 Oak Ave, Metro",
  //       hotel: "Skyscraper Suites",
  //       hotelRoom: "601",
  //       email: "olivia.garcia@example.com",
  //       activity: "Windsurfing",
  //       activityType: "Lesson",
  //       insurance: "1 week",
  //       departureDate: "2025-01-08",
  //       paid: 0,
  //       terms: 1,
  //       attachedTeacher: 2
  //     },
  //     {
  //       id: 10,
  //       name: "Daniel",
  //       surname: "Lopez",
  //       homeAddress: "444 Cedar Blvd, Urban",
  //       hotel: "City Lights Resort",
  //       hotelRoom: "312",
  //       email: "daniel.lopez@example.com",
  //       activity: "Kitesurfing",
  //       activityType: "Rental",
  //       insurance: "2 weeks",
  //       departureDate: "2025-02-14",
  //       paid: 1,
  //       terms: 1
  //     },
  //     {
  //       id: 11,
  //       name: "Ava",
  //       surname: "Clark",
  //       homeAddress: "777 Maple St, City Center",
  //       hotel: "Downtown Suites",
  //       hotelRoom: "502",
  //       email: "ava.clark@example.com",
  //       activity: "Wingfoiling",
  //       activityType: "Other",
  //       insurance: "1 week",
  //       departureDate: "2025-03-21",
  //       paid: 0,
  //       terms: 1
  //     },
  //     {
  //       id:12,
  //       name: "Ryan",
  //       surname: "Turner",
  //       homeAddress: "999 Birch Rd, Financial District",
  //       hotel: "Business Tower Hotel",
  //       hotelRoom: "205",
  //       email: "ryan.turner@example.com",
  //       activity: "Catamaran",
  //       activityType: "Lesson",
  //       insurance: "No",
  //       departureDate: "2025-04-27",
  //       paid: 0,
  //       terms: 1
  //     },
  //   ]
  // ); 

  // searchCustomers = signal<Customer[]>(this.customers());


  dbCustomers = signal<Customer[]>([]);

  dbSearchCustomers = signal<Customer[]>(this.dbCustomers());



  constructor(private databaseService: DatabaseService) {}

  async getCustomers(){
    const customers = await this.db.query('SELECT * FROM customer');
    this.dbCustomers.set(customers.values || []);
    this.dbSearchCustomers.set(this.dbCustomers());
  }

  async addCustomer(customer: Customer){
    const query = `INSERT INTO customer (name, surname, homeAddress, hotel, hotelRoom, email, activity, activityType, insurance, departureDate, terms, paid, attachedTeacher) VALUES ('${customer.name}', '${customer.surname}', '${customer.homeAddress}', '${customer.hotel}', '${customer.hotelRoom}', '${customer.email}', '${customer.activity}', '${customer.activityType}', '${customer.insurance}','${customer.departureDate}',${customer.terms}, ${customer.paid}, ${customer.attachedTeacher})`;
    const result = await this.db.query(query);

    this.getCustomers();
  }

  async updateCustomer(customer: Customer){
    const query = `UPDATE customer SET name = '${customer.name}', surname = '${customer.surname}', homeAddress = '${customer.homeAddress}', hotel = '${customer.hotel}', hotelRoom = '${customer.hotelRoom}', email = '${customer.email}', activity = '${customer.activity}', activityType = '${customer.activityType}', insurance = '${customer.insurance}', departureDate = '${customer.departureDate}', terms = ${customer.terms}, paid = ${customer.paid}, attachedTeacher = ${customer.attachedTeacher} WHERE id = ${customer.id}`;
    const result = await this.db.query(query);

    this.getCustomers();
  }
}
