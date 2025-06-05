
import { db } from '../db';
import { businessSolutionsTable } from '../db/schema';
import { type BusinessSolution } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getBusinessSolutions = async (): Promise<BusinessSolution[]> => {
  try {
    const results = await db.select()
      .from(businessSolutionsTable)
      .where(eq(businessSolutionsTable.is_active, true))
      .orderBy(asc(businessSolutionsTable.order_index))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get business solutions:', error);
    throw error;
  }
};
