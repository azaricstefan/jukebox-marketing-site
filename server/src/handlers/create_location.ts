
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type CreateLocationInput, type Location } from '../schema';

export const createLocation = async (input: CreateLocationInput): Promise<Location> => {
  try {
    // Insert location record
    const result = await db.insert(locationsTable)
      .values({
        name: input.name,
        address: input.address,
        city: input.city,
        state: input.state,
        zip_code: input.zip_code,
        phone: input.phone,
        email: input.email,
        website: input.website,
        business_type: input.business_type,
        latitude: input.latitude,
        longitude: input.longitude
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Location creation failed:', error);
    throw error;
  }
};
