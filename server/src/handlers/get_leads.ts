
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type Lead } from '../schema';
import { desc } from 'drizzle-orm';

export const getLeads = async (): Promise<Lead[]> => {
  try {
    const results = await db.select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get leads:', error);
    throw error;
  }
};
