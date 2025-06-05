
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
        name: 'Downtown Store',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        phone: '555-0101',
        email: 'downtown@test.com',
        website: 'https://downtown.test.com',
        business_type: 'retail'
      },
      {
        name: 'Uptown Branch',
        address: '456 Broadway',
        city: 'New York',
        state: 'NY',
        zip_code: '10002',
        phone: null,
        email: null,
        website: null,
        business_type: 'office'
      }
    ]).execute();

    const result = await getLocations();

    expect(result).toHaveLength(2);
    
    // Check first location
    const downtown = result.find(l => l.name === 'Downtown Store');
    expect(downtown).toBeDefined();
    expect(downtown!.address).toEqual('123 Main St');
    expect(downtown!.city).toEqual('New York');
    expect(downtown!.state).toEqual('NY');
    expect(downtown!.zip_code).toEqual('10001');
    expect(downtown!.phone).toEqual('555-0101');
    expect(downtown!.email).toEqual('downtown@test.com');
    expect(downtown!.website).toEqual('https://downtown.test.com');
    expect(downtown!.business_type).toEqual('retail');
    expect(downtown!.is_active).toBe(true);
    expect(downtown!.latitude).toBeNull();
    expect(downtown!.longitude).toBeNull();
    expect(downtown!.id).toBeDefined();
    expect(downtown!.created_at).toBeInstanceOf(Date);
    expect(downtown!.updated_at).toBeInstanceOf(Date);

    // Check second location with null values
    const uptown = result.find(l => l.name === 'Uptown Branch');
    expect(uptown).toBeDefined();
    expect(uptown!.phone).toBeNull();
    expect(uptown!.email).toBeNull();
    expect(uptown!.website).toBeNull();
    expect(uptown!.business_type).toEqual('office');
  });

  it('should handle locations with coordinates', async () => {
    // Create location with coordinates
    await db.insert(locationsTable).values({
      name: 'GPS Store',
      address: '789 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      business_type: 'retail',
      latitude: 34.0522,
      longitude: -118.2437
    }).execute();

    const result = await getLocations();
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('GPS Store');
    expect(result[0].latitude).toEqual(34.0522);
    expect(result[0].longitude).toEqual(-118.2437);
  });

  it('should include inactive locations', async () => {
    // Create active and inactive locations
    await db.insert(locationsTable).values([
      {
        name: 'Active Store',
        address: '100 First St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02101',
        business_type: 'retail',
        is_active: true
      },
      {
        name: 'Inactive Store',
        address: '200 Second St',
        city: 'Boston',
        state: 'MA',
        zip_code: '02102',
        business_type: 'retail',
        is_active: false
      }
    ]).execute();

    const result = await getLocations();

    expect(result).toHaveLength(2);
    expect(result.find(l => l.name === 'Active Store')!.is_active).toBe(true);
    expect(result.find(l => l.name === 'Inactive Store')!.is_active).toBe(false);
  });
});
