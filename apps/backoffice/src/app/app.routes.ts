import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
