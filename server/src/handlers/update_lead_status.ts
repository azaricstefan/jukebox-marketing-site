
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type UpdateLeadStatusInput, type Lead } from '../schema';
import { eq } from 'drizzle-orm';

export const updateLeadStatus = async (input: UpdateLeadStatusInput): Promise<Lead> => {
  try {
    // Update the lead status and updated_at timestamp
    const result = await db.update(leadsTable)
      .set({
        status: input.status,
        updated_at: new Date()
      })
      .where(eq(leadsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Lead with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Lead status update failed:', error);
    throw error;
  }
};
