import { TeamMember } from './../models/team-members.modal';
import { Inject, Injectable, signal } from '@angular/core';
import { DATA_PROVIDER, DataProvider } from './data-provider';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private dbTeamMembers = signal<TeamMember[]>([]);

  getDbTeamMembers(){
    return this.dbTeamMembers;
  }

  constructor(@Inject(DATA_PROVIDER) private dataProvider: DataProvider) {}

  /**
   * Fetches all team members from the database and updates the signal.
   * 
   * @return A promise that resolves when the team members are fetched and the signal is updated.
   */
  async getTeamMembers(){
    const teamMembers = await this.dataProvider.getTeamMembers();
    this.dbTeamMembers.set(teamMembers);
  }

  /**
   * Adds a new team member to the database and refreshes the team members list.
   * 
   * @param teamMember - The team member object to be added.
   * 
   * @return A promise that resolves when the team member is added and the list is refreshed.
   */
  async addTeamMember(teamMember: TeamMember){
    await this.dataProvider.addTeamMember(teamMember);
    this.getTeamMembers();
  }

  /**
    * Deletes a team member from the database and refreshes the team members list.
    * 
    * @param teamMember - The team member object to be deleted.
    * 
    * @return A promise that resolves when the team member is deleted and the list is refreshed.
   */
  async deleteTeamMember(teamMember: TeamMember): Promise<void>{
    await this.dataProvider.deleteTeamMember(teamMember);
    this.getTeamMembers();
  }

  /**
   * Retrieves the name of a team member by their ID.
   * 
   * @param id - The ID of the team member.
   * 
   * @returns The name of the team member or 'Unknown' if not found.
   */
  getTeamMemberName(id :number){
    const teamMember = this.dbTeamMembers().find((teamMember) => teamMember.id === id);
    return teamMember ? teamMember.name: 'Unknown';
  }

}
