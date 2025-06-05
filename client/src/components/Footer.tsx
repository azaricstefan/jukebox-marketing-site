
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎵</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicBox Pro
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming venues worldwide with premium digital jukebox experiences. 
              Quality music, cutting-edge technology, exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors">
                <span className="text-lg">💼</span>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-6">Products</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Digital Jukebox
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Business Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Cloud Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Analytics Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-bold mb-6">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Restaurants & Bars
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Entertainment Venues
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Hotels & Hospitality
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Retail & Shopping
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Custom Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Technical Support
                </a>
              </li>
              <li>
                <a href="#locations" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Find Locations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} MusicBox Pro. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Legal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
