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

  readonly showMenuModal = signal(false);
  readonly isSavingMenu = signal(false);
  readonly errorMenuMessage = signal<string | null>(null);
  private menuActivityId = '';

  private tenantId = '';
  private campaignId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  readonly menuForm = this.fb.nonNullable.group({
    menuOrder: [0, [Validators.required, Validators.min(0)]],
    audio: [''],
    popoverDescription: [''],
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
        this.activities.set(this.sortByMenuOrder(activities));
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
      'activities', activity.id, 'editor',
    ]);
  }

  toggleMenu(activity: Activity): void {
    if (this.togglingId()) return;

    if (!activity.showInMenu) {
      this.menuActivityId = activity.id;
      this.menuForm.reset({
        menuOrder: activity.menuOrder ?? 0,
        audio: activity.menuConfig?.audio ?? '',
        popoverDescription: activity.menuConfig?.popoverDescription ?? '',
      });
      this.errorMenuMessage.set(null);
      this.showMenuModal.set(true);
    } else {
      this.togglingId.set(activity.id);
      this.activityService.update(activity.id, { showInMenu: false }).subscribe({
        next: (updated) => {
          this.activities.update((list) => this.sortByMenuOrder(list.map((a) => (a.id === updated.id ? updated : a))));
          this.togglingId.set(null);
        },
        error: () => this.togglingId.set(null),
      });
    }
  }

  openMenuConfig(activity: Activity): void {
    this.menuActivityId = activity.id;
    this.menuForm.reset({
      menuOrder: activity.menuOrder ?? 0,
      audio: activity.menuConfig?.audio ?? '',
      popoverDescription: activity.menuConfig?.popoverDescription ?? '',
    });
    this.errorMenuMessage.set(null);
    this.showMenuModal.set(true);
  }

  closeMenuModal(): void {
    this.showMenuModal.set(false);
  }

  private sortByMenuOrder(list: Activity[]): Activity[] {
    return [...list].sort((a, b) => {
      if (a.menuOrder === null && b.menuOrder === null) return 0;
      if (a.menuOrder === null) return 1;
      if (b.menuOrder === null) return -1;
      return a.menuOrder - b.menuOrder;
    });
  }

  saveMenuConfig(): void {
    if (this.menuForm.invalid || this.isSavingMenu()) return;
    this.isSavingMenu.set(true);
    this.errorMenuMessage.set(null);

    const { menuOrder, audio, popoverDescription } = this.menuForm.getRawValue();

    this.activityService.update(this.menuActivityId, {
      showInMenu: true,
      menuOrder,
      menuConfig: { audio: audio || undefined, popoverDescription: popoverDescription || undefined },
    }).subscribe({
      next: (updated) => {
        this.activities.update((list) => this.sortByMenuOrder(list.map((a) => (a.id === updated.id ? updated : a))));
        this.isSavingMenu.set(false);
        this.showMenuModal.set(false);
      },
      error: () => {
        this.errorMenuMessage.set('No se pudo guardar la configuración.');
        this.isSavingMenu.set(false);
      },
    });
  }
}
