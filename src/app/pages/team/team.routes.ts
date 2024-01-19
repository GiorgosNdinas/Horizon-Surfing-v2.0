import { Routes } from "@angular/router";

export const teamRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./team.page').then((m) => m.TeamPage)
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./team-member/team-member.component').then((m) => m.TeamMemberComponent)
  // }
]