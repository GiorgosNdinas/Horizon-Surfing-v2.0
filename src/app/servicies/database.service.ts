import { Injectable, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { firstValueFrom, filter } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

const DB_HORIZON_SURFING = 'horizon-surfing-db-1';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private ready = signal<boolean>(false);

  get isReady() {
    return this.ready;
  }

  constructor() { }

  /**
   * Initializes the SQLite plugin and creates the database schema if it doesn't exist.
   * @return A promise that resolves when the plugin is initialized and the schema is created.
   */
  async initializePlugin() {

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
      amount TEXT NOT NULL,
      teamMemberId INTEGER
    );
    `;

    await this.db.execute(createTeamMemberSchema);
    await this.db.execute(createCustomerSchema);
    await this.db.execute(createActivitySchema);

    // Safe migration: add columns only if missing
    if (!(await this.columnExists('activity', 'durationMinutes'))) {
      await this.db.execute(`ALTER TABLE activity ADD COLUMN durationMinutes INTEGER DEFAULT NULL;`);
    }

    if (!(await this.columnExists('activity', 'lessonFormat'))) {
      await this.db.execute(`ALTER TABLE activity ADD COLUMN lessonFormat TEXT DEFAULT NULL;`);
    }

    this.ready.set(true);

    return true;
  }

  /**
   * Gets the database connection, waiting for initialization if necessary.
   * 
   * @return A promise that resolves to the SQLiteDBConnection instance.
   */
  async getDatabaseConnection(): Promise<SQLiteDBConnection> {
    if (!this.ready()) {
      // wait until ready
      await firstValueFrom(
        toObservable(this.ready).pipe(filter(Boolean))
      );
    }
    return this.db;
  }

  private async columnExists(table: string, column: string): Promise<boolean> {
    const res = await this.db.query(`PRAGMA table_info(${table});`);
    const cols = res.values ?? [];
    return cols.some((c: any) => c.name === column);
  }
}
