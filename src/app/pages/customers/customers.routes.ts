import { Routes } from "@angular/router";

export const customerRoutes : Routes = [
  {
    path: '',
    loadComponent: () => import('./customers.page').then((m) => m.CustomersPage),
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./customer-details/customer-details.component').then((m) => m.CustomerDetailsComponent),
  // },
]