
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
      latitude: location.latitude !== null ? location.latitude : null,
      longitude: location.longitude !== null ? location.longitude : null
    }));
  } catch (error) {
    console.error('Failed to get locations:', error);
    throw error;
  }
};
