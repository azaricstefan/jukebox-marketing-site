
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Hero } from '@/components/Hero';
import { ProductFeatures } from '@/components/ProductFeatures';
import { HowItWorks } from '@/components/HowItWorks';
import { BusinessSolutions } from '@/components/BusinessSolutions';
import { LocationFinder } from '@/components/LocationFinder';
import { ContactForm } from '@/components/ContactForm';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import type { ProductFeature, BusinessSolution } from '../../server/src/schema';

function App() {
  const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([]);
  const [businessSolutions, setBusinessSolutions] = useState<BusinessSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [features, solutions] = await Promise.all([
        trpc.getProductFeatures.query(),
        trpc.getBusinessSolutions.query()
      ]);
      setProductFeatures(features);
      setBusinessSolutions(solutions);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ProductFeatures features={productFeatures} />
      <HowItWorks />
      <BusinessSolutions solutions={businessSolutions} />
      <LocationFinder />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
