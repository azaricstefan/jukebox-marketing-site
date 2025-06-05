
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
  phone: '555-1234',
  company: 'Test Corp',
  message: 'Interested in your services',
  lead_type: 'business'
};

describe('updateLeadStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update lead status successfully', async () => {
    // Create a test lead first
    const createdLead = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createdLead[0].id;
    const originalUpdatedAt = createdLead[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateLeadStatusInput = {
      id: leadId,
      status: 'contacted'
    };

    const result = await updateLeadStatus(updateInput);

    // Verify the status was updated
    expect(result.id).toEqual(leadId);
    expect(result.status).toEqual('contacted');
    expect(result.first_name).toEqual('John');
    expect(result.last_name).toEqual('Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > originalUpdatedAt).toBe(true);
  });

  it('should save updated status to database', async () => {
    // Create a test lead
    const createdLead = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createdLead[0].id;

    const updateInput: UpdateLeadStatusInput = {
      id: leadId,
      status: 'qualified'
    };

    await updateLeadStatus(updateInput);

    // Verify the change was persisted
    const updatedLead = await db.select()
      .from(leadsTable)
      .where(eq(leadsTable.id, leadId))
      .execute();

    expect(updatedLead).toHaveLength(1);
    expect(updatedLead[0].status).toEqual('qualified');
    expect(updatedLead[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent lead', async () => {
    const updateInput: UpdateLeadStatusInput = {
      id: 99999,
      status: 'contacted'
    };

    await expect(updateLeadStatus(updateInput))
      .rejects
      .toThrow(/Lead with ID 99999 not found/i);
  });

  it('should handle all valid status values', async () => {
    // Create a test lead
    const createdLead = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createdLead[0].id;
    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'closed'] as const;

    // Test each status transition
    for (const status of validStatuses) {
      const updateInput: UpdateLeadStatusInput = {
        id: leadId,
        status: status
      };

      const result = await updateLeadStatus(updateInput);
      expect(result.status).toEqual(status);
    }
  });

  it('should update timestamp correctly', async () => {
    // Create a test lead
    const createdLead = await db.insert(leadsTable)
      .values({
        ...testLeadInput,
        status: 'new'
      })
      .returning()
      .execute();

    const leadId = createdLead[0].id;
    const originalTimestamp = createdLead[0].updated_at;

    // Wait to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateLeadStatusInput = {
      id: leadId,
      status: 'contacted'
    };

    const result = await updateLeadStatus(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalTimestamp.getTime());
    expect(result.created_at).toEqual(createdLead[0].created_at);
  });
});
