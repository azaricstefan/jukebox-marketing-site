
export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Contact Us',
      description: 'Get in touch with our team to discuss your venue needs and requirements.',
      icon: '📞',
      color: 'from-blue-500 to-purple-600'
    },
    {
      step: '02', 
      title: 'Installation',
      description: 'Our certified technicians handle professional installation and setup.',
      icon: '🔧',
      color: 'from-purple-600 to-pink-600'
    },
    {
      step: '03',
      title: 'Go Live',
      description: 'Start entertaining customers immediately with millions of songs at their fingertips.',
      icon: '🎉',
      color: 'from-pink-600 to-red-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Our streamlined process gets you up and running in no time.
          </p>
        </div>

        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step number circle */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg z-10 relative shadow-lg`}>
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="text-6xl mb-6">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started? 🎵
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Join the music revolution and transform your venue today.
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
              Get Your Free Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
