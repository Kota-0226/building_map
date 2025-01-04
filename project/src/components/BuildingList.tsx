import React, { useState, useMemo } from 'react';
import { Building, BuildingFilters } from '../types/Building';
import { BuildingCard } from './BuildingCard';
import { useBuildingStore } from '../store/useBuildingStore';

export const BuildingList: React.FC = () => {
  const { buildings } = useBuildingStore();
  const [filters, setFilters] = useState<BuildingFilters>({});
  const [isDistrictFilterVisible, setIsDistrictFilterVisible] = useState(false);
  const [isArchitectFilterVisible, setIsArchitectFilterVisible] = useState(false);

  const { architects, yearRange, districts } = useMemo(() => {
    const architectList = [...new Set(buildings.map(b => b.architect))].sort();
    const years = buildings.map(b => b.year).sort((a, b) => a - b);
    const districtList = [...new Set(
      buildings
        .map(b => b.address.match(/東京都(.+?区)/)?.[1])
        .filter((district): district is string => Boolean(district))
    )].sort();
    return {
      architects: architectList,
      yearRange: years.length
        ? { min: years[0], max: years[years.length - 1] }
        : { min: 1900, max: new Date().getFullYear() },
      districts: districtList
    };
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      if (filters.architects?.length && !filters.architects.includes(building.architect)) return false;
      if (filters.yearFrom && building.year < filters.yearFrom) return false;
      if (filters.yearTo && building.year > filters.yearTo) return false;

      const buildingDistrict = building.address.match(/東京都(.+?区)/)?.[1] || '';
      if (filters.districts?.length && !filters.districts.includes(buildingDistrict)) return false;

      return true;
    });
  }, [buildings, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">フィルター</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 建築家フィルター */}
          <div className="col-span-2">
            <button
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mt-2"
              onClick={() => setIsArchitectFilterVisible(!isArchitectFilterVisible)}
            >
              <span>建築家</span>
              <span
                className={`transform transition-transform ${
                  isArchitectFilterVisible ? 'rotate-90' : 'rotate-0'
                }`}
              >
                ▶
              </span>
            </button>

            {!isArchitectFilterVisible && (
              <div className="mt-2 flex flex-wrap gap-2">
                {(filters.architects?.length || 0) === 0 || (filters.architects?.length || 0) === architects.length ? (
                  <span className="bg-blue-400 text-white px-3 py-1 rounded-lg text-sm">
                    ALL
                  </span>
                ) : (
                  filters.architects?.map(architect => (
                    <span
                      key={architect}
                      className="bg-blue-400 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      {architect}
                    </span>
                  ))
                )}
              </div>
            )}

            {isArchitectFilterVisible && (
              <div className="mt-2">
                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm mr-2"
                  onClick={() => setFilters(prev => ({ ...prev, architects: [...architects] }))}
                >
                  すべて
                </button>
                <button
                  className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm"
                  onClick={() => setFilters(prev => ({ ...prev, architects: [] }))}
                >
                  すべてはずす
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {architects.map(architect => (
                    <div key={architect} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`architect-${architect}`}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={(filters.architects || []).includes(architect)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              architects: [...(prev.architects || []), architect]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              architects: (prev.architects || []).filter(a => a !== architect)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`architect-${architect}`} className="ml-2 text-sm text-gray-700">
                        {architect}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 建築年フィルター */}
          <div className="col-span-1">
            <div>
              <label className="block text-sm font-medium text-gray-700">建築年（から）</label>
              <input
                type="number"
                min={yearRange.min}
                max={yearRange.max}
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                onChange={(e) => setFilters({ ...filters, yearFrom: Number(e.target.value) || undefined })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">建築年（まで）</label>
              <input
                type="number"
                min={yearRange.min}
                max={yearRange.max}
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                onChange={(e) => setFilters({ ...filters, yearTo: Number(e.target.value) || undefined })}
              />
            </div>
          </div>
        </div>

        {/* 所在地（区）フィルター */}
        <div className="mt-8">
          <button
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700"
            onClick={() => setIsDistrictFilterVisible(!isDistrictFilterVisible)}
          >
            <span>所在地（区）</span>
            <span
              className={`transform transition-transform ${
                isDistrictFilterVisible ? 'rotate-90' : 'rotate-0'
              }`}
            >
              ▶
            </span>
          </button>

          {!isDistrictFilterVisible && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(filters.districts?.length || 0) === 0 || (filters.districts?.length || 0) === districts.length ? (
                <span className="bg-blue-400 text-white px-3 py-1 rounded-lg text-sm">
                  ALL
                </span>
              ) : (
                filters.districts?.map(district => (
                  <span
                    key={district}
                    className="bg-blue-400 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    {district}
                  </span>
                ))
              )}
            </div>
          )}

          {isDistrictFilterVisible && (
            <div className="mt-2">
              <button
                className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm mr-2"
                onClick={() => setFilters(prev => ({ ...prev, districts: [...districts] }))}
              >
                すべて
              </button>
              <button
                className="bg-gray-200 text-black px-3 py-1 rounded-lg text-sm"
                onClick={() => setFilters(prev => ({ ...prev, districts: [] }))}
              >
                すべてはずす
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {districts.map(district => (
                  <div key={district} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`district-${district}`}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={(filters.districts || []).includes(district)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            districts: [...(prev.districts || []), district]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            districts: (prev.districts || []).filter(d => d !== district)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`district-${district}`} className="ml-2 text-sm text-gray-700">
                      {district}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
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













// import React, { useState, useMemo } from 'react';
// import { Building, BuildingFilters } from '../types/Building';
// import { BuildingCard } from './BuildingCard';
// import { useBuildingStore } from '../store/useBuildingStore';

// export const BuildingList: React.FC = () => {
//   const { buildings } = useBuildingStore();
//   const [filters, setFilters] = useState<BuildingFilters>({});

//   const { architects, yearRange, districts } = useMemo(() => {
//     const architectList = [...new Set(buildings.map(b => b.architect))].sort();
//     const years = buildings.map(b => b.year).sort((a, b) => a - b);
//     const distirctList = [...new Set(
//       buildings
//         .map(b => b.address.match(/東京都(.+?区)/)?.[1]) // 東京都○○区を抽出
//         .filter(Boolean) // null を排除
//     )].sort();
//     return {
//       architects: architectList,
//       yearRange: years.length ? {
//         min: years[0],
//         max: years[years.length - 1]
//       } : { min: 1900, max: 2024 },
//       districts: distirctList // Fallback values
//     };
//   }, [buildings]);

//   const filteredBuildings = useMemo(() => {
//     return buildings.filter(building => {
//       if (filters.architect && building.architect !== filters.architect) return false;
//       if (filters.yearFrom && building.year < filters.yearFrom) return false;
//       if (filters.yearTo && building.year > filters.yearTo) return false;

//       const buildingDistrict = building.address.match(/東京都(.+?区)/)?.[1] || ''; // 安全にデフォルト値を設定
//       if (filters.districts?.length && !filters.districts.includes(buildingDistrict)) return false;
      
//       return true;
//     });
//   }, [buildings, filters]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-lg shadow-md p-4 mb-8">
//         <h2 className="text-xl font-semibold mb-4">フィルター</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">建築家</label>
//             <select
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               onChange={(e) => setFilters({ ...filters, architect: e.target.value || undefined })}
//             >
//               <option value="">すべて</option>
//               {architects.map(architect => (
//                 <option key={architect} value={architect}>{architect}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">建築年（から）</label>
//             <input
//               type="number"
//               min={yearRange.min}
//               max={yearRange.max}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               onChange={(e) => setFilters({ ...filters, yearFrom: Number(e.target.value) || undefined })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">建築年（まで）</label>
//             <input
//               type="number"
//               min={yearRange.min}
//               max={yearRange.max}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               onChange={(e) => setFilters({ ...filters, yearTo: Number(e.target.value) || undefined })}
//             />
//           </div>

//           <div className="col-span-3">
//             <label className="block text-sm font-medium text-gray-700">所在地（区）</label>
//             <div className="mt-2 space-y-1">
//               {districts.map(district: string) => (
//                 <div key={district} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`district-${district}`}
//                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
//                     checked={filters.districts?.includes(district)}
//                     onChange={(e) => {
//                       if (e.target.checked) {
//                         setFilters(prev => ({
//                           ...prev,
//                           districts: [...(prev.districts || []), district]
//                         }));
//                       } else {
//                         setFilters(prev => ({
//                           ...prev,
//                           districts: (prev.districts || []).filter(d => d !== district)
//                         }));
//                       }
//                     }}
//                   />
//                   <label htmlFor={`district-${district}`} className="ml-2 text-sm text-gray-700">
//                     {district}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredBuildings.map((building) => (
//           <BuildingCard key={building.name} building={building} />
//         ))}
//       </div>
//     </div>
//   );
// };