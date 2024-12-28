import React from 'react';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';

export const FavoritesList: React.FC = () => {
  const { favorites } = useBuildingStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">お気に入りリスト</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">まだお気に入りに追加された建物はありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((building) => (
            <BuildingCard key={building.name} building={building} />
          ))}
        </div>
      )}
    </div>
  );
};