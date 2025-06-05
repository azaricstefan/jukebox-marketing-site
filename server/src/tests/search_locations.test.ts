
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type SearchLocationsInput } from '../schema';
import { searchLocations } from '../handlers/search_locations';

describe('searchLocations', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all active locations when no filters provided', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Tech Solutions LLC',
        address: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        phone: '555-0456',
        email: 'contact@techsolutions.com',
        website: 'https://techsolutions.com',
        business_type: 'technology',
        latitude: 41.8781,
        longitude: -87.6298
      },
      {
        name: 'Springfield Diner',
        address: '789 Elm St',
        city: 'Springfield',
        state: 'MO',
        zip_code: '65801',
        phone: '555-0789',
        email: 'hello@springfielddiner.com',
        website: null,
        business_type: 'restaurant',
        latitude: 37.2153,
        longitude: -93.2982
      }
    ]).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBeDefined();
    expect(results[0].is_active).toBe(true);
    expect(results[0].created_at).toBeInstanceOf(Date);
    expect(results[0].updated_at).toBeInstanceOf(Date);
  });

  it('should filter by city', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Tech Solutions LLC',
        address: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        phone: '555-0456',
        email: 'contact@techsolutions.com',
        website: 'https://techsolutions.com',
        business_type: 'technology',
        latitude: 41.8781,
        longitude: -87.6298
      }
    ]).execute();

    const input: SearchLocationsInput = { city: 'Springfield', limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Downtown Coffee Shop');
    expect(results[0].city).toBe('Springfield');
  });

  it('should filter by state', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Springfield Diner',
        address: '789 Elm St',
        city: 'Springfield',
        state: 'MO',
        zip_code: '65801',
        phone: '555-0789',
        email: 'hello@springfielddiner.com',
        website: null,
        business_type: 'restaurant',
        latitude: 37.2153,
        longitude: -93.2982
      }
    ]).execute();

    const input: SearchLocationsInput = { state: 'IL', limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].state).toBe('IL');
    expect(results[0].name).toBe('Downtown Coffee Shop');
  });

  it('should filter by business_type', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Tech Solutions LLC',
        address: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        phone: '555-0456',
        email: 'contact@techsolutions.com',
        website: 'https://techsolutions.com',
        business_type: 'technology',
        latitude: 41.8781,
        longitude: -87.6298
      }
    ]).execute();

    const input: SearchLocationsInput = { business_type: 'technology', limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].business_type).toBe('technology');
    expect(results[0].name).toBe('Tech Solutions LLC');
  });

  it('should apply multiple filters', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Springfield Diner',
        address: '789 Elm St',
        city: 'Springfield',
        state: 'MO',
        zip_code: '65801',
        phone: '555-0789',
        email: 'hello@springfielddiner.com',
        website: null,
        business_type: 'restaurant',
        latitude: 37.2153,
        longitude: -93.2982
      }
    ]).execute();

    const input: SearchLocationsInput = { 
      city: 'Springfield',
      business_type: 'restaurant',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(2);
    results.forEach(result => {
      expect(result.city).toBe('Springfield');
      expect(result.business_type).toBe('restaurant');
    });
  });

  it('should respect limit parameter', async () => {
    // Create multiple test locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Tech Solutions LLC',
        address: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        phone: '555-0456',
        email: 'contact@techsolutions.com',
        website: 'https://techsolutions.com',
        business_type: 'technology',
        latitude: 41.8781,
        longitude: -87.6298
      },
      {
        name: 'Springfield Diner',
        address: '789 Elm St',
        city: 'Springfield',
        state: 'MO',
        zip_code: '65801',
        phone: '555-0789',
        email: 'hello@springfielddiner.com',
        website: null,
        business_type: 'restaurant',
        latitude: 37.2153,
        longitude: -93.2982
      }
    ]).execute();

    const input: SearchLocationsInput = { limit: 2 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(2);
  });

  it('should exclude inactive locations', async () => {
    // Create active and inactive locations
    await db.insert(locationsTable).values([
      {
        name: 'Downtown Coffee Shop',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip_code: '62704',
        phone: '555-0123',
        email: 'info@downtown.com',
        website: 'https://downtown.com',
        business_type: 'restaurant',
        is_active: true,
        latitude: 39.7817,
        longitude: -89.6501
      },
      {
        name: 'Tech Solutions LLC',
        address: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        phone: '555-0456',
        email: 'contact@techsolutions.com',
        website: 'https://techsolutions.com',
        business_type: 'technology',
        is_active: false,
        latitude: 41.8781,
        longitude: -87.6298
      }
    ]).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].is_active).toBe(true);
    expect(results[0].name).toBe('Downtown Coffee Shop');
  });

  it('should convert coordinates to numbers', async () => {
    // Create location with coordinates
    await db.insert(locationsTable).values({
      name: 'Downtown Coffee Shop',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone: '555-0123',
      email: 'info@downtown.com',
      website: 'https://downtown.com',
      business_type: 'restaurant',
      latitude: 39.7817,
      longitude: -89.6501
    }).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(typeof results[0].latitude).toBe('number');
    expect(typeof results[0].longitude).toBe('number');
    expect(results[0].latitude).toBe(39.7817);
    expect(results[0].longitude).toBe(-89.6501);
  });

  it('should handle null coordinates', async () => {
    // Create location without coordinates
    await db.insert(locationsTable).values({
      name: 'Downtown Coffee Shop',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704',
      phone: '555-0123',
      email: 'info@downtown.com',
      website: 'https://downtown.com',
      business_type: 'restaurant',
      latitude: null,
      longitude: null
    }).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].latitude).toBeNull();
    expect(results[0].longitude).toBeNull();
  });
});
