export interface IActivity {
  id: string;
  campaignId: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
