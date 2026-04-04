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
      import('./campaigns/campaign-list/campaign-list.component').then((m) => m.CampaignListComponent),
  },
  {
    path: 'tenants/:tenantId/campaigns/:campaignId/activities',
    loadComponent: () =>
      import('./activities/activity-list/activity-list.component').then((m) => m.ActivityListComponent),
  },
  {
    path: 'tenants/:tenantId/campaigns/:campaignId/activities/:activityId/editor',
    loadComponent: () =>
      import('../../pages/editor/activity-editor/activity-editor.component').then((m) => m.ActivityEditorComponent),
  },
  {
    path: 'tenants/:tenantId/kiosks',
    loadComponent: () =>
      import('./kiosks/kiosk-list/kiosk-list.component').then((m) => m.KioskListComponent),
  },
];
