export interface ITenant {
  id: string;
  name: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
