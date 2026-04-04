import { Component, computed, effect, input, output, signal } from '@angular/core';

export type MediaType = 'video' | 'image' | 'document' | 'audio';
type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

const ICON_PATHS: Record<MediaType, string> = {
  video:    'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
  image:    'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  document: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  audio:    'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
};

@Component({
  selector: 'app-link-multi-media-input',
  standalone: true,
  templateUrl: './link-multi-media-input.component.html',
})
export class LinkMultiMediaInputComponent {
  readonly value = input('');
  readonly mediaType = input<MediaType>('image');
  readonly placeholder = input('Pega la URL del recurso...');
  readonly valueChange = output<string>();

  readonly inputValue = signal('');
  readonly validationState = signal<ValidationState>('idle');

  readonly iconPath = computed(() => ICON_PATHS[this.mediaType()]);

  readonly fileName = computed(() => {
    try {
      return new URL(this.inputValue()).pathname.split('/').pop() || 'documento';
    } catch {
      return 'documento';
    }
  });

  constructor() {
    effect(() => {
      const v = this.value();
      this.inputValue.set(v);
      this.validationState.set(v ? 'valid' : 'idle');
    }, { allowSignalWrites: true });
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.inputValue.set(val);
    this.valueChange.emit(val);
    this.validationState.set('idle');
  }

  validate(): void {
    const url = this.inputValue();
    if (!url) return;
    this.validationState.set('validating');
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => this.validationState.set('valid'))
      .catch(() => this.validationState.set('invalid'));
  }
}
