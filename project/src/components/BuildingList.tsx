import React, { useState, useMemo } from 'react';
import { Building, BuildingFilters } from '../types/Building';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';

export const BuildingList: React.FC = () => {
  const { buildings } = useBuildingStore();
  const [filters, setFilters] = useState<BuildingFilters>({});

  const { architects, yearRange } = useMemo(() => {
    const architectList = [...new Set(buildings.map(b => b.architect))].sort();
    const years = buildings.map(b => b.year).sort((a, b) => a - b);
    return {
      architects: architectList,
      yearRange: years.length ? {
        min: years[0],
        max: years[years.length - 1]
      } : { min: 1900, max: 2024 } // Fallback values
    };
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      if (filters.architect && building.architect !== filters.architect) return false;
      if (filters.yearFrom && building.year < filters.yearFrom) return false;
      if (filters.yearTo && building.year > filters.yearTo) return false;
      return true;
    });
  }, [buildings, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">フィルター</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">建築家</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => setFilters({ ...filters, architect: e.target.value || undefined })}
            >
              <option value="">すべて</option>
              {architects.map(architect => (
                <option key={architect} value={architect}>{architect}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">建築年（から）</label>
            <input
              type="number"
              min={yearRange.min}
              max={yearRange.max}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => setFilters({ ...filters, yearFrom: Number(e.target.value) || undefined })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">建築年（まで）</label>
            <input
              type="number"
              min={yearRange.min}
              max={yearRange.max}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              onChange={(e) => setFilters({ ...filters, yearTo: Number(e.target.value) || undefined })}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuildings.map((building) => (
          <BuildingCard key={building.name} building={building} />
        ))}
      </div>
    </div>
  );
};