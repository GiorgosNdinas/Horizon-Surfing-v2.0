import { Injectable, signal } from '@angular/core';
import { TeamMember } from '../models/team-members.modal';
import { DatabaseService } from './database.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private db: SQLiteDBConnection = this.databaseService.getDatabaseConnection();
  dbTeamMembers = signal<TeamMember[]>([]);

  constructor(private databaseService: DatabaseService) {}

  async getTeamMembers(){
    const teamMembers = await this.db.query('SELECT * FROM teamMember WHERE deleted = 0');
    this.dbTeamMembers.set(teamMembers.values || []);
  }

  async addTeamMember(teamMember: TeamMember){
    const query = `INSERT INTO teamMember (name, surname, totalHoursTaught, hoursTaughtThisMonth, subject, profilePic) VALUES ('${teamMember.name}', '${teamMember.surname}', ${teamMember.totalHoursTaught}, ${teamMember.hoursTaughtThisMonth}, '${teamMember.subject}', '${teamMember.profilePic}')`;
    const result = await this.db.query(query);
    this.getTeamMembers();
  }

  async deleteTeamMember(teamMember: TeamMember){
    const query = `UPDATE teamMember SET deleted = 1 WHERE id = ${teamMember.id}`;
    const result = await this.db.query(query);
    this.getTeamMembers();
  }

}
