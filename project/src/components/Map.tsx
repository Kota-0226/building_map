import React, { useState, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl';
import { Building } from '../types/Building';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapView: React.FC = () => {
  const { buildings } = useBuildingStore();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const handleMarkerClick = useCallback((building: Building) => {
    setSelectedBuilding(building);
  }, []);

  return (
    <div className="h-screen relative">
      <Map
        initialViewState={{
          latitude: 35.6762,
          longitude: 139.6503,
          zoom: 12
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        {buildings.map((building) => (
          <Marker
            key={`${building.name}-${building.latitude}-${building.longitude}`}
            latitude={building.latitude}
            longitude={building.longitude}
          >
            <button
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg"
              onClick={() => handleMarkerClick(building)}
            >
              <img
                src={building.imageUrl}
                alt={building.name}
                className="w-full h-full object-cover"
              />
            </button>
          </Marker>
        ))}
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
          </div>
        </div>
      )}
    </div>
  );
};