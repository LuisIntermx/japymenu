export type Menu = {
  _id: string;
  category: string;
  name: string;
  description: string;
  quantity: string;
  price: number;
  type: string;
  notes?: string;
  recentlyAdded?: boolean;
};
