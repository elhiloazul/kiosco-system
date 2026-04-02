import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'tenants',
    pathMatch: 'full',
  },
  {
    path: 'tenants',
    loadComponent: () =>
      import('./tenants/tenant-list/tenant-list.component').then((m) => m.TenantListComponent),
  },
];
