
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { productFeaturesTable } from '../db/schema';
import { getProductFeatures } from '../handlers/get_product_features';

describe('getProductFeatures', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no features exist', async () => {
    const result = await getProductFeatures();
    expect(result).toEqual([]);
  });

  it('should return active product features ordered by order_index', async () => {
    // Create test features
    await db.insert(productFeaturesTable).values([
      {
        title: 'Feature B',
        description: 'Second feature',
        icon: 'icon-b',
        order_index: 2,
        is_active: true
      },
      {
        title: 'Feature A',
        description: 'First feature',
        icon: 'icon-a',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Feature C',
        description: 'Third feature',
        icon: 'icon-c',
        order_index: 3,
        is_active: false // Inactive - should not be returned
      }
    ]).execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Feature A');
    expect(result[0].order_index).toEqual(1);
    expect(result[0].is_active).toBe(true);
    expect(result[1].title).toEqual('Feature B');
    expect(result[1].order_index).toEqual(2);
    expect(result[1].is_active).toBe(true);
  });

  it('should only return active features', async () => {
    await db.insert(productFeaturesTable).values([
      {
        title: 'Active Feature',
        description: 'This is active',
        icon: 'icon-active',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Inactive Feature',
        description: 'This is inactive',
        icon: 'icon-inactive',
        order_index: 2,
        is_active: false
      }
    ]).execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Active Feature');
    expect(result[0].is_active).toBe(true);
  });

  it('should return features with all required fields', async () => {
    await db.insert(productFeaturesTable).values({
      title: 'Test Feature',
      description: 'Test description',
      icon: 'test-icon',
      order_index: 1,
      is_active: true
    }).execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(1);
    const feature = result[0];
    expect(feature.id).toBeDefined();
    expect(feature.title).toEqual('Test Feature');
    expect(feature.description).toEqual('Test description');
    expect(feature.icon).toEqual('test-icon');
    expect(feature.order_index).toEqual(1);
    expect(feature.is_active).toBe(true);
    expect(feature.created_at).toBeInstanceOf(Date);
    expect(feature.updated_at).toBeInstanceOf(Date);
  });
});
