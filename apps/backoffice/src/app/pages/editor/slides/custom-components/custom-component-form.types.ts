import type { MediaType } from '../link-multi-media-input/link-multi-media-input.component';

export interface TextFieldConfig {
  widget: 'text';
  label: string;
  placeholder?: string;
}

export interface TextareaFieldConfig {
  widget: 'textarea';
  label: string;
  placeholder?: string;
}

export interface MediaInputFieldConfig {
  widget: 'media-input';
  label: string;
  mediaType: MediaType;
}

export type ScalarFieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | MediaInputFieldConfig;

export interface ArrayFieldConfig {
  widget: 'array';
  label: string;
  addLabel: string;
  item: Record<string, ScalarFieldConfig>;
}

export type FieldConfig = ScalarFieldConfig | ArrayFieldConfig;

export interface ComponentFormConfig {
  fields: Record<string, FieldConfig>;
}
