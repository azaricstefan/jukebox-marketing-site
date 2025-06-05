
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { getLocations } from '../handlers/get_locations';

describe('getLocations', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no locations exist', async () => {
    const result = await getLocations();
    expect(result).toEqual([]);
  });

  it('should return all locations', async () => {
    // Create test locations
    await db.insert(locationsTable).values([
      {
        name: 'Test Location 1',
        address: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        phone: '555-0123',
        email: 'test1@example.com',
        website: 'https://test1.com',
        business_type: 'Restaurant',
        is_active: true,
        latitude: 40.7128,
        longitude: -74.0060
      },
      {
        name: 'Test Location 2',
        address: '456 Oak Ave',
        city: 'Another City',
        state: 'AC',
        zip_code: '67890',
        business_type: 'Retail',
        is_active: false,
        latitude: null,
        longitude: null
      }
    ]);

    const result = await getLocations();

    expect(result).toHaveLength(2);
    
    // Check first location
    const location1 = result.find(l => l.name === 'Test Location 1');
    expect(location1).toBeDefined();
    expect(location1!.name).toEqual('Test Location 1');
    expect(location1!.address).toEqual('123 Main St');
    expect(location1!.city).toEqual('Test City');
    expect(location1!.state).toEqual('TS');
    expect(location1!.zip_code).toEqual('12345');
    expect(location1!.phone).toEqual('555-0123');
    expect(location1!.email).toEqual('test1@example.com');
    expect(location1!.website).toEqual('https://test1.com');
    expect(location1!.business_type).toEqual('Restaurant');
    expect(location1!.is_active).toEqual(true);
    expect(location1!.latitude).toEqual(40.7128);
    expect(typeof location1!.latitude).toEqual('number');
    expect(location1!.longitude).toEqual(-74.0060);
    expect(typeof location1!.longitude).toEqual('number');
    expect(location1!.id).toBeDefined();
    expect(location1!.created_at).toBeInstanceOf(Date);
    expect(location1!.updated_at).toBeInstanceOf(Date);

    // Check second location
    const location2 = result.find(l => l.name === 'Test Location 2');
    expect(location2).toBeDefined();
    expect(location2!.name).toEqual('Test Location 2');
    expect(location2!.address).toEqual('456 Oak Ave');
    expect(location2!.city).toEqual('Another City');
    expect(location2!.state).toEqual('AC');
    expect(location2!.zip_code).toEqual('67890');
    expect(location2!.phone).toBeNull();
    expect(location2!.email).toBeNull();
    expect(location2!.website).toBeNull();
    expect(location2!.business_type).toEqual('Retail');
    expect(location2!.is_active).toEqual(false);
    expect(location2!.latitude).toBeNull();
    expect(location2!.longitude).toBeNull();
    expect(location2!.id).toBeDefined();
    expect(location2!.created_at).toBeInstanceOf(Date);
    expect(location2!.updated_at).toBeInstanceOf(Date);
  });

  it('should handle locations with mixed coordinate data', async () => {
    // Create locations with various coordinate scenarios
    await db.insert(locationsTable).values([
      {
        name: 'With Coordinates',
        address: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        business_type: 'Restaurant',
        latitude: 40.7128,
        longitude: -74.0060
      },
      {
        name: 'Without Coordinates',
        address: '456 Oak Ave',
        city: 'Another City',
        state: 'AC',
        zip_code: '67890',
        business_type: 'Retail',
        latitude: null,
        longitude: null
      },
      {
        name: 'Partial Coordinates',
        address: '789 Pine St',
        city: 'Third City',
        state: 'TC',
        zip_code: '11111',
        business_type: 'Office',
        latitude: 41.8781,
        longitude: null
      }
    ]);

    const result = await getLocations();

    expect(result).toHaveLength(3);

    const withCoords = result.find(l => l.name === 'With Coordinates');
    expect(withCoords!.latitude).toEqual(40.7128);
    expect(withCoords!.longitude).toEqual(-74.0060);
    expect(typeof withCoords!.latitude).toEqual('number');
    expect(typeof withCoords!.longitude).toEqual('number');

    const withoutCoords = result.find(l => l.name === 'Without Coordinates');
    expect(withoutCoords!.latitude).toBeNull();
    expect(withoutCoords!.longitude).toBeNull();

    const partialCoords = result.find(l => l.name === 'Partial Coordinates');
    expect(partialCoords!.latitude).toEqual(41.8781);
    expect(partialCoords!.longitude).toBeNull();
    expect(typeof partialCoords!.latitude).toEqual('number');
  });
});
