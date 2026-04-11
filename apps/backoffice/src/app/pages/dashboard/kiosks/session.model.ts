export interface ActivityProgress {
  lastSlideIndex: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserSession {
  id: string;
  kioskId: string;
  name: string;
  age: string;
  neighborhood: string;
  activities: Record<string, ActivityProgress>;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}
