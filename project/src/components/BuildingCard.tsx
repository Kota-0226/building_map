import React from 'react';
import { Building } from '../types/Building';
import { Heart, HeartOff } from 'lucide-react';
import { useBuildingStore } from '../store/useBuildingStore';

interface BuildingCardProps {
  building: Building;
  showFavoriteButton?: boolean;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  showFavoriteButton = true,
}) => {
  const { addFavorite, removeFavorite, isFavorite } = useBuildingStore();
  const favorite = isFavorite(building);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={building.imageUrl}
        alt={building.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{building.name}</h3>
          {showFavoriteButton && (
            <button
              onClick={() => favorite ? removeFavorite(building) : addFavorite(building)}
              className={`p-2 rounded-full ${
                favorite ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {favorite ? <Heart fill="currentColor" /> : <HeartOff />}
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-1">
          {building.architect} ({building.year})
        </p>
        <p className="text-gray-500 mt-2">{building.description}</p>
        <p className="text-gray-400 text-sm mt-2">{building.address}</p>
      </div>
    </div>
  );
};