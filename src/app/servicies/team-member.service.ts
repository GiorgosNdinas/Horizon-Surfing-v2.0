import { Injectable, signal } from '@angular/core';
import { TeamMember } from '../models/team-members.modal';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  teamMembers = signal<TeamMember[]>([
    {
      id: 1,
      name: "Giuseppe",
      surname: "Amoroso",
      totalHoursTaught: 500,
      hoursTaughtThisMonth: 20,
      subject: ["Kitesurfing", "Catamaran"],
      profilePic: "assets/profiles/Peppe-profile.png"
    },
    {
      id: 2,
      name: "Jane",
      surname: "Smith",
      totalHoursTaught: 350,
      hoursTaughtThisMonth: 15,
      subject: ["Windsurfing"],
      profilePic: "assets/profiles/Jana-profile.png"
    },
    {
      id: 3,
      name: "Alex",
      surname: "Johnson",
      totalHoursTaught: 200,
      hoursTaughtThisMonth: 10,
      subject: ["Wingfoiling"],
      profilePic: "assets/profiles/Alex-profile.png"
    },
    {
      id: 4,
      name: "Emily",
      surname: "Williams",
      totalHoursTaught: 600,
      hoursTaughtThisMonth: 25,
      subject: ["Catamaran"],
      profilePic: "assets/profiles/Emily-profile.png"
    },
  ]);

  constructor() { }

}
