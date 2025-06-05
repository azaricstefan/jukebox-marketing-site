
import { z } from 'zod';

// Lead schema
export const leadSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  message: z.string(),
  lead_type: z.enum(['general', 'business', 'location']),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Lead = z.infer<typeof leadSchema>;

// Input schema for creating leads
export const createLeadInputSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  message: z.string().min(1, 'Message is required'),
  lead_type: z.enum(['general', 'business', 'location'])
});

export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;

// Location schema
export const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  website: z.string().nullable(),
  business_type: z.string(),
  is_active: z.boolean(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Location = z.infer<typeof locationSchema>;

// Input schema for creating locations
export const createLocationInputSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(5, 'ZIP code is required'),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  website: z.string().nullable(),
  business_type: z.string().min(1, 'Business type is required'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable()
});

export type CreateLocationInput = z.infer<typeof createLocationInputSchema>;

// Product feature schema
export const productFeatureSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  order_index: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ProductFeature = z.infer<typeof productFeatureSchema>;

// Business solution schema
export const businessSolutionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  benefits: z.string(),
  target_audience: z.string(),
  pricing_info: z.string().nullable(),
  is_featured: z.boolean(),
  order_index: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BusinessSolution = z.infer<typeof businessSolutionSchema>;

// Content page schema
export const contentPageSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  is_published: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ContentPage = z.infer<typeof contentPageSchema>;

// Search locations input schema
export const searchLocationsInputSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  business_type: z.string().optional(),
  limit: z.number().int().positive().optional().default(50)
});

export type SearchLocationsInput = z.infer<typeof searchLocationsInputSchema>;

// Update lead status input schema
export const updateLeadStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed'])
});

export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusInputSchema>;
