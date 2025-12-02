import type { Menu } from "./menu";

export type Order = {
  id?: string;
  _id?: string;
  name?: string;
  table?: string;
  notes?: string;
  guests?: number;
  elements?: Menu[];
  createdAt?: string;
  sended?: boolean;
  active?: boolean;
};

export type CreationData = {
  name: string;
  table: string;
  notes?: string;
  guests: number;
};
