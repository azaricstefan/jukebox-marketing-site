
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type CreateLeadInput, type Lead } from '../schema';

export const createLead = async (input: CreateLeadInput): Promise<Lead> => {
  try {
    // Insert lead record
    const result = await db.insert(leadsTable)
      .values({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        message: input.message,
        lead_type: input.lead_type,
        status: 'new' // Default status from schema
      })
      .returning()
      .execute();

    const lead = result[0];
    return lead;
  } catch (error) {
    console.error('Lead creation failed:', error);
    throw error;
  }
};
