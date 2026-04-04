import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CampaignService } from '../campaign.service';
import { Campaign } from '../campaign.model';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './campaign-list.component.html',
})
export class CampaignListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly campaignService = inject(CampaignService);
  private readonly fb = inject(FormBuilder);

  readonly campaigns = signal<Campaign[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly isSaving = signal(false);
  readonly togglingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private tenantId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    startsAt: [''],
    endsAt: [''],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.tenantId = params.get('tenantId')!;
        this.isLoading.set(true);
        return this.campaignService.getByTenant(this.tenantId);
      })
    ).subscribe({
      next: (campaigns) => {
        this.campaigns.set(campaigns);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
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

    const { name, description, startsAt, endsAt } = this.form.getRawValue();
    const body = {
      name,
      ...(description ? { description } : {}),
      ...(startsAt ? { startsAt } : {}),
      ...(endsAt ? { endsAt } : {}),
    };

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.campaignService.create(this.tenantId, body).subscribe({
      next: (campaign) => {
        this.campaigns.update((list) => [campaign, ...list]);
        this.isSaving.set(false);
        this.closeModal();
      },
      error: () => {
        this.errorMessage.set('No se pudo crear la campaña. Intenta de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  toggleActive(campaign: Campaign): void {
    if (this.togglingId()) return;
    this.togglingId.set(campaign.id);

    this.campaignService.update(campaign.id, { isActive: !campaign.isActive }).subscribe({
      next: (updated) => {
        this.campaigns.update((list) =>
          list.map((c) => (c.id === updated.id ? updated : c))
        );
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  goToActivities(campaign: Campaign): void {
    this.router.navigate([
      '/dashboard/tenants', this.tenantId, 'campaigns', campaign.id, 'activities'
    ]);
  }
}
