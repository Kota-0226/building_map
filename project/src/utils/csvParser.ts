import Papa from 'papaparse';
import { Building } from '../types/Building';

export const parseCsvData = async (filePath: string): Promise<Building[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const buildings = results.data
            .map((row: any) => ({
              name: row.name,
              architect: row.architect,
              year: parseInt(row.year),
              description: row.description,
              imageUrl: row.imageUrl,
              address: row.address,
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude),
            }))
            // 無効なデータを除外
            .filter((building: Building) => 
              building.name && 
              building.latitude && 
              !isNaN(building.latitude) && 
              building.longitude && 
              !isNaN(building.longitude)
            );
          resolve(buildings);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};