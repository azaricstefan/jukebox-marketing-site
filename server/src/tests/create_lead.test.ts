
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leadsTable } from '../db/schema';
import { type CreateLeadInput } from '../schema';
import { createLead } from '../handlers/create_lead';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateLeadInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  company: 'Test Company Inc',
  message: 'I am interested in your services',
  lead_type: 'business'
};

describe('createLead', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a lead with all fields', async () => {
    const result = await createLead(testInput);

    // Basic field validation
    expect(result.first_name).toEqual('John');
    expect(result.last_name).toEqual('Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone).toEqual('+1-555-123-4567');
    expect(result.company).toEqual('Test Company Inc');
    expect(result.message).toEqual('I am interested in your services');
    expect(result.lead_type).toEqual('business');
    expect(result.status).toEqual('new'); // Default status
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a lead with nullable fields set to null', async () => {
    const inputWithNulls: CreateLeadInput = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: null,
      company: null,
      message: 'Looking for general information',
      lead_type: 'general'
    };

    const result = await createLead(inputWithNulls);

    expect(result.first_name).toEqual('Jane');
    expect(result.last_name).toEqual('Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone).toBeNull();
    expect(result.company).toBeNull();
    expect(result.message).toEqual('Looking for general information');
    expect(result.lead_type).toEqual('general');
    expect(result.status).toEqual('new');
  });

  it('should save lead to database', async () => {
    const result = await createLead(testInput);

    // Query using proper drizzle syntax
    const leads = await db.select()
      .from(leadsTable)
      .where(eq(leadsTable.id, result.id))
      .execute();

    expect(leads).toHaveLength(1);
    expect(leads[0].first_name).toEqual('John');
    expect(leads[0].last_name).toEqual('Doe');
    expect(leads[0].email).toEqual('john.doe@example.com');
    expect(leads[0].phone).toEqual('+1-555-123-4567');
    expect(leads[0].company).toEqual('Test Company Inc');
    expect(leads[0].message).toEqual('I am interested in your services');
    expect(leads[0].lead_type).toEqual('business');
    expect(leads[0].status).toEqual('new');
    expect(leads[0].created_at).toBeInstanceOf(Date);
    expect(leads[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create leads with different lead types', async () => {
    const generalLead: CreateLeadInput = {
      ...testInput,
      lead_type: 'general',
      message: 'General inquiry'
    };

    const locationLead: CreateLeadInput = {
      ...testInput,
      lead_type: 'location',
      message: 'Location-specific inquiry'
    };

    const result1 = await createLead(generalLead);
    const result2 = await createLead(locationLead);

    expect(result1.lead_type).toEqual('general');
    expect(result1.message).toEqual('General inquiry');
    expect(result2.lead_type).toEqual('location');
    expect(result2.message).toEqual('Location-specific inquiry');

    // Verify both records exist in database
    const allLeads = await db.select().from(leadsTable).execute();
    expect(allLeads).toHaveLength(2);
  });
});
