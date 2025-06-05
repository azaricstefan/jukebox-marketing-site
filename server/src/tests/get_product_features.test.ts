
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { productFeaturesTable } from '../db/schema';
import { getProductFeatures } from '../handlers/get_product_features';

describe('getProductFeatures', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no product features exist', async () => {
    const result = await getProductFeatures();
    expect(result).toEqual([]);
  });

  it('should return active product features ordered by order_index', async () => {
    // Create test product features with different order indices
    await db.insert(productFeaturesTable)
      .values([
        {
          title: 'Feature C',
          description: 'Third feature',
          icon: 'icon-c',
          order_index: 2,
          is_active: true
        },
        {
          title: 'Feature A',
          description: 'First feature',
          icon: 'icon-a',
          order_index: 0,
          is_active: true
        },
        {
          title: 'Feature B',
          description: 'Second feature',
          icon: 'icon-b',
          order_index: 1,
          is_active: true
        }
      ])
      .execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(3);
    
    // Verify ordering by order_index
    expect(result[0].title).toEqual('Feature A');
    expect(result[0].order_index).toEqual(0);
    expect(result[1].title).toEqual('Feature B');
    expect(result[1].order_index).toEqual(1);
    expect(result[2].title).toEqual('Feature C');
    expect(result[2].order_index).toEqual(2);

    // Verify all required fields are present
    result.forEach(feature => {
      expect(feature.id).toBeDefined();
      expect(feature.title).toBeDefined();
      expect(feature.description).toBeDefined();
      expect(feature.icon).toBeDefined();
      expect(typeof feature.order_index).toBe('number');
      expect(feature.is_active).toBe(true);
      expect(feature.created_at).toBeInstanceOf(Date);
      expect(feature.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should only return active product features', async () => {
    // Create both active and inactive features
    await db.insert(productFeaturesTable)
      .values([
        {
          title: 'Active Feature',
          description: 'This feature is active',
          icon: 'icon-active',
          order_index: 0,
          is_active: true
        },
        {
          title: 'Inactive Feature',
          description: 'This feature is inactive',
          icon: 'icon-inactive',
          order_index: 1,
          is_active: false
        }
      ])
      .execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Active Feature');
    expect(result[0].is_active).toBe(true);
  });

  it('should handle features with same order_index consistently', async () => {
    // Create features with same order_index to test consistent ordering
    await db.insert(productFeaturesTable)
      .values([
        {
          title: 'Feature X',
          description: 'Feature with order 0',
          icon: 'icon-x',
          order_index: 0,
          is_active: true
        },
        {
          title: 'Feature Y',
          description: 'Another feature with order 0',
          icon: 'icon-y',
          order_index: 0,
          is_active: true
        }
      ])
      .execute();

    const result = await getProductFeatures();

    expect(result).toHaveLength(2);
    expect(result[0].order_index).toEqual(0);
    expect(result[1].order_index).toEqual(0);
    
    // Both features should be returned
    const titles = result.map(f => f.title);
    expect(titles).toContain('Feature X');
    expect(titles).toContain('Feature Y');
  });
});
