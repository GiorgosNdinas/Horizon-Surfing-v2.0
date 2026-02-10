import { Routes } from "@angular/router";

export const teamRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./team.page').then((m) => m.TeamPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage)
  },
  {
    path: 'admin/:id',
    loadComponent: () => import('../customers/customer-details/customer-details.page').then((m) => m.CustomerDetailsPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./team-member/team-member.component').then((m) => m.TeamMemberComponent)
  }
]