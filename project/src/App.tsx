import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MapView } from './components/Map';
import { BuildingList } from './components/BuildingList';
import { FavoritesList } from './components/FavoritesList';
import { Navigation } from './components/Navigation';
import { parseCsvData } from './utils/csvParser';
import { useBuildingStore } from './store/useBuildingStore';

function App() {
  const { setBuildings } = useBuildingStore();

  useEffect(() => {
    const loadData = async () => {
      const buildings = await parseCsvData('/data.csv');
      setBuildings(buildings);
    };
    loadData();
  }, [setBuildings]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/list" element={<BuildingList />} />
          <Route path="/favorites" element={<FavoritesList />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;