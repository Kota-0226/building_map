export interface Building {
  name: string;
  architect: string;
  year: number;
  description: string;
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface BuildingFilters {
  architects?: string[];
  districts?: string[];
  yearFrom?: number;
  yearTo?: number;
}