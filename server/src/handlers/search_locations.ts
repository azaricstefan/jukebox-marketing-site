
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type SearchLocationsInput, type Location } from '../schema';
import { eq, and, SQL } from 'drizzle-orm';

export const searchLocations = async (input: SearchLocationsInput): Promise<Location[]> => {
  try {
    // Build conditions array
    const conditions: SQL<unknown>[] = [];

    // Add filters based on input
    if (input.city) {
      conditions.push(eq(locationsTable.city, input.city));
    }

    if (input.state) {
      conditions.push(eq(locationsTable.state, input.state));
    }

    if (input.zip_code) {
      conditions.push(eq(locationsTable.zip_code, input.zip_code));
    }

    if (input.business_type) {
      conditions.push(eq(locationsTable.business_type, input.business_type));
    }

    // Only include active locations
    conditions.push(eq(locationsTable.is_active, true));

    // Execute query with conditions
    const results = conditions.length === 1
      ? await db.select()
          .from(locationsTable)
          .where(conditions[0])
          .limit(input.limit)
          .execute()
      : await db.select()
          .from(locationsTable)
          .where(and(...conditions))
          .limit(input.limit)
          .execute();

    return results.map(location => ({
      ...location,
      // Convert real columns (latitude/longitude) to numbers if they exist
      latitude: location.latitude !== null ? Number(location.latitude) : null,
      longitude: location.longitude !== null ? Number(location.longitude) : null
    }));
  } catch (error) {
    console.error('Search locations failed:', error);
    throw error;
  }
};
