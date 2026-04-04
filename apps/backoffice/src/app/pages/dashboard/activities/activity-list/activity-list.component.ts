import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity.model';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-list.component.html',
})
export class ActivityListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly activityService = inject(ActivityService);
  private readonly fb = inject(FormBuilder);

  readonly activities = signal<Activity[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly isSaving = signal(false);
  readonly togglingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private tenantId = '';
  private campaignId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.tenantId = params.get('tenantId')!;
        this.campaignId = params.get('campaignId')!;
        this.isLoading.set(true);
        return this.activityService.getByCampaign(this.campaignId);
      })
    ).subscribe({
      next: (activities) => {
        this.activities.set(activities);
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

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.activityService.create(this.campaignId, this.form.getRawValue()).subscribe({
      next: (activity) => {
        this.activities.update((list) => [...list, activity]);
        this.isSaving.set(false);
        this.closeModal();
      },
      error: () => {
        this.errorMessage.set('No se pudo crear la actividad. Intenta de nuevo.');
        this.isSaving.set(false);
      },
    });
  }

  toggleActive(activity: Activity): void {
    if (this.togglingId()) return;
    this.togglingId.set(activity.id);

    this.activityService.update(activity.id, { isActive: !activity.isActive }).subscribe({
      next: (updated) => {
        this.activities.update((list) =>
          list.map((a) => (a.id === updated.id ? updated : a))
        );
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  goToEditor(activity: Activity): void {
    this.router.navigate([
      '/dashboard/tenants', this.tenantId,
      'campaigns', this.campaignId,
      'activities', activity.id,
    ]);
  }
}
