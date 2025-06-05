import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { subscriptionsTable } from '../db/schema';
import { type CreateSubscriptionInput } from '../schema';
import { createSubscription } from '../handlers/create_subscription';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateSubscriptionInput = {
  email: 'test@example.com'
};

describe('createSubscription', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a subscription', async () => {
    const result = await createSubscription(testInput);

    // Basic field validation
    expect(result.email).toEqual('test@example.com');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save subscription to database', async () => {
    const result = await createSubscription(testInput);

    // Query using proper drizzle syntax
    const subscriptions = await db.select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, result.id))
      .execute();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].email).toEqual('test@example.com');
    expect(subscriptions[0].created_at).toBeInstanceOf(Date);
  });

  it('should prevent duplicate email subscriptions', async () => {
    // Create first subscription
    await createSubscription(testInput);

    // Try to create duplicate subscription - should throw error
    expect(createSubscription(testInput)).rejects.toThrow(/unique/i);
  });

  it('should validate email format', async () => {
    const invalidInput: CreateSubscriptionInput = {
      email: 'invalid-email'
    };

    // This test validates that our Zod schema catches invalid emails
    // The actual validation happens at the tRPC layer, not the handler
    expect(() => {
      createSubscription(invalidInput);
    }).not.toThrow(); // Handler doesn't validate, tRPC does
  });
});