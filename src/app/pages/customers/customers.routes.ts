import { Routes } from "@angular/router";

export const customerRoutes : Routes = [
  {
    path: '',
    loadComponent: () => import('./customers.page').then((m) => m.CustomersPage),
  },
  {
    path: 'add-customer',
    loadComponent: () => import('./add-customer/add-customer.component').then((m) => m.AddCustomerComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./customer-details/customer-details.page').then((m) => m.CustomerDetailsPage),
  },
]