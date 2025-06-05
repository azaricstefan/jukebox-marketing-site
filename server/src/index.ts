
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

import { 
  createLeadInputSchema, 
  searchLocationsInputSchema, 
  updateLeadStatusInputSchema,
  createLocationInputSchema,
  createSubscriptionInputSchema 
} from './schema';

import { createLead } from './handlers/create_lead';
import { getLeads } from './handlers/get_leads';
import { updateLeadStatus } from './handlers/update_lead_status';
import { getLocations } from './handlers/get_locations';
import { searchLocations } from './handlers/search_locations';
import { createLocation } from './handlers/create_location';
import { getProductFeatures } from './handlers/get_product_features';
import { getBusinessSolutions } from './handlers/get_business_solutions';
import { getContentPage } from './handlers/get_content_page';
import { createSubscription } from './handlers/create_subscription';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Lead management
  createLead: publicProcedure
    .input(createLeadInputSchema)
    .mutation(({ input }) => createLead(input)),

  getLeads: publicProcedure
    .query(() => getLeads()),

  updateLeadStatus: publicProcedure
    .input(updateLeadStatusInputSchema)
    .mutation(({ input }) => updateLeadStatus(input)),

  // Location management
  getLocations: publicProcedure
    .query(() => getLocations()),

  searchLocations: publicProcedure
    .input(searchLocationsInputSchema)
    .query(({ input }) => searchLocations(input)),

  createLocation: publicProcedure
    .input(createLocationInputSchema)
    .mutation(({ input }) => createLocation(input)),

  // Content management
  getProductFeatures: publicProcedure
    .query(() => getProductFeatures()),

  getBusinessSolutions: publicProcedure
    .query(() => getBusinessSolutions()),

  getContentPage: publicProcedure
    .input(z.string())
    .query(({ input }) => getContentPage(input)),

  // Subscription management
  createSubscription: publicProcedure
    .input(createSubscriptionInputSchema)
    .mutation(({ input }) => createSubscription(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
