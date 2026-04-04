import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { KioskService } from '../kiosk.service';
import { CampaignService } from '../../campaigns/campaign.service';
import { Kiosk } from '../kiosk.model';
import { Campaign } from '../../campaigns/campaign.model';

@Component({
  selector: 'app-kiosk-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './kiosk-list.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class KioskListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly kioskService = inject(KioskService);
  private readonly campaignService = inject(CampaignService);
  private readonly fb = inject(FormBuilder);

  readonly kiosks = signal<Kiosk[]>([]);
  readonly campaigns = signal<Campaign[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly isSaving = signal(false);
  readonly togglingId = signal<string | null>(null);
  readonly assigningId = signal<string | null>(null);
  readonly copiedId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private tenantId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    location: [''],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.tenantId = params.get('tenantId')!;
        this.isLoading.set(true);
        this.campaignService.getByTenant(this.tenantId).subscribe({
          next: (campaigns) => this.campaigns.set(campaigns.filter(c => c.isActive)),
        });
        return this.kioskService.getByTenant(this.tenantId);
      })
    ).subscribe({
      next: (kiosks) => {
        this.kiosks.set(kiosks);
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
    const { name, location } = this.form.getRawValue();
    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.kioskService.create(this.tenantId, {
      name,
      ...(location ? { location } : {}),
    }).subscribe({
      next: (kiosk) => {
        this.kiosks.update(list => [kiosk, ...list]);
        this.isSaving.set(false);
        this.closeModal();
      },
      error: () => {
        this.errorMessage.set('No se pudo registrar el kiosco. Intenta de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  toggleActive(kiosk: Kiosk): void {
    if (this.togglingId()) return;
    this.togglingId.set(kiosk.id);
    this.kioskService.update(kiosk.id, { isActive: !kiosk.isActive }).subscribe({
      next: (updated) => {
        this.kiosks.update(list => list.map(k => k.id === updated.id ? updated : k));
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  assignCampaign(kiosk: Kiosk, campaignId: string): void {
    this.assigningId.set(kiosk.id);
    const value = campaignId === '' ? null : campaignId;
    this.kioskService.update(kiosk.id, { campaignId: value }).subscribe({
      next: (updated) => {
        this.kiosks.update(list => list.map(k => k.id === updated.id ? updated : k));
        this.assigningId.set(null);
      },
      error: () => this.assigningId.set(null),
    });
  }

  campaignName(campaignId: string | null): string {
    if (!campaignId) return '—';
    return this.campaigns().find(c => c.id === campaignId)?.name ?? '—';
  }

  copyApiKey(kiosk: Kiosk): void {
    navigator.clipboard.writeText(kiosk.apiKey).then(() => {
      this.copiedId.set(kiosk.id);
      setTimeout(() => this.copiedId.set(null), 2000);
    });
  }

  formatLastSeen(lastSeenAt: string | null): string {
    if (!lastSeenAt) return 'Nunca';
    return new Date(lastSeenAt).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
}
