
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type CreateLeadInput } from '../schema';
import { getLeads } from '../handlers/get_leads';

// Test input for creating leads
const testLead1: CreateLeadInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-1234',
  company: 'Test Corp',
  message: 'I am interested in your services',
  lead_type: 'business'
};

const testLead2: CreateLeadInput = {
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane.smith@example.com',
  phone: null,
  company: null,
  message: 'Need more information',
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
    // Create test leads separately to ensure different timestamps
    await db.insert(leadsTable).values({
      first_name: testLead1.first_name,
      last_name: testLead1.last_name,
      email: testLead1.email,
      phone: testLead1.phone,
      company: testLead1.company,
      message: testLead1.message,
      lead_type: testLead1.lead_type
    }).execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(leadsTable).values({
      first_name: testLead2.first_name,
      last_name: testLead2.last_name,
      email: testLead2.email,
      phone: testLead2.phone,
      company: testLead2.company,
      message: testLead2.message,
      lead_type: testLead2.lead_type
    }).execute();

    const result = await getLeads();

    expect(result).toHaveLength(2);
    
    // Find leads by name since order is by created_at desc (Jane created second, so first)
    const janeResult = result.find(lead => lead.first_name === 'Jane');
    const johnResult = result.find(lead => lead.first_name === 'John');

    expect(janeResult).toBeDefined();
    expect(johnResult).toBeDefined();

    // Verify Jane's data
    expect(janeResult!.first_name).toEqual('Jane');
    expect(janeResult!.last_name).toEqual('Smith');
    expect(janeResult!.email).toEqual('jane.smith@example.com');
    expect(janeResult!.phone).toBeNull();
    expect(janeResult!.company).toBeNull();
    expect(janeResult!.message).toEqual('Need more information');
    expect(janeResult!.lead_type).toEqual('general');
    expect(janeResult!.status).toEqual('new');

    // Verify John's data
    expect(johnResult!.first_name).toEqual('John');
    expect(johnResult!.last_name).toEqual('Doe');
    expect(johnResult!.email).toEqual('john.doe@example.com');
    expect(johnResult!.phone).toEqual('555-1234');
    expect(johnResult!.company).toEqual('Test Corp');
    expect(johnResult!.message).toEqual('I am interested in your services');
    expect(johnResult!.lead_type).toEqual('business');
    expect(johnResult!.status).toEqual('new');
  });

  it('should return leads ordered by created_at descending', async () => {
    // Create first lead
    await db.insert(leadsTable).values({
      first_name: testLead1.first_name,
      last_name: testLead1.last_name,
      email: testLead1.email,
      phone: testLead1.phone,
      company: testLead1.company,
      message: testLead1.message,
      lead_type: testLead1.lead_type
    }).execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second lead
    await db.insert(leadsTable).values({
      first_name: testLead2.first_name,
      last_name: testLead2.last_name,
      email: testLead2.email,
      phone: testLead2.phone,
      company: testLead2.company,
      message: testLead2.message,
      lead_type: testLead2.lead_type
    }).execute();

    const result = await getLeads();

    expect(result).toHaveLength(2);
    // Most recent lead should be first (Jane Smith was created second)
    expect(result[0].first_name).toEqual('Jane');
    expect(result[1].first_name).toEqual('John');
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should include all required fields', async () => {
    await db.insert(leadsTable).values({
      first_name: testLead1.first_name,
      last_name: testLead1.last_name,
      email: testLead1.email,
      phone: testLead1.phone,
      company: testLead1.company,
      message: testLead1.message,
      lead_type: testLead1.lead_type
    }).execute();

    const result = await getLeads();

    expect(result).toHaveLength(1);
    const lead = result[0];
    
    expect(lead.id).toBeDefined();
    expect(typeof lead.id).toBe('number');
    expect(lead.first_name).toBeDefined();
    expect(lead.last_name).toBeDefined();
    expect(lead.email).toBeDefined();
    expect(lead.message).toBeDefined();
    expect(lead.lead_type).toBeDefined();
    expect(lead.status).toBeDefined();
    expect(lead.created_at).toBeInstanceOf(Date);
    expect(lead.updated_at).toBeInstanceOf(Date);
  });
});
