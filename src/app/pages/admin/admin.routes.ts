import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.page').then((m) => m.AdminPage)
  },
  {
    path: ':id',
    loadComponent: () => import('../customers/customer-details/customer-details.page').then((m) => m.CustomerDetailsPage),
  },
  {
    path: ':id/new-activity',
    loadComponent: () => import('../../components/new-activity/new-activity.component').then((m) => m.NewActivityComponent),
  }
];