
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎵</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MusicBox Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('solutions')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Solutions
            </button>
            <button 
              onClick={() => scrollToSection('locations')}
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Find Locations
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('solutions')}
                className="text-left text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('locations')}
                className="text-left text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Find Locations
              </button>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
