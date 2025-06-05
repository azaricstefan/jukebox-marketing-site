
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { 
  ProductFeature, 
  BusinessSolution, 
  Location, 
  CreateLeadInput,
  SearchLocationsInput 
} from '../../server/src/schema';

function App() {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [solutions, setSolutions] = useState<BusinessSolution[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Contact form state
  const [contactForm, setContactForm] = useState<CreateLeadInput>({
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    company: null,
    message: '',
    lead_type: 'general'
  });

  // Location search state
  const [locationSearch, setLocationSearch] = useState<SearchLocationsInput>({
    city: '',
    state: '',
    zip_code: '',
    business_type: '',
    limit: 50
  });

  const loadData = useCallback(async () => {
    try {
      const [featuresData, solutionsData, locationsData] = await Promise.all([
        trpc.getProductFeatures.query(),
        trpc.getBusinessSolutions.query(),
        trpc.searchLocations.query({})
      ]);
      setFeatures(featuresData);
      setSolutions(solutionsData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await trpc.createLead.mutate(contactForm);
      setContactForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: null,
        company: null,
        message: '',
        lead_type: 'general'
      });
      alert('Thank you! We\'ll be in touch soon.');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    try {
      const searchResults = await trpc.searchLocations.query(locationSearch);
      setLocations(searchResults);
    } catch (error) {
      console.error('Failed to search locations:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎵</span>
              </div>
              <span className="text-white font-bold text-xl">JukeBox Pro</span>
            </div>
            <div className="hidden md:flex space-x-6">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'solutions', label: 'Solutions' },
                { id: 'locations', label: 'Locations' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-purple-300'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Music Entertainment
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Transform your venue with our next-generation digital jukebox. 
              Seamless streaming, social features, and unmatched audio quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => scrollToSection('features')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
              >
                Explore Features ✨
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
              >
                Request Demo 🎯
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose JukeBox Pro? 🚀
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Cutting-edge technology meets incredible user experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature: ProductFeature) => (
              <Card key={feature.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works ⚡
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Simple setup, powerful results in just three steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Easy Installation',
                description: 'Our team handles complete setup and integration with your existing sound system.',
                icon: '🔧'
              },
              {
                step: '02',
                title: 'Customer Engagement',
                description: 'Patrons use our mobile app or touchscreen to select and queue their favorite songs.',
                icon: '📱'
              },
              {
                step: '03',
                title: 'Revenue Growth',
                description: 'Watch your music revenue increase while customer satisfaction soars.',
                icon: '📈'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-lg mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Solutions Section */}
      <section id="solutions" className="py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Business Solutions 💼
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Tailored packages for every type of venue
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution: BusinessSolution) => (
              <Card key={solution.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-white text-2xl">{solution.title}</CardTitle>
                    {solution.is_featured && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                        Most Popular 🔥
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-white/70 text-base leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Key Benefits:</h4>
                    <p className="text-white/70 text-sm">{solution.benefits}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Perfect For:</h4>
                    <p className="text-white/70 text-sm">{solution.target_audience}</p>
                  </div>
                  {solution.pricing_info && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-purple-300 font-semibold">{solution.pricing_info}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Find JukeBox Pro Near You 📍
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience our jukebox at these amazing venues
            </p>
          </div>
          
          {/* Location Search */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-12 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center">Search Locations 🔍</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="City"
                  value={locationSearch.city || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch((prev: SearchLocationsInput) => ({ ...prev, city: e.target.value || undefined }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="State"
                  value={locationSearch.state || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch((prev: SearchLocationsInput) => ({ ...prev, state: e.target.value || undefined }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="ZIP Code"
                  value={locationSearch.zip_code || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch((prev: SearchLocationsInput) => ({ ...prev, zip_code: e.target.value || undefined }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button 
                  onClick={handleLocationSearch}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Search 🔍
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.slice(0, 9).map((location: Location) => (
              <Card key={location.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{location.name}</CardTitle>
                  <Badge variant="outline" className="border-purple-300 text-purple-300 w-fit">
                    {location.business_type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-white/70 text-sm">
                    📍 {location.address}, {location.city}, {location.state} {location.zip_code}
                  </p>
                  {location.phone && (
                    <p className="text-white/70 text-sm">📞 {location.phone}</p>
                  )}
                  {location.website && (
                    <p className="text-white/70 text-sm">🌐 {location.website}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started? 🚀
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Contact us today for a free consultation and demo
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">Contact Us 📧</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="First Name *"
                        value={contactForm.first_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateLeadInput) => ({ ...prev, first_name: e.target.value }))
                        }
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Last Name *"
                        value={contactForm.last_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateLeadInput) => ({ ...prev, last_name: e.target.value }))
                        }
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Address *"
                        value={contactForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateLeadInput) => ({ ...prev, email: e.target.value }))
                        }
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={contactForm.phone || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setContactForm((prev: CreateLeadInput) => ({ 
                            ...prev, 
                            phone: e.target.value || null 
                          }))
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Company/Venue Name"
                    value={contactForm.company || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContactForm((prev: CreateLeadInput) => ({ 
                        ...prev, 
                        company: e.target.value || null 
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />

                  <Select
                    value={contactForm.lead_type || 'general'}
                    onValueChange={(value: 'general' | 'business' | 'location') =>
                      setContactForm((prev: CreateLeadInput) => ({ ...prev, lead_type: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Inquiry Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Information 💬</SelectItem>
                      <SelectItem value="business">Business Partnership 🤝</SelectItem>
                      <SelectItem value="location">New Location 📍</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Tell us more about your venue and requirements *"
                    value={contactForm.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setContactForm((prev: CreateLeadInput) => ({ ...prev, message: e.target.value }))
                    }
                    required
                    rows={5}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
                  >
                    {isLoading ? 'Sending...' : 'Send Message 🚀'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎵</span>
              </div>
              <span className="text-white font-bold text-xl">JukeBox Pro</span>
            </div>
            <p className="text-white/60 text-center md:text-right">
              © 2024 JukeBox Pro. Transforming venues worldwide. 🌟
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
