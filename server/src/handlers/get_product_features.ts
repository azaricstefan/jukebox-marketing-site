
import { db } from '../db';
import { productFeaturesTable } from '../db/schema';
import { type ProductFeature } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getProductFeatures = async (): Promise<ProductFeature[]> => {
  try {
    // Get all active product features ordered by order_index
    const results = await db.select()
      .from(productFeaturesTable)
      .where(eq(productFeaturesTable.is_active, true))
      .orderBy(asc(productFeaturesTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get product features:', error);
    throw error;
  }
};
