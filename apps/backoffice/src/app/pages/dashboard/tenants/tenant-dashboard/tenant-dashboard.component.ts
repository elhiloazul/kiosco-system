import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.model';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tenant-dashboard.component.html',
})
export class TenantDashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);

  readonly tenant = signal<Tenant | null>(null);
  readonly tenantId = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => {
        this.tenantId.set(params.get('tenantId')!);
        return this.tenantService.findById(this.tenantId());
      }))
      .subscribe((t) => this.tenant.set(t));
  }
}
