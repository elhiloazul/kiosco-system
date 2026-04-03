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
  {
    path: 'tenants/:tenantId',
    loadComponent: () =>
      import('./tenants/tenant-dashboard/tenant-dashboard.component').then((m) => m.TenantDashboardComponent),
  },
  {
    path: 'tenants/:tenantId/campaigns',
    loadComponent: () =>
      import('./tenants/tenant-dashboard/tenant-dashboard.component').then((m) => m.TenantDashboardComponent), // placeholder
  },
  {
    path: 'tenants/:tenantId/kiosks',
    loadComponent: () =>
      import('./tenants/tenant-dashboard/tenant-dashboard.component').then((m) => m.TenantDashboardComponent), // placeholder
  },
];
