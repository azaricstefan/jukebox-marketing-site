
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type Location } from '../schema';

export const getLocations = async (): Promise<Location[]> => {
  try {
    const results = await db.select()
      .from(locationsTable)
      .execute();

    return results.map(location => ({
      ...location,
      latitude: location.latitude !== null ? parseFloat(location.latitude.toString()) : null,
      longitude: location.longitude !== null ? parseFloat(location.longitude.toString()) : null
    }));
  } catch (error) {
    console.error('Failed to get locations:', error);
    throw error;
  }
};
