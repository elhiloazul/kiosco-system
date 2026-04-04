import { Component, inject, signal, computed, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TenantService } from '../../dashboard/tenants/tenant.service';
import { CampaignService } from '../../dashboard/campaigns/campaign.service';
import { ActivityService } from '../../dashboard/activities/activity.service';
import { SlideService } from '../slides/slide.service';
import { Tenant } from '../../dashboard/tenants/tenant.model';
import { Campaign } from '../../dashboard/campaigns/campaign.model';
import { Activity } from '../../dashboard/activities/activity.model';
import { Slide, SlideType, SLIDE_TYPE_LABELS } from '../slides/slide.model';
import { SlideCanvasComponent } from '../slides/slide-canvas/slide-canvas.component';

@Component({
  selector: 'app-activity-editor',
  standalone: true,
  imports: [RouterLink, FormsModule, SlideCanvasComponent],
  templateUrl: './activity-editor.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class ActivityEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tenantService = inject(TenantService);
  private readonly campaignService = inject(CampaignService);
  private readonly activityService = inject(ActivityService);
  private readonly slideService = inject(SlideService);
  private readonly canvas = viewChild(SlideCanvasComponent);

  readonly tenant = signal<Tenant | null>(null);
  readonly campaign = signal<Campaign | null>(null);
  readonly activity = signal<Activity | null>(null);
  readonly slides = signal<Slide[]>([]);
  readonly activeSlide = signal<Slide | null>(null);
  readonly isLoadingContext = signal(true);
  readonly isLoadingSlides = signal(false);

  // Create slide form state
  readonly showCreateForm = signal(false);
  readonly newSlideName = signal('');
  readonly newSlideType = signal<SlideType>(SlideType.IMAGE);
  readonly isCreating = signal(false);
  readonly deletingId = signal<string | null>(null);

  readonly SlideType = SlideType;
  readonly SLIDE_TYPE_LABELS = SLIDE_TYPE_LABELS;
  readonly slideTypes = Object.values(SlideType);

  private tenantId = '';
  private campaignId = '';
  private activityId = '';

  readonly campaignsUrl = computed(() =>
    `/dashboard/tenants/${this.tenantId}/campaigns`
  );
  readonly activitiesUrl = computed(() =>
    `/dashboard/tenants/${this.tenantId}/campaigns/${this.campaignId}/activities`
  );

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    this.tenantId = params.get('tenantId')!;
    this.campaignId = params.get('campaignId')!;
    this.activityId = params.get('activityId')!;

    forkJoin({
      tenant: this.tenantService.findById(this.tenantId),
      campaign: this.campaignService.findById(this.campaignId, this.tenantId),
      activity: this.activityService.findById(this.activityId, this.campaignId),
    }).subscribe(({ tenant, campaign, activity }) => {
      this.tenant.set(tenant);
      this.campaign.set(campaign);
      this.activity.set(activity);
      this.isLoadingContext.set(false);
      this.loadSlides();
    });
  }

  private loadSlides(): void {
    this.isLoadingSlides.set(true);
    this.slideService.getByActivity(this.activityId).subscribe({
      next: (slides) => {
        this.slides.set(slides);
        this.isLoadingSlides.set(false);
      },
      error: () => this.isLoadingSlides.set(false),
    });
  }

  selectSlide(slide: Slide): void {
    if (this.canvas()?.hasChanges()) {
      const confirmed = window.confirm('Tienes cambios sin guardar. ¿Deseas descartarlos y cambiar de slide?');
      if (!confirmed) return;
    }
    this.activeSlide.set(slide);
    this.showCreateForm.set(false);
  }

  openCreateForm(): void {
    this.showCreateForm.set(true);
    this.activeSlide.set(null);
    this.newSlideName.set('');
    this.newSlideType.set(SlideType.IMAGE);
  }

  cancelCreate(): void {
    this.showCreateForm.set(false);
    this.newSlideName.set('');
  }

  createSlide(): void {
    const name = this.newSlideName().trim();
    if (!name) return;

    const type = this.newSlideType();
    this.isCreating.set(true);

    this.slideService.create(this.activityId, { name, type }).subscribe({
      next: (slide) => {
        this.slides.update(list => [...list, slide]);
        this.activeSlide.set(slide);
        this.showCreateForm.set(false);
        this.newSlideName.set('');
        this.isCreating.set(false);
      },
      error: () => this.isCreating.set(false),
    });
  }

  deleteSlide(slide: Slide): void {
    if (!window.confirm(`¿Eliminar el slide "${slide.name}"? Esta acción no se puede deshacer.`)) return;
    this.deletingId.set(slide.id);
    this.slideService.delete(slide.id).subscribe({
      next: () => {
        this.slides.update(list => list.filter(s => s.id !== slide.id));
        if (this.activeSlide()?.id === slide.id) this.activeSlide.set(null);
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  onSlideSaved(updated: Slide): void {
    this.slides.update(list => list.map(s => s.id === updated.id ? updated : s));
    this.activeSlide.set(updated);
  }

  goBack(): void {
    this.router.navigateByUrl(this.activitiesUrl());
  }

  slideTypeIcon(type: SlideType): string {
    const icons: Record<SlideType, string> = {
      [SlideType.VIDEO]: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />`,
      [SlideType.IMAGE]: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />`,
      [SlideType.TEXT]: `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />`,
      [SlideType.DOCUMENT]: `<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />`,
      [SlideType.CUSTOM]: `<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />`,
    };
    return icons[type];
  }
}
