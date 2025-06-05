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
  SearchLocationsInput,
  CreateSubscriptionInput 
} from '../../server/src/schema';

function App() {
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [solutions, setSolutions] = useState<BusinessSolution[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
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

  // Subscription form state
  const [subscriptionEmail, setSubscriptionEmail] = useState('');

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
      alert('Hvala vam! Uskoro ćemo vas kontaktirati.');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Nešto je pošlo naopako. Molimo pokušajte ponovo.');
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail) return;

    setIsSubscribing(true);
    try {
      const subscriptionInput: CreateSubscriptionInput = {
        email: subscriptionEmail
      };
      await trpc.createSubscription.mutate(subscriptionInput);
      setSubscriptionEmail('');
      alert('Hvala na pretplati! Bićete obavešteni o novostima.');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Došlo je do greške prilikom pretplate. Molimo pokušajte ponovo.');
    } finally {
      setIsSubscribing(false);
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
                { id: 'hero', label: 'Početna' },
                { id: 'features', label: 'Funkcije' },
                { id: 'how-it-works', label: 'Kako Funkcioniše' },
                { id: 'solutions', label: 'Rešenja' },
                { id: 'locations', label: 'Lokacije' },
                { id: 'contact', label: 'Kontakt' }
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
              Započnite
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Budućnost
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Muzičke Zabave
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Pretvorite vaše mesto sa našim digitalnim džuboksom nove generacije. 
              Besprekorno strimovanje, društvene funkcije i neprevaziđen kvalitet zvuka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => scrollToSection('features')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8"
              >
                Istražite Funkcije ✨
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
              >
                Zatražite Demo 🎯
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
              Zašto odabrati JukeBox Pro? 🚀
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Vrhunska tehnologija susreće neverovatno korisničko iskustvo
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
              Kako Funkcioniše ⚡
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Jednostavno postavljanje, moćni rezultati u samo tri koraka
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Laka Instalacija',
                description: 'Naš tim obavlja kompletnu instalaciju i integraciju sa vašim postojećim zvučnim sistemom.',
                icon: '🔧'
              },
              {
                step: '02',
                title: 'Angažovanje Kupaca',
                description: 'Posetioci koriste našu mobilnu aplikaciju ili ekran osetljiv na dodir za odabir i redosled omiljenih pesama.',
                icon: '📱'
              },
              {
                step: '03',
                title: 'Rast Prihoda',
                description: 'Gledajte kako vaš muzički prihod raste dok zadovoljstvo kupaca dostiže vrhunac.',
                icon: '📈'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-lg mb-2">
                  KORAK {item.step}
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
              Poslovna Rešenja 💼
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Prilagođeni paketi za svaki tip lokala
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
                        Najpopularnije 🔥
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-white/70 text-base leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Ključne Prednosti:</h4>
                    <p className="text-white/70 text-sm">{solution.benefits}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Savršeno Za:</h4>
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
              Pronađite JukeBox Pro u vašoj blizini 📍
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Iskusite naš džuboks na ovim neverovatnim lokacijama
            </p>
          </div>
          
          {/* Location Search */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-12 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center">Pretraga Lokacija 🔍</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Grad"
                  value={locationSearch.city || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch((prev: SearchLocationsInput) => ({ ...prev, city: e.target.value || undefined }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="Država"
                  value={locationSearch.state || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationSearch((prev: SearchLocationsInput) => ({ ...prev, state: e.target.value || undefined }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="Poštanski Broj"
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
                  Pretraži 🔍
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
              Spremni da počnete? 🚀
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Kontaktirajte nas danas za besplatne konsultacije i demo
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">Kontaktirajte nas 📧</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Ime *"
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
                        placeholder="Prezime *"
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
                        placeholder="E-mail Adresa *"
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
                        placeholder="Broj Telefona"
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
                    placeholder="Naziv Kompanije/Lokala"
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
                      <SelectValue placeholder="Vrsta Upita" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Opšte Informacije 💬</SelectItem>
                      <SelectItem value="business">Poslovna Saradnja 🤝</SelectItem>
                      <SelectItem value="location">Nova Lokacija 📍</SelectItem>
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Recite nam više o vašem lokalu i zahtevima *"
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
                    {isLoading ? 'Šaljem...' : 'Pošalji Poruku 🚀'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section id="newsletter" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-3xl mb-4">
                  Pretplatite se na novosti 📩
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Budite prvi koji će saznati o našim novim funkcijama i specijalnim ponudama!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Vaša e-mail adresa"
                    value={subscriptionEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSubscriptionEmail(e.target.value)
                    }
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubscribing || !subscriptionEmail}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6"
                  >
                    {isSubscribing ? 'Pretplaćujem...' : 'Pretplati se'}
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
              © 2024 JukeBox Pro. Transformišemo lokale širom sveta. ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;