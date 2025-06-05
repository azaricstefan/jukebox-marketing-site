
import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-screen py-20">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-200 text-sm font-medium mb-6">
                🎵 The Future of Music Entertainment
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Premium Digital
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Jukebox Experience
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Transform your venue with our cutting-edge digital jukebox. Premium sound quality, 
              millions of songs, and interactive experiences that keep customers engaged and coming back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all"
              >
                Get Your Quote 🚀
              </Button>
              <Button 
                onClick={() => scrollToSection('how-it-works')}
                variant="outline" 
                className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all"
              >
                See How It Works
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50M+</div>
                <div className="text-sm text-gray-400">Songs Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Locations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="flex-1 relative">
            <div className="relative mx-auto max-w-lg">
              {/* Jukebox representation */}
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl mx-auto relative overflow-hidden border border-gray-700">
                  {/* Screen */}
                  <div className="absolute top-6 left-6 right-6 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">🎵</div>
                      <div className="text-sm font-medium">Now Playing</div>
                      <div className="text-xs opacity-80">Premium Sound</div>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    <div className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">Play Music</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">🎶</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-lg">🎤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
