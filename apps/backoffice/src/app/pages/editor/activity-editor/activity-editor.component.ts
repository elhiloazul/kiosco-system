import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TenantService } from '../../dashboard/tenants/tenant.service';
import { CampaignService } from '../../dashboard/campaigns/campaign.service';
import { ActivityService } from '../../dashboard/activities/activity.service';
import { Tenant } from '../../dashboard/tenants/tenant.model';
import { Campaign } from '../../dashboard/campaigns/campaign.model';
import { Activity } from '../../dashboard/activities/activity.model';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

@Component({
  selector: 'app-activity-editor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './activity-editor.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class ActivityEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tenantService = inject(TenantService);
  private readonly campaignService = inject(CampaignService);
  private readonly activityService = inject(ActivityService);

  readonly tenant = signal<Tenant | null>(null);
  readonly campaign = signal<Campaign | null>(null);
  readonly activity = signal<Activity | null>(null);
  readonly saveStatus = signal<SaveStatus>('saved');
  readonly isLoadingContext = signal(true);

  private tenantId = '';
  private campaignId = '';
  private activityId = '';

  readonly campaignsUrl = computed(() =>
    `/dashboard/tenants/${this.tenantId}/campaigns`
  );
  readonly activitiesUrl = computed(() =>
    `/dashboard/tenants/${this.tenantId}/campaigns/${this.campaignId}/activities`
  );
  readonly editorBaseUrl = computed(() =>
    `/dashboard/tenants/${this.tenantId}/campaigns/${this.campaignId}/activities/${this.activityId}/editor`
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
    });
  }

  goBack(): void {
    this.router.navigateByUrl(this.activitiesUrl());
  }
}
