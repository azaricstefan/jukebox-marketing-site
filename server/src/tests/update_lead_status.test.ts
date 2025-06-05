
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type CreateLeadInput, type UpdateLeadStatusInput } from '../schema';
import { updateLeadStatus } from '../handlers/update_lead_status';
import { eq } from 'drizzle-orm';

// Test input for creating a lead
const testLeadInput: CreateLeadInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  message: 'Interested in your services',
  lead_type: 'business'
};

describe('updateLeadStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update lead status successfully', async () => {
    // Create a test lead first
    const createResult = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createResult[0].id;

    // Update the lead status
    const updateInput: UpdateLeadStatusInput = {
      id: leadId,
      status: 'contacted'
    };

    const result = await updateLeadStatus(updateInput);

    // Verify the updated lead
    expect(result.id).toEqual(leadId);
    expect(result.status).toEqual('contacted');
    expect(result.first_name).toEqual('John');
    expect(result.last_name).toEqual('Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update the database record correctly', async () => {
    // Create a test lead first
    const createResult = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createResult[0].id;
    const originalUpdatedAt = createResult[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update the lead status
    const updateInput: UpdateLeadStatusInput = {
      id: leadId,
      status: 'qualified'
    };

    await updateLeadStatus(updateInput);

    // Query the database to verify the update
    const updatedLeads = await db.select()
      .from(leadsTable)
      .where(eq(leadsTable.id, leadId))
      .execute();

    expect(updatedLeads).toHaveLength(1);
    expect(updatedLeads[0].status).toEqual('qualified');
    expect(updatedLeads[0].updated_at).toBeInstanceOf(Date);
    expect(updatedLeads[0].updated_at > originalUpdatedAt).toBe(true);
  });

  it('should handle different status values correctly', async () => {
    // Create a test lead first
    const createResult = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createResult[0].id;

    // Test updating to each valid status
    const statuses: Array<'new' | 'contacted' | 'qualified' | 'converted' | 'closed'> = 
      ['contacted', 'qualified', 'converted', 'closed'];

    for (const status of statuses) {
      const updateInput: UpdateLeadStatusInput = {
        id: leadId,
        status: status
      };

      const result = await updateLeadStatus(updateInput);
      expect(result.status).toEqual(status);
    }
  });

  it('should throw error for non-existent lead', async () => {
    const updateInput: UpdateLeadStatusInput = {
      id: 99999, // Non-existent ID
      status: 'contacted'
    };

    expect(updateLeadStatus(updateInput)).rejects.toThrow(/not found/i);
  });
});
