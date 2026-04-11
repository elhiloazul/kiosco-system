import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { SessionService } from '../session.service';
import { UserSession } from '../session.model';

@Component({
  selector: 'app-kiosk-sessions',
  standalone: true,
  imports: [RouterLink, KeyValuePipe],
  templateUrl: './kiosk-sessions.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class KioskSessionsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);

  readonly sessions = signal<UserSession[]>([]);
  readonly isLoading = signal(true);
  readonly expandedId = signal<string | null>(null);

  private kioskId = '';
  private tenantId = '';

  ngOnInit(): void {
    this.kioskId = this.route.snapshot.paramMap.get('kioskId')!;
    this.tenantId = this.route.snapshot.paramMap.get('tenantId')!;

    this.sessionService.getByKiosk(this.kioskId).subscribe({
      next: (sessions) => {
        this.sessions.set(sessions);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  activitiesCount(session: UserSession): number {
    return Object.keys(session.activities).length;
  }

  completedCount(session: UserSession): number {
    return Object.values(session.activities).filter((a) => a.completed).length;
  }

  formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  duration(session: UserSession): string {
    if (!session.endedAt) return '—';
    const ms = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }

  backUrl(): string {
    return `/dashboard/tenants/${this.tenantId}/kiosks`;
  }
}
