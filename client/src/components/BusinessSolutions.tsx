
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BusinessSolution } from '../../../server/src/schema';

interface BusinessSolutionsProps {
  solutions: BusinessSolution[];
}

export function BusinessSolutions({ solutions }: BusinessSolutionsProps) {
  // Fallback solutions in case none are loaded
  const fallbackSolutions = [
    {
      id: 1,
      title: 'Restaurants & Bars',
      description: 'Create the perfect dining atmosphere with customizable playlists and volume control.',
      benefits: 'Increase customer dwell time, boost revenue, create memorable experiences',
      target_audience: 'Restaurants, bars, pubs, cafes',
      pricing_info: 'Starting at $149/month',
      is_featured: true,
      order_index: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      title: 'Entertainment Venues',
      description: 'Full-featured entertainment system for gaming centers, bowling alleys, and arcades.',
      benefits: 'Interactive music experiences, customer engagement, additional revenue streams',
      target_audience: 'Gaming centers, bowling alleys, arcades, entertainment complexes',
      pricing_info: 'Starting at $199/month',
      is_featured: true,
      order_index: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      title: 'Hotels & Hospitality',
      description: 'Enhance guest experience in lobbies, lounges, and common areas.',
      benefits: 'Improved guest satisfaction, modern amenities, easy management',
      target_audience: 'Hotels, motels, resorts, hospitality venues',
      pricing_info: 'Custom pricing available',
      is_featured: false,
      order_index: 3,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      title: 'Retail & Shopping',
      description: 'Background music and promotional content to enhance shopping experience.',
      benefits: 'Increased sales, brand reinforcement, customer engagement',
      target_audience: 'Retail stores, shopping centers, boutiques',
      pricing_info: 'Starting at $99/month',
      is_featured: false,
      order_index: 4,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const displaySolutions = solutions.length > 0 ? solutions : fallbackSolutions;
  const activeSolutions = displaySolutions.filter((solution: BusinessSolution) => solution.is_active);
  const featuredSolutions = activeSolutions.filter((solution: BusinessSolution) => solution.is_featured);
  const regularSolutions = activeSolutions.filter((solution: BusinessSolution) => !solution.is_featured);

  return (
    <section id="solutions" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Perfect for Every
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Business Type
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our flexible jukebox solutions are designed to enhance customer experience 
            across a wide variety of business environments.
          </p>
        </div>

        {/* Featured Solutions */}
        {featuredSolutions.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              🌟 Most Popular Solutions
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredSolutions.map((solution: BusinessSolution) => (
                <Card key={solution.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-200 bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-600 text-white px-4 py-2 text-sm font-bold">
                    FEATURED
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {solution.title}
                      </h3>
                      {solution.pricing_info && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {solution.pricing_info}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <p className="text-gray-600 text-sm">
                        {solution.benefits}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Perfect For:</h4>
                      <p className="text-gray-600 text-sm">
                        {solution.target_audience}
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        const element = document.getElementById('contact');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      Learn More 🚀
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Solutions */}
        {regularSolutions.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              More Business Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularSolutions.map((solution: BusinessSolution) => (
                <Card key={solution.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {solution.title}
                      </h3>
                      {solution.pricing_info && (
                        <Badge variant="outline" className="text-xs">
                          {solution.pricing_info}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <strong>Best for:</strong> {solution.target_audience}
                    </div>

                    <button 
                      onClick={() => {
                        const element = document.getElementById('contact');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm hover:underline transition-colors"
                    >
                      Get Quote →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Don't See Your Business Type? 🤔
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We work with businesses of all types and sizes. Contact us to discuss 
              a custom solution tailored to your specific needs.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transform hover:scale-105 transition-all shadow-lg"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
