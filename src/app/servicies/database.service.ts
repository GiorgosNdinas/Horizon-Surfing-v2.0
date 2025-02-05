import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_HORIZON_SURFING = 'horizon-surfing-db-1';

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
      profilePic TEXT NOT NULL,
      deleted INTEGER DEFAULT 0
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
      phoneNumber TEXT NOT NULL,
      departureDate TEXT NOT NULL,
      signature TEXT,
      terms INTEGER,
      paid INTEGER DEFAULT 0
    );
    `;

    const createActivitySchema = `
    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      teamMemberId INTEGER
    );
    `;

    await this.db.execute(createTeamMemberSchema);
    await this.db.execute(createCustomerSchema);
    await this.db.execute(createActivitySchema);
    
    return true;
  }

  getDatabaseConnection(){
    return this.db;
  }
}
