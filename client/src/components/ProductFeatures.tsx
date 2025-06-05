
import { Card, CardContent } from '@/components/ui/card';
import type { ProductFeature } from '../../../server/src/schema';

interface ProductFeaturesProps {
  features: ProductFeature[];
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
  // Fallback features in case none are loaded
  const fallbackFeatures = [
    {
      id: 1,
      title: 'Massive Music Library',
      description: 'Access to over 50 million songs across all genres and decades',
      icon: '🎵',
      order_index: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      title: 'Crystal Clear Audio',
      description: 'Premium sound quality with advanced audio processing',
      icon: '🔊',
      order_index: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      title: 'Mobile Integration',
      description: 'Customers can control the jukebox from their smartphones',
      icon: '📱',
      order_index: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      title: 'Real-time Analytics',
      description: 'Track popular songs and customer preferences',
      icon: '📊',
      order_index: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      title: 'Easy Management',
      description: 'Remote management and updates via cloud dashboard',
      icon: '⚙️',
      order_index: 5,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      title: 'Revenue Boost',
      description: 'Increase customer engagement and generate additional income',
      icon: '💰',
      order_index: 6,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const displayFeatures = features.length > 0 ? features : fallbackFeatures;
  const activeFeatures = displayFeatures.filter((feature: ProductFeature) => feature.is_active);

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our 
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Digital Jukebox?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our premium jukebox combines cutting-edge technology with user-friendly design 
            to create the perfect entertainment experience for your venue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeFeatures.map((feature: ProductFeature) => (
            <Card key={feature.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional highlight section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            🚀 Experience the Difference
          </h3>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
            Join thousands of venues worldwide who have transformed their customer experience 
            with our premium digital jukebox solution.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-purple-200">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">30 Days</div>
              <div className="text-sm text-purple-200">Free Trial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">No Setup</div>
              <div className="text-sm text-purple-200">Fees</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
