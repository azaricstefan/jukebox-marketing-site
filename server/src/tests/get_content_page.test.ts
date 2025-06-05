
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contentPagesTable } from '../db/schema';
import { getContentPage } from '../handlers/get_content_page';

describe('getContentPage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return content page by slug', async () => {
    // Create test content page
    await db.insert(contentPagesTable)
      .values({
        slug: 'test-page',
        title: 'Test Page',
        content: 'This is test content',
        meta_title: 'Test Meta Title',
        meta_description: 'Test meta description',
        is_published: true
      })
      .execute();

    const result = await getContentPage('test-page');

    expect(result).not.toBeNull();
    expect(result!.slug).toEqual('test-page');
    expect(result!.title).toEqual('Test Page');
    expect(result!.content).toEqual('This is test content');
    expect(result!.meta_title).toEqual('Test Meta Title');
    expect(result!.meta_description).toEqual('Test meta description');
    expect(result!.is_published).toBe(true);
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent slug', async () => {
    const result = await getContentPage('non-existent-page');

    expect(result).toBeNull();
  });

  it('should return published content page', async () => {
    // Create published content page
    await db.insert(contentPagesTable)
      .values({
        slug: 'published-page',
        title: 'Published Page',
        content: 'Published content',
        is_published: true
      })
      .execute();

    const result = await getContentPage('published-page');

    expect(result).not.toBeNull();
    expect(result!.is_published).toBe(true);
  });

  it('should return unpublished content page', async () => {
    // Create unpublished content page
    await db.insert(contentPagesTable)
      .values({
        slug: 'unpublished-page',
        title: 'Unpublished Page',
        content: 'Unpublished content',
        is_published: false
      })
      .execute();

    const result = await getContentPage('unpublished-page');

    expect(result).not.toBeNull();
    expect(result!.is_published).toBe(false);
  });

  it('should handle nullable fields correctly', async () => {
    // Create content page with null optional fields
    await db.insert(contentPagesTable)
      .values({
        slug: 'minimal-page',
        title: 'Minimal Page',
        content: 'Minimal content',
        meta_title: null,
        meta_description: null,
        is_published: true
      })
      .execute();

    const result = await getContentPage('minimal-page');

    expect(result).not.toBeNull();
    expect(result!.meta_title).toBeNull();
    expect(result!.meta_description).toBeNull();
  });
});
