import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkMultiMediaInputComponent } from '../../link-multi-media-input/link-multi-media-input.component';
import { ComponentFormConfig, ArrayFieldConfig, ScalarFieldConfig } from '../custom-component-form.types';

@Component({
  selector: 'app-custom-metadata-form',
  standalone: true,
  imports: [FormsModule, LinkMultiMediaInputComponent],
  templateUrl: './custom-metadata-form.component.html',
})
export class CustomMetadataFormComponent {
  readonly config      = input.required<ComponentFormConfig>();
  readonly value       = input<Record<string, unknown>>({});
  readonly tenantId    = input('');
  readonly valueChange = output<Record<string, unknown>>();

  // Internal state: one signal per field (simplified — array fields stored as arrays of Record)
  readonly internalState = signal<Record<string, unknown>>({});

  readonly arrayFields = computed(() =>
    Object.entries(this.config().fields)
      .filter(([, f]) => f.widget === 'array')
      .map(([key, f]) => ({ key, config: f as ArrayFieldConfig }))
  );

  readonly scalarFields = computed(() =>
    Object.entries(this.config().fields)
      .filter(([, f]) => f.widget !== 'array')
      .map(([key, f]) => ({ key, config: f as ScalarFieldConfig }))
  );

  constructor() {
    effect(() => {
      this.internalState.set(structuredClone(this.value() ?? {}));
    }, { allowSignalWrites: true });
  }

  // ── Array helpers ─────────────────────────────────────────────────────────────

  getArrayItems(key: string): Record<string, string>[] {
    const arr = this.internalState()[key];
    return Array.isArray(arr) ? (arr as Record<string, string>[]) : [];
  }

  addArrayItem(key: string, itemSchema: Record<string, ScalarFieldConfig>): void {
    const empty: Record<string, string> = {};
    Object.keys(itemSchema).forEach(k => empty[k] = '');
    const current = this.getArrayItems(key);
    this.patch(key, [...current, empty]);
  }

  removeArrayItem(key: string, index: number): void {
    const current = [...this.getArrayItems(key)];
    current.splice(index, 1);
    this.patch(key, current);
  }

  updateArrayItemField(key: string, index: number, field: string, val: string): void {
    const current = this.getArrayItems(key).map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    );
    this.patch(key, current);
  }

  // ── Scalar helpers ────────────────────────────────────────────────────────────

  getScalarValue(key: string): string {
    return (this.internalState()[key] as string) ?? '';
  }

  updateScalar(key: string, val: string): void {
    this.patch(key, val);
  }

  private patch(key: string, val: unknown): void {
    const next = { ...this.internalState(), [key]: val };
    this.internalState.set(next);
    this.valueChange.emit(next);
  }

  isMediaInput(f: ScalarFieldConfig): boolean {
    return f.widget === 'media-input';
  }

  isTextarea(f: ScalarFieldConfig): boolean {
    return f.widget === 'textarea';
  }

  objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
  }
}
