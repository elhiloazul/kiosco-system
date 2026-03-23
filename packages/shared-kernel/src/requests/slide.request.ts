import { z } from "zod";
import { SlideType } from "../domain/enums/slide-type.enum";

export const CreateSlideRequest = z.object({
  type: z.nativeEnum(SlideType),
  order: z.number().int().min(0).optional(),
  content: z.record(z.unknown()),
});

export const UpdateSlideRequest = CreateSlideRequest.partial();

export type CreateSlideRequest = z.infer<typeof CreateSlideRequest>;
export type UpdateSlideRequest = z.infer<typeof UpdateSlideRequest>;
