import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TenantService } from '../tenants/tenant.service';
import { Tenant } from '../tenants/tenant.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);

  readonly tenants = signal<Tenant[]>([]);
  readonly activeTenant = signal<Tenant | null>(null);
  readonly showDropdown = signal(false);

  readonly otherTenants = computed(() =>
    this.tenants().filter((t) => t.id !== this.activeTenant()?.id)
  );

  ngOnInit(): void {
    this.tenantService.getAll().subscribe((tenants) => this.tenants.set(tenants));

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.syncActiveTenant());

    this.syncActiveTenant();
  }

  toggleDropdown(): void {
    this.showDropdown.update((v) => !v);
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  selectTenant(tenant: Tenant): void {
    this.activeTenant.set(tenant);
    this.showDropdown.set(false);
    this.router.navigate(['/dashboard/tenants', tenant.id]);
  }

  private syncActiveTenant(): void {
    const tenantId = this.extractTenantId();
    if (!tenantId) {
      this.activeTenant.set(null);
      return;
    }
    this.tenantService
      .findById(tenantId)
      .subscribe((tenant) => this.activeTenant.set(tenant));
  }

  private extractTenantId(): string | null {
    let snapshot = this.activatedRoute.snapshot;
    while (snapshot) {
      if (snapshot.params['tenantId']) return snapshot.params['tenantId'];
      if (!snapshot.firstChild) break;
      snapshot = snapshot.firstChild;
    }
    return null;
  }
}
