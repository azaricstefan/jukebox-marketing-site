import { db } from '../db';
import { subscriptionsTable } from '../db/schema';
import { type CreateSubscriptionInput, type Subscription } from '../schema';

export const createSubscription = async (input: CreateSubscriptionInput): Promise<Subscription> => {
  try {
    // Insert subscription record
    const result = await db.insert(subscriptionsTable)
      .values({
        email: input.email
      })
      .returning()
      .execute();

    const subscription = result[0];
    return subscription;
  } catch (error) {
    console.error('Subscription creation failed:', error);
    throw error;
  }
};