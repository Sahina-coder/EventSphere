export interface Resource {
  id: number;
  name: string;
  category: string;
  quantity_total: number;
  quantity_available: number;
}

export interface ResourceCreate {
  name: string;
  category: string;
  quantity_total: number;
  quantity_available: number;
}