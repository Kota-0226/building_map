import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MapView } from './components/Map';
import { BuildingList } from './components/BuildingList';
import { FavoritesList } from './components/FavoritesList';
import { Navigation } from './components/Navigation';
import { parseCsvData } from './utils/csvParser';
import { useBuildingStore } from './store/useBuildingStore';
import { Auth } from './components/Auth';
import { supabase } from './supabaseClient';

function App() {
  const { setBuildings } = useBuildingStore();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const loadData = async () => {
      const buildings = await parseCsvData('/data.csv');
      console.log(buildings);
      setBuildings(buildings);
    };
    loadData();
  }, [setBuildings]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {user ? (
            <>
              <Route path="/map" element={<MapView />} />
              <Route path="/list" element={<BuildingList />} />
              <Route path="/favorites" element={<FavoritesList />} />
            </>
          ) : (
            <Route path="*" element={<Auth />} />
          )}
        </Routes>
        {user && <Navigation />}
      </div>
    </BrowserRouter>
  );
}

export default App;
