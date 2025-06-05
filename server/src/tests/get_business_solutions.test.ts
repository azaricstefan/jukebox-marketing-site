
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { businessSolutionsTable } from '../db/schema';
import { getBusinessSolutions } from '../handlers/get_business_solutions';

describe('getBusinessSolutions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return active business solutions ordered by order_index desc', async () => {
    // Create test business solutions with different order indices
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Solution A',
        description: 'Description A',
        benefits: 'Benefits A',
        target_audience: 'Target A',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Solution B',
        description: 'Description B',
        benefits: 'Benefits B',
        target_audience: 'Target B',
        order_index: 3,
        is_active: true
      },
      {
        title: 'Solution C',
        description: 'Description C',
        benefits: 'Benefits C',
        target_audience: 'Target C',
        order_index: 2,
        is_active: true
      }
    ]).execute();

    const results = await getBusinessSolutions();

    expect(results).toHaveLength(3);
    
    // Should be ordered by order_index descending (3, 2, 1)
    expect(results[0].title).toEqual('Solution B');
    expect(results[0].order_index).toEqual(3);
    expect(results[1].title).toEqual('Solution C');
    expect(results[1].order_index).toEqual(2);
    expect(results[2].title).toEqual('Solution A');
    expect(results[2].order_index).toEqual(1);

    // Verify all required fields are present
    results.forEach(solution => {
      expect(solution.id).toBeDefined();
      expect(solution.title).toBeDefined();
      expect(solution.description).toBeDefined();
      expect(solution.benefits).toBeDefined();
      expect(solution.target_audience).toBeDefined();
      expect(solution.is_featured).toBeDefined();
      expect(solution.order_index).toBeDefined();
      expect(solution.is_active).toBe(true);
      expect(solution.created_at).toBeInstanceOf(Date);
      expect(solution.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should not return inactive business solutions', async () => {
    // Create active and inactive solutions
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Active Solution',
        description: 'Active Description',
        benefits: 'Active Benefits',
        target_audience: 'Active Target',
        is_active: true
      },
      {
        title: 'Inactive Solution',
        description: 'Inactive Description',
        benefits: 'Inactive Benefits',
        target_audience: 'Inactive Target',
        is_active: false
      }
    ]).execute();

    const results = await getBusinessSolutions();

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Active Solution');
    expect(results[0].is_active).toBe(true);
  });

  it('should return empty array when no active solutions exist', async () => {
    // Create only inactive solutions
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Inactive Solution',
        description: 'Inactive Description',
        benefits: 'Inactive Benefits',
        target_audience: 'Inactive Target',
        is_active: false
      }
    ]).execute();

    const results = await getBusinessSolutions();

    expect(results).toHaveLength(0);
  });

  it('should handle solutions with optional fields', async () => {
    // Create solution with optional fields populated
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Full Solution',
        description: 'Full Description',
        benefits: 'Full Benefits',
        target_audience: 'Full Target',
        pricing_info: 'Premium pricing available',
        is_featured: true,
        order_index: 5,
        is_active: true
      }
    ]).execute();

    const results = await getBusinessSolutions();

    expect(results).toHaveLength(1);
    expect(results[0].pricing_info).toEqual('Premium pricing available');
    expect(results[0].is_featured).toBe(true);
    expect(results[0].order_index).toEqual(5);
  });
});
