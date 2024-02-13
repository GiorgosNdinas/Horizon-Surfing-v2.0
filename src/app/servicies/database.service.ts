import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Customer } from '../models/customer.model';
import { TeamMember } from '../models/team-members.modal';

const DB_HORIZON_SURFING = 'horizon-surfing-db';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  constructor() { }

  async initializePlugin(){
    this.db = await this.sqlite.createConnection(
      DB_HORIZON_SURFING,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const createTeamMemberSchema = `
    CREATE TABLE IF NOT EXISTS teamMember (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      totalHoursTaught INTEGER,
      hoursTaughtThisMonth INTEGER,
      subject TEXT NOT NULL,
      profilePic TEXT NOT NULL
    );
    `;

    const createCustomerSchema = `
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      homeAddress TEXT NOT NULL,
      hotel TEXT NOT NULL,
      hotelRoom TEXT NOT NULL,
      email TEXT NOT NULL,
      activity TEXT NOT NULL,
      activityType TEXT NOT NULL,
      insurance TEXT NOT NULL,
      departureDate TEXT NOT NULL,
      terms INTEGER,
      paid INTEGER DEFAULT 0,
      attachedTeacher INTEGER
    );
    `;

    await this.db.execute(createTeamMemberSchema);
    await this.db.execute(createCustomerSchema);
    
    return true;
  }

  getDatabaseConnection(){
    return this.db;
  }
}