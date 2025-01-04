import React, { useState, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl';
import { Building } from '../types/Building';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';
import { supabase } from '../supabaseClient'; // Supabaseクライアントをインポート
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapView: React.FC = () => {
  const { buildings, isFavorite, addFavorite } = useBuildingStore();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const handleMarkerClick = useCallback((building: Building) => {
    setSelectedBuilding(building);
  }, []);

  const handleAddToFavorites = async (building: Building) => {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      alert('ログインしてください');
      return;
    }
    console.log("hi");
    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      building_id: building.id, // 必要であればbuildingの識別子を指定
      name: building.name,
      latitude: building.latitude,
      longitude: building.longitude,
    });

    if (error) {
      console.error('お気に入りの登録に失敗しました:', error.message);
    } else {
      alert('お気に入りに登録しました');
      addFavorite(building); // 状態を更新する関数（ローカルに保持する場合）
    }
  };

  return (
    <div className="h-screen relative">
      <Map
        initialViewState={{
          latitude: 35.6762,
          longitude: 139.6503,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        {buildings.map((building) => {
          const isSelected = selectedBuilding === building;
          const isFav = isFavorite(building);

          return (
            <Marker
              key={`${building.name}-${building.latitude}-${building.longitude}`}
              latitude={building.latitude}
              longitude={building.longitude}
            >
              <button
                className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg ${
                  isFav ? 'border-red-500' : 'border-white'
                } ${isSelected ? 'scale-125' : isFav ? 'scale-110' : ''}`}
                onClick={() => handleMarkerClick(building)}
                style={{
                  transition: 'transform 0.2s ease',
                }}
              >
                <img
                  src={building.imageUrl}
                  alt={building.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </Marker>
          );
        })}
      </Map>

      {selectedBuilding && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <BuildingCard building={selectedBuilding} />
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setSelectedBuilding(null)}
            >
              ✕
            </button>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => handleAddToFavorites(selectedBuilding)}
            >
              お気に入りに追加
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
