
import { serial, text, pgTable, timestamp, boolean, integer, real, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const leadTypeEnum = pgEnum('lead_type', ['general', 'business', 'location']);
export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'converted', 'closed']);

// Leads table
export const leadsTable = pgTable('leads', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  message: text('message').notNull(),
  lead_type: leadTypeEnum('lead_type').notNull(),
  status: leadStatusEnum('status').notNull().default('new'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Locations table
export const locationsTable = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip_code: text('zip_code').notNull(),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  business_type: text('business_type').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  latitude: real('latitude'),
  longitude: real('longitude'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Product features table
export const productFeaturesTable = pgTable('product_features', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  order_index: integer('order_index').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Business solutions table
export const businessSolutionsTable = pgTable('business_solutions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  benefits: text('benefits').notNull(),
  target_audience: text('target_audience').notNull(),
  pricing_info: text('pricing_info'),
  is_featured: boolean('is_featured').notNull().default(false),
  order_index: integer('order_index').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Content pages table
export const contentPagesTable = pgTable('content_pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  is_published: boolean('is_published').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Export all tables for relation queries
export const tables = {
  leads: leadsTable,
  locations: locationsTable,
  productFeatures: productFeaturesTable,
  businessSolutions: businessSolutionsTable,
  contentPages: contentPagesTable,
};
