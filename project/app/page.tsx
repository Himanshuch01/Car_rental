'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Shield, Clock, Star, CheckCircle2, Users, Award, Headphones } from 'lucide-react';
import { AdsCarousel } from '@/components/ads-carousel';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Ads Carousel Section */}
      <AdsCarousel />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">Trusted by 10,000+ Customers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
              Find Your Perfect Ride
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our premium fleet of vehicles and hit the road with confidence. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                <Link href="/cars">Browse Cars</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the best in car rental services with our premium features
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-8 w-8 md:h-10 md:w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl md:text-2xl mb-2">Wide Selection</CardTitle>
                <CardDescription className="text-base">
                  Choose from our extensive fleet of premium vehicles
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 dark:bg-green-900/30 w-fit group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl md:text-2xl mb-2">Fully Insured</CardTitle>
                <CardDescription className="text-base">
                  All rentals come with comprehensive insurance coverage
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="h-8 w-8 md:h-10 md:w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl md:text-2xl mb-2">24/7 Support</CardTitle>
                <CardDescription className="text-base">
                  Our support team is always here to help you
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-yellow-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-fit group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 md:h-10 md:w-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-xl md:text-2xl mb-2">Best Prices</CardTitle>
                <CardDescription className="text-base">
                  Competitive rates with no hidden fees or charges
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">500+</div>
              <div className="text-lg md:text-xl opacity-90">Premium Cars</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">10K+</div>
              <div className="text-lg md:text-xl opacity-90">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">50+</div>
              <div className="text-lg md:text-xl opacity-90">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">4.9★</div>
              <div className="text-lg md:text-xl opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What You Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Booking Process</h3>
                  <p className="text-gray-600 dark:text-gray-400">Book your car in just a few clicks with our streamlined process</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Flexible Rental Options</h3>
                  <p className="text-gray-600 dark:text-gray-400">Choose from hourly or daily rental options that suit your needs</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Latest Model Vehicles</h3>
                  <p className="text-gray-600 dark:text-gray-400">Drive the newest models with all the latest features and technology</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                  <p className="text-gray-600 dark:text-gray-400">Safe and secure payment processing with multiple payment options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto">
            Book your rental today and experience the difference. Join thousands of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" asChild>
              <Link href="/cars">Book Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white" asChild>
              <Link href="/auth/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
