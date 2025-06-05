
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

  it('should return content page with nullable fields', async () => {
    // Create content page with null optional fields
    await db.insert(contentPagesTable)
      .values({
        slug: 'minimal-page',
        title: 'Minimal Page',
        content: 'Minimal content',
        meta_title: null,
        meta_description: null,
        is_published: false
      })
      .execute();

    const result = await getContentPage('minimal-page');

    expect(result).not.toBeNull();
    expect(result!.slug).toEqual('minimal-page');
    expect(result!.title).toEqual('Minimal Page');
    expect(result!.content).toEqual('Minimal content');
    expect(result!.meta_title).toBeNull();
    expect(result!.meta_description).toBeNull();
    expect(result!.is_published).toBe(false);
  });

  it('should be case sensitive for slug matching', async () => {
    // Create test content page
    await db.insert(contentPagesTable)
      .values({
        slug: 'Case-Sensitive',
        title: 'Case Test',
        content: 'Test content',
        is_published: true
      })
      .execute();

    const exactMatch = await getContentPage('Case-Sensitive');
    expect(exactMatch).not.toBeNull();
    expect(exactMatch!.slug).toEqual('Case-Sensitive');

    const lowerCase = await getContentPage('case-sensitive');
    expect(lowerCase).toBeNull();
  });
});
