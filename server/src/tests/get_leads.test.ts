
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type CreateLeadInput } from '../schema';
import { getLeads } from '../handlers/get_leads';

// Test input data
const testLead1: CreateLeadInput = {
  first_name: 'John',
  last_name: 'Smith',
  email: 'john.smith@example.com',
  phone: '555-0123',
  company: 'Acme Corp',
  message: 'Interested in your services',
  lead_type: 'business'
};

const testLead2: CreateLeadInput = {
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane.doe@example.com',
  phone: null,
  company: null,
  message: 'General inquiry',
  lead_type: 'general'
};

describe('getLeads', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no leads exist', async () => {
    const result = await getLeads();
    
    expect(result).toEqual([]);
  });

  it('should return all leads', async () => {
    // Create test leads
    await db.insert(leadsTable)
      .values([
        {
          ...testLead1,
          status: 'new'
        },
        {
          ...testLead2,
          status: 'new'
        }
      ])
      .execute();

    const result = await getLeads();

    expect(result).toHaveLength(2);
    
    // Check first lead
    const lead1 = result.find(l => l.email === 'john.smith@example.com');
    expect(lead1).toBeDefined();
    expect(lead1!.first_name).toEqual('John');
    expect(lead1!.last_name).toEqual('Smith');
    expect(lead1!.phone).toEqual('555-0123');
    expect(lead1!.company).toEqual('Acme Corp');
    expect(lead1!.message).toEqual('Interested in your services');
    expect(lead1!.lead_type).toEqual('business');
    expect(lead1!.status).toEqual('new');
    expect(lead1!.id).toBeDefined();
    expect(lead1!.created_at).toBeInstanceOf(Date);
    expect(lead1!.updated_at).toBeInstanceOf(Date);

    // Check second lead
    const lead2 = result.find(l => l.email === 'jane.doe@example.com');
    expect(lead2).toBeDefined();
    expect(lead2!.first_name).toEqual('Jane');
    expect(lead2!.last_name).toEqual('Doe');
    expect(lead2!.phone).toBeNull();
    expect(lead2!.company).toBeNull();
    expect(lead2!.message).toEqual('General inquiry');
    expect(lead2!.lead_type).toEqual('general');
    expect(lead2!.status).toEqual('new');
  });

  it('should return leads ordered by created_at descending', async () => {
    // Create first lead
    const firstLead = await db.insert(leadsTable)
      .values({
        ...testLead1,
        status: 'new'
      })
      .returning()
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second lead
    const secondLead = await db.insert(leadsTable)
      .values({
        ...testLead2,
        status: 'contacted'
      })
      .returning()
      .execute();

    const result = await getLeads();

    expect(result).toHaveLength(2);
    
    // Most recent lead should be first
    expect(result[0].id).toEqual(secondLead[0].id);
    expect(result[1].id).toEqual(firstLead[0].id);
    
    // Verify order by comparing timestamps
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should return leads with all possible statuses', async () => {
    // Create leads with different statuses
    await db.insert(leadsTable)
      .values([
        { ...testLead1, status: 'new' },
        { ...testLead2, status: 'contacted' },
        { 
          first_name: 'Bob',
          last_name: 'Johnson', 
          email: 'bob@example.com',
          phone: null,
          company: null,
          message: 'Test message',
          lead_type: 'location',
          status: 'qualified'
        }
      ])
      .execute();

    const result = await getLeads();

    expect(result).toHaveLength(3);
    
    const statuses = result.map(lead => lead.status);
    expect(statuses).toContain('new');
    expect(statuses).toContain('contacted');
    expect(statuses).toContain('qualified');
  });
});
