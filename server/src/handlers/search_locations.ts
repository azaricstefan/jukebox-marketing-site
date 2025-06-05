
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type SearchLocationsInput, type Location } from '../schema';
import { eq, and, SQL } from 'drizzle-orm';

export const searchLocations = async (input: SearchLocationsInput): Promise<Location[]> => {
  try {
    // Build conditions array
    const conditions: SQL<unknown>[] = [];

    // Always filter for active locations
    conditions.push(eq(locationsTable.is_active, true));

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

    // Execute query with all conditions at once
    const results = await db.select()
      .from(locationsTable)
      .where(and(...conditions))
      .limit(input.limit)
      .execute();

    // Convert numeric fields back to numbers
    return results.map(location => ({
      ...location,
      latitude: location.latitude ? parseFloat(location.latitude.toString()) : null,
      longitude: location.longitude ? parseFloat(location.longitude.toString()) : null
    }));
  } catch (error) {
    console.error('Location search failed:', error);
    throw error;
  }
};
