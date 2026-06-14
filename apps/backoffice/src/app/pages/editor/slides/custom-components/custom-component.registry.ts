import { ComponentFormConfig } from './custom-component-form.types';
import { AgendaFormConfig } from './agenda.form-config';

export const COMPONENT_REGISTRY: Record<string, ComponentFormConfig> = {
  'SlideAgendaComponent': AgendaFormConfig,
};
