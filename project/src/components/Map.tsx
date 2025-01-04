import React, { useState, useCallback, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import { Building } from '../types/Building';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';
import { supabase } from '../supabaseClient';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapView: React.FC = () => {
  const { buildings, isFavorite, addFavorite, removeFavorite, setFavorites } = useBuildingStore();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // 初期化：ユーザーのお気に入りを取得
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) {
        console.error('ログインしてください');
        return;
      }

      const { data, error } = await supabase
        .from('BuildingMaps') // テーブル名を指定
        .select('*')
        .eq('user_id', user.id); // 条件: ユーザーIDで絞り込む

      if (error) {
        console.error('お気に入りの取得に失敗しました:', error.message);
        return;
      }

      // ローカル状態に反映
      setFavorites(data || []);
    };

    fetchFavorites();
  }, [setFavorites]);

  // お気に入りに追加または削除
  const toggleFavorite = async (building: Building) => {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      alert('ログインしてください');
      return;
    }
    // 現在の `is_favorite` 状態を取得
    // const isCurrentlyFavorite = isFavorite(building);

    if (isFavorite(building)) {
      // Supabaseから削除
      const { error } = await supabase
        .from('BuildingMaps')
        .delete()
        .eq('user_id', user.id)
        .eq('name', building.name); // 一意に識別できる条件

      if (error) {
        console.error('お気に入りの削除に失敗しました:', error.message);
      } else {
        removeFavorite(building); // ローカルの状態を更新
      }
    } else {
      // Supabaseに追加
      const { error } = await supabase.from('BuildingMaps').insert({
        user_id: user.id,
        name: building.name,
        architect: building.architect,
        year: building.year,
        image_url: building.imageUrl,
        address: building.address,
        latitude: building.latitude,
        longitude: building.longitude,
        description: building.description,
      });

      if (error) {
        console.error('お気に入りの登録に失敗しました:', error.message);
      } else {
        addFavorite(building); // ローカルの状態を更新
      }
    }
  };

  const handleMarkerClick = useCallback((building: Building) => {
    setSelectedBuilding(building);
  }, []);

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
            <BuildingCard
              building={selectedBuilding}
              showFavoriteButton={true}
              onFavorite={() => toggleFavorite(selectedBuilding)}
            />
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setSelectedBuilding(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
