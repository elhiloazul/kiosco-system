import { Slide } from './slide';

export interface ISlideRepository {
  save(slide: Slide): Promise<void>;
  findById(id: string): Promise<Slide | null>;
  findByActivityId(activityId: string): Promise<Slide[]>;
}

export const SLIDE_REPOSITORY = Symbol('ISlideRepository');
