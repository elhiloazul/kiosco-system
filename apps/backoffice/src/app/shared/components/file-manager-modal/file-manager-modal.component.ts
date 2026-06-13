import { Component, inject, input, output, signal, computed, OnInit } from '@angular/core';
import { MediaAssetService } from '../../../pages/dashboard/media/media-asset.service';
import { MediaAsset, MediaAssetType } from '../../../pages/dashboard/media/media-asset.model';
import { StorageService } from '../../../core/storage/storage.service';

const ACCEPTED_TYPES: Record<MediaAssetType, string> = {
  image: 'image/*',
  video: 'video/*',
  document: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  audio: 'audio/*',
};

const TYPE_LABELS: Record<MediaAssetType, string> = {
  image: 'Imágenes',
  video: 'Videos',
  document: 'Documentos',
  audio: 'Audio',
};

@Component({
  selector: 'app-file-manager-modal',
  standalone: true,
  templateUrl: './file-manager-modal.component.html',
})
export class FileManagerModalComponent implements OnInit {
  private readonly assetService = inject(MediaAssetService);
  private readonly storageService = inject(StorageService);

  readonly tenantId = input.required<string>();
  readonly filterType = input<MediaAssetType | undefined>(undefined);
  readonly urlSelected = output<string>();
  readonly closed = output<void>();

  readonly assets = signal<MediaAsset[]>([]);
  readonly isLoading = signal(true);
  readonly isUploading = signal(false);
  readonly uploadProgress = signal(0);
  readonly uploadError = signal<string | null>(null);
  readonly activeTab = signal<MediaAssetType>('image');
  readonly deletingId = signal<string | null>(null);

  readonly allTabs: MediaAssetType[] = ['image', 'video', 'audio', 'document'];
  readonly visibleTabs = computed(() =>
    this.filterType() ? [this.filterType()!] : this.allTabs
  );
  readonly typeLabels = TYPE_LABELS;

  readonly filteredAssets = computed(() =>
    this.assets().filter((a) => a.mimeType.startsWith(this.mimePrefix()))
  );

  private mimePrefix = computed(() => {
    const t = this.activeTab();
    if (t === 'image') return 'image/';
    if (t === 'video') return 'video/';
    if (t === 'audio') return 'audio/';
    return 'application/';
  });

  ngOnInit(): void {
    if (this.filterType()) {
      this.activeTab.set(this.filterType()!);
    }
    this.loadAssets();
  }

  private loadAssets(): void {
    this.isLoading.set(true);
    this.assetService.getAll(this.tenantId()).subscribe({
      next: (assets) => {
        this.assets.set(assets);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  selectAsset(asset: MediaAsset): void {
    this.urlSelected.emit(asset.url);
    this.closed.emit();
  }

  deleteAsset(event: Event, asset: MediaAsset): void {
    event.stopPropagation();
    if (this.deletingId()) return;
    this.deletingId.set(asset.id);
    this.assetService.delete(this.tenantId(), asset.id).subscribe({
      next: () => {
        this.assets.update((list) => list.filter((a) => a.id !== asset.id));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  close(): void {
    this.closed.emit();
  }

  setTab(tab: MediaAssetType): void {
    this.activeTab.set(tab);
  }

  triggerFileInput(): void {
    document.getElementById('file-manager-input')?.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      this.uploadError.set('El archivo supera el límite de 30 MB.');
      return;
    }

    this.isUploading.set(true);
    this.uploadError.set(null);
    this.uploadProgress.set(0);

    this.storageService.upload(this.tenantId(), file, (pct) => this.uploadProgress.set(pct))
      .subscribe({
        next: ({ asset }) => {
          this.assets.update((list) => [asset, ...list]);
          this.isUploading.set(false);
          this.uploadProgress.set(0);
          const type: MediaAssetType = file.type.startsWith('image/') ? 'image'
            : file.type.startsWith('video/') ? 'video'
            : file.type.startsWith('audio/') ? 'audio'
            : 'document';
          this.activeTab.set(type);
        },
        error: () => {
          this.uploadError.set('Error al subir el archivo. Intenta de nuevo.');
          this.isUploading.set(false);
        },
      });

    (event.target as HTMLInputElement).value = '';
  }

  readonly acceptedTypes = computed(() =>
    this.filterType() ? ACCEPTED_TYPES[this.filterType()!] : Object.values(ACCEPTED_TYPES).join(',')
  );

  formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

}
