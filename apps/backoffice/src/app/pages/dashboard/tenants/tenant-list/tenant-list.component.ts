import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.model';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './tenant-list.component.html',
})
export class TenantListComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly fb = inject(FormBuilder);

  readonly tenants = signal<Tenant[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    logoUrl: [''],
  });

  ngOnInit(): void {
    this.loadTenants();
  }

  openModal(): void {
    this.form.reset();
    this.errorMessage.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving()) return;

    const { name, logoUrl } = this.form.getRawValue();
    const body = logoUrl ? { name, logoUrl } : { name };

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.tenantService.create(body).subscribe({
      next: (tenant) => {
        this.tenants.update((list) => [tenant, ...list]);
        this.isSaving.set(false);
        this.closeModal();
      },
      error: () => {
        this.errorMessage.set('No se pudo crear el tenant. Intenta de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  private loadTenants(): void {
    this.isLoading.set(true);
    this.tenantService.getAll().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
