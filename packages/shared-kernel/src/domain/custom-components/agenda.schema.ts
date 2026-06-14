import { z } from 'zod';

export const AgendaEventSchema = z.object({
  name:     z.string(),
  imageUrl: z.string(),
});

export const AgendaSchema = z.object({
  events: z.array(AgendaEventSchema),
});

export type AgendaEvent    = z.infer<typeof AgendaEventSchema>;
export type AgendaMetadata = z.infer<typeof AgendaSchema>;
