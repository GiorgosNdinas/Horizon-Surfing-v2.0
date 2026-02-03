import { Inject, Injectable, signal } from '@angular/core';
import { TeamMember } from './../models/team-members.modal';
import { DATA_PROVIDER, DataProvider } from './data-provider';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  dbTeamMembers = signal<TeamMember[]>([]);

  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider) {
    this.getTeamMembers();
  }

  /**
   * Fetches all team members from the database that are not marked as deleted
   * and updates the dbTeamMembers signal with the retrieved data.
   */
  async getTeamMembers(){
    const teamMembers = await this.dataProvider.getTeamMembers();
    this.dbTeamMembers.set(teamMembers);
  }

  /**
   * Adds a new team member to the database and refreshes the team members list.
   * @param teamMember - The team member object to be added.
   */
  async addTeamMember(teamMember: TeamMember){
    await this.dataProvider.addTeamMember(teamMember);
    this.getTeamMembers();
  }

  /**
   * Marks a team member as deleted in the database and refreshes the team members list.
   * @param teamMember - The team member object to be marked as deleted.
   */
  async deleteTeamMember(teamMember: TeamMember){
    await this.dataProvider.deleteTeamMember(teamMember);
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
