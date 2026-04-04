import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlideService } from '../slide.service';
import { Slide, SlideType, SLIDE_TYPE_LABELS } from '../slide.model';
import { LinkMultiMediaInputComponent } from '../link-multi-media-input/link-multi-media-input.component';

@Component({
  selector: 'app-slide-canvas',
  standalone: true,
  imports: [FormsModule, LinkMultiMediaInputComponent],
  templateUrl: './slide-canvas.component.html',
})
export class SlideCanvasComponent {
  private readonly slideService = inject(SlideService);

  readonly slide = input.required<Slide>();
  readonly saved = output<Slide>();

  readonly SlideType = SlideType;
  readonly SLIDE_TYPE_LABELS = SLIDE_TYPE_LABELS;

  // ── Ajustes generales ────────────────────────────────────────────────────────
  readonly backgroundImage = signal('');
  readonly audio = signal('');

  // ── Campos por tipo ──────────────────────────────────────────────────────────
  readonly imageUrl = signal('');
  readonly videoUrl = signal('');
  readonly documentUrl = signal('');
  readonly mediaText = signal('');       // text opcional en image / video / document
  readonly isButtonPause = signal(false);
  readonly text = signal('');            // tipo TEXT
  readonly component = signal('');       // tipo CUSTOM

  readonly hasChanges = signal(false);
  readonly isSaving = signal(false);

  constructor() {
    effect(() => this.syncFromSlide(this.slide()), { allowSignalWrites: true });
  }

  private syncFromSlide(s: Slide): void {
    const c = s.content;
    this.backgroundImage.set((c['backgroundImage'] as string) ?? '');
    this.audio.set((c['audio'] as string) ?? '');

    switch (s.type) {
      case SlideType.IMAGE:
        this.imageUrl.set((c['imageUrl'] as string) ?? '');
        this.mediaText.set((c['text'] as string) ?? '');
        this.isButtonPause.set((c['isButtonPause'] as boolean) ?? false);
        break;
      case SlideType.VIDEO:
        this.videoUrl.set((c['videoUrl'] as string) ?? '');
        this.mediaText.set((c['text'] as string) ?? '');
        break;
      case SlideType.DOCUMENT:
        this.documentUrl.set((c['documentUrl'] as string) ?? '');
        this.mediaText.set((c['text'] as string) ?? '');
        break;
      case SlideType.TEXT:
        this.text.set((c['text'] as string) ?? '');
        break;
      case SlideType.CUSTOM:
        this.component.set((c['component'] as string) ?? '');
        break;
    }

    this.hasChanges.set(false);
  }

  markChanged(): void {
    this.hasChanges.set(true);
  }

  reset(): void {
    this.syncFromSlide(this.slide());
  }

  private buildContent(): Record<string, unknown> {
    const base: Record<string, unknown> = {};
    const bg = this.backgroundImage();
    const aud = this.audio();
    if (bg) base['backgroundImage'] = bg;
    if (aud) base['audio'] = aud;

    switch (this.slide().type) {
      case SlideType.IMAGE:
        return { ...base, imageUrl: this.imageUrl(), text: this.mediaText(), isButtonPause: this.isButtonPause() };
      case SlideType.VIDEO:
        return { ...base, videoUrl: this.videoUrl(), text: this.mediaText() };
      case SlideType.DOCUMENT:
        return { ...base, documentUrl: this.documentUrl(), text: this.mediaText() };
      case SlideType.TEXT:
        return { ...base, text: this.text() };
      case SlideType.CUSTOM:
        return { ...base, component: this.component() };
      default:
        return base;
    }
  }

  save(): void {
    if (!this.hasChanges() || this.isSaving()) return;
    this.isSaving.set(true);
    this.slideService.update(this.slide().id, { content: this.buildContent() }).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.hasChanges.set(false);
        this.saved.emit(updated);
      },
      error: () => this.isSaving.set(false),
    });
  }

  slideTypeIconPath(type: SlideType): string {
    const icons: Record<SlideType, string> = {
      [SlideType.VIDEO]:    'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
      [SlideType.IMAGE]:    'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
      [SlideType.TEXT]:     'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      [SlideType.DOCUMENT]: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      [SlideType.CUSTOM]:   'M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
    };
    return icons[type];
  }
}
