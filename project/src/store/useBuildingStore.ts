import { create } from 'zustand';
import { Building } from '../types/Building';

interface BuildingStore {
  buildings: Building[];
  favorites: Building[];
  setBuildings: (buildings: Building[]) => void;
  addFavorite: (building: Building) => void;
  removeFavorite: (building: Building) => void;
  isFavorite: (building: Building) => boolean;
}

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  buildings: [],
  favorites: [],
  setBuildings: (buildings) => set({ buildings }),
  addFavorite: (building) => {
    const favorites = [...get().favorites];
    if (!get().isFavorite(building)) {
      favorites.push(building);
      set({ favorites });
    }
  },
  removeFavorite: (building) => {
    const favorites = get().favorites.filter((b) => b.name !== building.name);
    set({ favorites });
  },
  isFavorite: (building) => 
    get().favorites.some((b) => b.name === building.name),
}));