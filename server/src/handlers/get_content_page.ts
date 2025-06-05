
import { db } from '../db';
import { contentPagesTable } from '../db/schema';
import { type ContentPage } from '../schema';
import { eq } from 'drizzle-orm';

export const getContentPage = async (slug: string): Promise<ContentPage | null> => {
  try {
    const results = await db.select()
      .from(contentPagesTable)
      .where(eq(contentPagesTable.slug, slug))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Content page retrieval failed:', error);
    throw error;
  }
};
