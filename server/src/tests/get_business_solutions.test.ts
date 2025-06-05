
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { businessSolutionsTable } from '../db/schema';
import { getBusinessSolutions } from '../handlers/get_business_solutions';

describe('getBusinessSolutions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no business solutions exist', async () => {
    const result = await getBusinessSolutions();
    expect(result).toEqual([]);
  });

  it('should return active business solutions ordered by order_index', async () => {
    // Create test business solutions with different order indices
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Solution C',
        description: 'Third solution',
        benefits: 'Benefits C',
        target_audience: 'Audience C',
        order_index: 3,
        is_active: true
      },
      {
        title: 'Solution A',
        description: 'First solution',
        benefits: 'Benefits A',
        target_audience: 'Audience A',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Solution B',
        description: 'Second solution',
        benefits: 'Benefits B',
        target_audience: 'Audience B',
        order_index: 2,
        is_active: true
      }
    ]).execute();

    const result = await getBusinessSolutions();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('Solution A');
    expect(result[1].title).toEqual('Solution B');
    expect(result[2].title).toEqual('Solution C');
    
    // Verify all expected fields are present
    result.forEach(solution => {
      expect(solution.id).toBeDefined();
      expect(solution.title).toBeDefined();
      expect(solution.description).toBeDefined();
      expect(solution.benefits).toBeDefined();
      expect(solution.target_audience).toBeDefined();
      expect(solution.order_index).toBeDefined();
      expect(solution.is_active).toBe(true);
      expect(solution.is_featured).toBeDefined();
      expect(solution.created_at).toBeInstanceOf(Date);
      expect(solution.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should exclude inactive business solutions', async () => {
    // Create both active and inactive solutions
    await db.insert(businessSolutionsTable).values([
      {
        title: 'Active Solution',
        description: 'This is active',
        benefits: 'Active benefits',
        target_audience: 'Active audience',
        order_index: 1,
        is_active: true
      },
      {
        title: 'Inactive Solution',
        description: 'This is inactive',
        benefits: 'Inactive benefits',
        target_audience: 'Inactive audience',
        order_index: 2,
        is_active: false
      }
    ]).execute();

    const result = await getBusinessSolutions();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Active Solution');
    expect(result[0].is_active).toBe(true);
  });

  it('should handle business solutions with featured flag', async () => {
    await db.insert(businessSolutionsTable).values({
      title: 'Featured Solution',
      description: 'This is featured',
      benefits: 'Featured benefits',
      target_audience: 'Featured audience',
      pricing_info: 'Premium pricing',
      is_featured: true,
      order_index: 1,
      is_active: true
    }).execute();

    const result = await getBusinessSolutions();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Featured Solution');
    expect(result[0].is_featured).toBe(true);
    expect(result[0].pricing_info).toEqual('Premium pricing');
  });
});
