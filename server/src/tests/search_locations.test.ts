
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type SearchLocationsInput } from '../schema';
import { searchLocations } from '../handlers/search_locations';

// Test data
const testLocation1 = {
  name: 'Downtown Coffee Shop',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip_code: '10001',
  phone: '555-0123',
  email: 'info@downtown.com',
  website: 'https://downtown.com',
  business_type: 'coffee_shop',
  is_active: true,
  latitude: 40.7128,
  longitude: -74.0060
};

const testLocation2 = {
  name: 'Brooklyn Bakery',
  address: '456 Oak Ave',
  city: 'Brooklyn',
  state: 'NY',
  zip_code: '11201',
  phone: '555-0456',
  email: 'hello@bakery.com',
  website: 'https://bakery.com',
  business_type: 'bakery',
  is_active: true,
  latitude: 40.6892,
  longitude: -73.9442
};

const testLocation3 = {
  name: 'LA Restaurant',
  address: '789 Sunset Blvd',
  city: 'Los Angeles',
  state: 'CA',
  zip_code: '90028',
  phone: '555-0789',
  email: 'contact@restaurant.com',
  website: 'https://restaurant.com',
  business_type: 'restaurant',
  is_active: true,
  latitude: 34.0522,
  longitude: -118.2437
};

const inactiveLocation = {
  name: 'Closed Shop',
  address: '999 Old St',
  city: 'New York',
  state: 'NY',
  zip_code: '10001',
  phone: '555-9999',
  email: 'old@closed.com',
  website: 'https://closed.com',
  business_type: 'coffee_shop',
  is_active: false,
  latitude: 40.7000,
  longitude: -74.0000
};

describe('searchLocations', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all active locations with no filters', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3,
      inactiveLocation
    ]).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    // Should return only active locations
    expect(results).toHaveLength(3);
    expect(results.every(location => location.is_active)).toBe(true);
    expect(results.find(l => l.name === 'Closed Shop')).toBeUndefined();
  });

  it('should filter by city', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      city: 'New York',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual('Downtown Coffee Shop');
    expect(results[0].city).toEqual('New York');
  });

  it('should filter by state', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      state: 'NY',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(2);
    expect(results.every(location => location.state === 'NY')).toBe(true);
  });

  it('should filter by zip code', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      zip_code: '10001',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].zip_code).toEqual('10001');
    expect(results[0].name).toEqual('Downtown Coffee Shop');
  });

  it('should filter by business type', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      business_type: 'bakery',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].business_type).toEqual('bakery');
    expect(results[0].name).toEqual('Brooklyn Bakery');
  });

  it('should apply multiple filters', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      state: 'NY',
      business_type: 'bakery',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].name).toEqual('Brooklyn Bakery');
    expect(results[0].state).toEqual('NY');
    expect(results[0].business_type).toEqual('bakery');
  });

  it('should respect limit parameter', async () => {
    // Create test data
    await db.insert(locationsTable).values([
      testLocation1,
      testLocation2,
      testLocation3
    ]).execute();

    const input: SearchLocationsInput = { 
      limit: 2
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(2);
  });

  it('should convert numeric coordinates correctly', async () => {
    // Create test data
    await db.insert(locationsTable).values([testLocation1]).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(typeof results[0].latitude).toBe('number');
    expect(typeof results[0].longitude).toBe('number');
    expect(results[0].latitude).toEqual(40.7128);
    expect(results[0].longitude).toEqual(-74.0060);
  });

  it('should handle null coordinates', async () => {
    const locationWithoutCoords = {
      ...testLocation1,
      latitude: null,
      longitude: null
    };

    await db.insert(locationsTable).values([locationWithoutCoords]).execute();

    const input: SearchLocationsInput = { limit: 50 };
    const results = await searchLocations(input);

    expect(results).toHaveLength(1);
    expect(results[0].latitude).toBeNull();
    expect(results[0].longitude).toBeNull();
  });

  it('should return empty array when no matches found', async () => {
    // Create test data
    await db.insert(locationsTable).values([testLocation1]).execute();

    const input: SearchLocationsInput = { 
      city: 'NonexistentCity',
      limit: 50
    };
    const results = await searchLocations(input);

    expect(results).toHaveLength(0);
  });
});
