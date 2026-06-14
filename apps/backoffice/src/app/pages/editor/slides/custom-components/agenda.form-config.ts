import { ComponentFormConfig } from './custom-component-form.types';

export const AgendaFormConfig: ComponentFormConfig = {
  fields: {
    events: {
      widget: 'array',
      label: 'Eventos de la agenda',
      addLabel: 'Añadir evento',
      item: {
        name:     { widget: 'text',        label: 'Nombre del evento',  placeholder: 'Ej: Apertura de puertas' },
        imageUrl: { widget: 'media-input', label: 'Imagen del evento',  mediaType: 'image' },
      },
    },
  },
};
