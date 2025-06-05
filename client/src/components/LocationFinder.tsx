
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import type { Location, SearchLocationsInput } from '../../../server/src/schema';

export function LocationFinder() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchLocationsInput>({
    city: '',
    state: '',
    zip_code: '',
    business_type: '',
    limit: 20
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Filter out empty strings to avoid sending them to the API
      const searchParams: SearchLocationsInput = {
        limit: searchData.limit
      };
      
      if (searchData.city && searchData.city.trim()) {
        searchParams.city = searchData.city.trim();
      }
      if (searchData.state && searchData.state.trim()) {
        searchParams.state = searchData.state.trim();
      }
      if (searchData.zip_code && searchData.zip_code.trim()) {
        searchParams.zip_code = searchData.zip_code.trim();
      }
      if (searchData.business_type && searchData.business_type.trim()) {
        searchParams.business_type = searchData.business_type.trim();
      }

      const results = await trpc.searchLocations.query(searchParams);
      setLocations(results);
    } catch (error) {
      console.error('Failed to search locations:', error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchData]);

  const loadAllLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await trpc.getLocations.query();
      setLocations(results);
    } catch (error) {
      console.error('Failed to load locations:', error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section id="locations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Find Jukebox
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Locations Near You
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover venues in your area that feature our premium digital jukebox experience. 
            Search by location or business type to find your next musical adventure.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      placeholder="Enter city"
                      value={searchData.city || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchData((prev: SearchLocationsInput) => ({ ...prev, city: e.target.value }))
                      }
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Input
                      placeholder="Enter state"
                      value={searchData.state || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchData((prev: SearchLocationsInput) => ({ ...prev, state: e.target.value }))
                      }
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <Input
                      placeholder="Enter ZIP"
                      value={searchData.zip_code || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchData((prev: SearchLocationsInput) => ({ ...prev, zip_code: e.target.value }))
                      }
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <Select 
                      value={searchData.business_type || 'all'} 
                      onValueChange={(value: string) => 
                        setSearchData((prev: SearchLocationsInput) => ({ 
                          ...prev, 
                          business_type: value === 'all' ? '' : value 
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="pub">Pub</SelectItem>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold"
                  >
                    {isLoading ? 'Searching...' : 'Search Locations 🔍'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={loadAllLocations}
                    disabled={isLoading}
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 font-semibold"
                  >
                    Show All Locations
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {locations.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              🎵 Found {locations.length} Location{locations.length !== 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location: Location) => (
                <Card key={location.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {location.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">📍</span>
                        <span>{location.address}, {location.city}, {location.state} {location.zip_code}</span>
                      </div>
                      
                      {location.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">📞</span>
                          <span>{location.phone}</span>
                        </div>
                      )}
                      
                      {location.email && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">✉️</span>
                          <span>{location.email}</span>
                        </div>
                      )}
                      
                      {location.website && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <span className="mr-2">🌐</span>
                          <a 
                            href={location.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {location.business_type}
                      </span>
                      {location.latitude && location.longitude && (
                        <a 
                          href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm hover:underline"
                        >
                          Get Directions →
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Explore?
            </h3>
            <p className="text-gray-600 mb-6">
              Use the search form above to find jukebox locations near you, or browse all locations.
            </p>
          </div>
        ) : null}

        {/* CTA for business owners */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Want Your Business Listed Here? 🏪
            </h3>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              Join our network of premium venues and attract music-loving customers to your business.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transform hover:scale-105 transition-all shadow-lg"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
