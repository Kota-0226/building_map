import React from 'react';
import { Building } from '../types/Building';
import { Heart, HeartOff } from 'lucide-react';
import { useBuildingStore } from '../store/useBuildingStore';

interface BuildingCardProps {
  building: Building;
  showFavoriteButton?: boolean;
  onFavorite?: () => void; // 新しいプロップ
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  showFavoriteButton = true,
  onFavorite,
}) => {
  const { isFavorite } = useBuildingStore();
  const favorite = isFavorite(building);

  return (
    <div
      className="bg-white rounded-lg shadow-md flex overflow-hidden"
      style={{ maxHeight: '45vh' }}
    >
      {/* Image Section */}
      <div className="w-1/3 h-full overflow-y-auto">
        <img
          src={building.imageUrl}
          alt={building.name}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="w-2/3 p-4 relative overflow-y-auto">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{building.name}</h3>
          {showFavoriteButton && onFavorite && ( // onFavoriteが定義されている場合のみボタンを表示
            <button
              onClick={onFavorite} // 渡された関数を呼び出す
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