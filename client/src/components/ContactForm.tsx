
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import type { CreateLeadInput } from '../../../server/src/schema';

export function ContactForm() {
  const [formData, setFormData] = useState<CreateLeadInput>({
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    company: null,
    message: '',
    lead_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await trpc.createLead.mutate(formData);
      setSubmitted(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: null,
        company: null,
        message: '',
        lead_type: 'general'
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-12">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thank You!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We've received your message and will get back to you within 24 hours. 
                  Get ready to transform your venue with premium music entertainment!
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Started?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contact our team to learn more about our premium jukebox solutions. 
            We'll help you find the perfect fit for your venue.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Get Your Free Quote 🚀
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        required
                        value={formData.first_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateLeadInput) => ({ ...prev, first_name: e.target.value }))
                        }
                        placeholder="Your first name"
                        className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        required
                        value={formData.last_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateLeadInput) => ({ ...prev, last_name: e.target.value }))
                        }
                        placeholder="Your last name"
                        className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateLeadInput) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="your.email@example.com"
                      className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateLeadInput) => ({ ...prev, phone: e.target.value || null }))
                      }
                      placeholder="(555) 123-4567"
                      className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Venue Name
                    </label>
                    <Input
                      value={formData.company || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateLeadInput) => ({ ...prev, company: e.target.value || null }))
                      }
                      placeholder="Your business name"
                      className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <Select 
                      value={formData.lead_type} 
                      onValueChange={(value: 'general' | 'business' | 'location') => 
                        setFormData((prev: CreateLeadInput) => ({ ...prev, lead_type: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="business">Business Partnership</SelectItem>
                        <SelectItem value="location">Location Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateLeadInput) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Tell us about your venue and what you're looking for..."
                      className="bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold transform hover:scale-105 transition-all"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Get in Touch 📞
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                        📧
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email Us</h4>
                        <p className="text-gray-600">sales@musicboxpro.com</p>
                        <p className="text-sm text-gray-500">We respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                        📞
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Call Us</h4>
                        <p className="text-gray-600">1-800-MUSICBOX</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl">
                        💬
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Live Chat</h4>
                        <p className="text-gray-600">Available on our website</p>
                        <p className="text-sm text-gray-500">Instant support during business hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Why Choose Us? 🌟
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <span>Free consultation and site assessment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <span>Professional installation included</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <span>24/7 technical support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <span>Custom solutions for any venue</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
