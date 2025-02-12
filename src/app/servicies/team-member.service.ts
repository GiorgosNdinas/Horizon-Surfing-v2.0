import { TeamMember } from './../models/team-members.modal';
import { Injectable, signal } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private db: SQLiteDBConnection = this.databaseService.getDatabaseConnection();
  dbTeamMembers = signal<TeamMember[]>([]);

  constructor(private databaseService: DatabaseService) {}

  /**
   * Fetches all team members from the database that are not marked as deleted
   * and updates the dbTeamMembers signal with the retrieved data.
   */
  async getTeamMembers(){
    const teamMembers = await this.db.query('SELECT * FROM teamMember WHERE deleted = 0');
    this.dbTeamMembers.set(teamMembers.values || []);
  }

  /**
   * Adds a new team member to the database and refreshes the team members list.
   * @param teamMember - The team member object to be added.
   */
  async addTeamMember(teamMember: TeamMember){
    const query = `INSERT INTO teamMember (name, surname, profilePic) VALUES ('${teamMember.name}', '${teamMember.surname}', '${teamMember.profilePic}')`;
    const result = await this.db.query(query);
    this.getTeamMembers();
  }

  /**
   * Marks a team member as deleted in the database and refreshes the team members list.
   * @param teamMember - The team member object to be marked as deleted.
   */
  async deleteTeamMember(teamMember: TeamMember){
    const query = `UPDATE teamMember SET deleted = 1 WHERE id = ${teamMember.id}`;
    const result = await this.db.query(query);
    this.getTeamMembers();
  }

  /**
   * Retrieves the name of a team member by their ID.
   * @param id - The ID of the team member.
   * @returns The name of the team member or 'Unknown' if not found.
   */
  getTeamMemberName(id :Number){
    const teamMember = this.dbTeamMembers().find((teamMember) => teamMember.id === id);
    return teamMember ? teamMember.name: 'Unknown';
  }

}
