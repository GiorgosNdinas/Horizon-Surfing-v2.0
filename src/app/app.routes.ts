import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'customers',
    loadChildren: () => import('./pages/customers/customers.routes').then((m) => m.customerRoutes)
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.routes').then((m) => m.teamRoutes)
  },
  // {
  //   path: 'terms',
  //   loadComponent: () => import('./components/terms-of-service/terms-of-service.component').then((m) => m.TermsOfServiceComponent)
  // },
  // {
  //   path: '',
  //   loadComponent: () => import('./pages/app-start-animation/app-start-animation.component').then((m) => m.AppStartAnimationComponent)
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
