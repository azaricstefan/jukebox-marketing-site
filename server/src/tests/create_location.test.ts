
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { locationsTable } from '../db/schema';
import { type CreateLocationInput } from '../schema';
import { createLocation } from '../handlers/create_location';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateLocationInput = {
  name: 'Test Restaurant',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zip_code: '94102',
  phone: '(555) 123-4567',
  email: 'test@restaurant.com',
  website: 'https://testrestaurant.com',
  business_type: 'restaurant',
  latitude: 37.7749,
  longitude: -122.4194
};

describe('createLocation', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a location with all fields', async () => {
    const result = await createLocation(testInput);

    // Basic field validation
    expect(result.name).toEqual('Test Restaurant');
    expect(result.address).toEqual('123 Main St');
    expect(result.city).toEqual('San Francisco');
    expect(result.state).toEqual('CA');
    expect(result.zip_code).toEqual('94102');
    expect(result.phone).toEqual('(555) 123-4567');
    expect(result.email).toEqual('test@restaurant.com');
    expect(result.website).toEqual('https://testrestaurant.com');
    expect(result.business_type).toEqual('restaurant');
    expect(result.latitude).toEqual(37.7749);
    expect(result.longitude).toEqual(-122.4194);
    expect(result.is_active).toBe(true); // Default value
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a location with nullable fields as null', async () => {
    const minimalInput: CreateLocationInput = {
      name: 'Minimal Location',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      phone: null,
      email: null,
      website: null,
      business_type: 'retail',
      latitude: null,
      longitude: null
    };

    const result = await createLocation(minimalInput);

    expect(result.name).toEqual('Minimal Location');
    expect(result.phone).toBeNull();
    expect(result.email).toBeNull();
    expect(result.website).toBeNull();
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.is_active).toBe(true);
  });

  it('should save location to database', async () => {
    const result = await createLocation(testInput);

    // Query using proper drizzle syntax
    const locations = await db.select()
      .from(locationsTable)
      .where(eq(locationsTable.id, result.id))
      .execute();

    expect(locations).toHaveLength(1);
    const savedLocation = locations[0];
    expect(savedLocation.name).toEqual('Test Restaurant');
    expect(savedLocation.address).toEqual('123 Main St');
    expect(savedLocation.city).toEqual('San Francisco');
    expect(savedLocation.state).toEqual('CA');
    expect(savedLocation.zip_code).toEqual('94102');
    expect(savedLocation.business_type).toEqual('restaurant');
    expect(savedLocation.is_active).toBe(true);
    expect(savedLocation.created_at).toBeInstanceOf(Date);
    expect(savedLocation.updated_at).toBeInstanceOf(Date);
  });

  it('should handle coordinates correctly', async () => {
    const coordinateInput: CreateLocationInput = {
      name: 'GPS Location',
      address: '789 Pine St',
      city: 'Seattle',
      state: 'WA',
      zip_code: '98101',
      phone: null,
      email: null,
      website: null,
      business_type: 'office',
      latitude: 47.6062,
      longitude: -122.3321
    };

    const result = await createLocation(coordinateInput);

    expect(result.latitude).toEqual(47.6062);
    expect(result.longitude).toEqual(-122.3321);
    expect(typeof result.latitude).toBe('number');
    expect(typeof result.longitude).toBe('number');
  });
});
