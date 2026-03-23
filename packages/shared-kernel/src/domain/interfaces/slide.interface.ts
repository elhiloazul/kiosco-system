import { SlideType } from "../enums/slide-type.enum";

export interface ISlide {
  id: string;
  activityId: string;
  type: SlideType;
  order: number;
  content: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
