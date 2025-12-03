'use client';

import { useEffect, useState, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

const ads = [
  {
    id: 1,
    title: 'Summer Special',
    subtitle: 'Get 30% Off',
    description: 'Book your dream car now and save big on your summer adventure!',
    cta: 'Book Now',
    href: '/cars',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
  },
  {
    id: 2,
    title: 'Premium Fleet',
    subtitle: 'Luxury Awaits',
    description: 'Experience the finest collection of premium vehicles at unbeatable prices.',
    cta: 'Explore',
    href: '/cars',
    gradient: 'from-blue-600 via-purple-600 to-indigo-600',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80',
  },
  {
    id: 3,
    title: 'Weekend Getaway',
    subtitle: 'Special Deals',
    description: 'Plan your perfect weekend escape with our exclusive weekend packages.',
    cta: 'Discover',
    href: '/cars',
    gradient: 'from-green-500 via-teal-500 to-cyan-500',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80',
  },
  {
    id: 4,
    title: 'New Arrivals',
    subtitle: 'Latest Models',
    description: 'Check out our newest additions to the fleet - top brands, latest features!',
    cta: 'View Cars',
    href: '/cars',
    gradient: 'from-violet-600 via-fuchsia-600 to-rose-600',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80',
  },
];

export function AdsCarousel() {
  const [mounted, setMounted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api || !mounted) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, mounted]);

  if (!mounted) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {ads.map((ad) => {
            const Icon = ad.icon;
            return (
              <CarouselItem key={ad.id} className="pl-0">
                <div
                  className={`relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden bg-gradient-to-br ${ad.gradient}`}
                >
                  {/* Background Image with Overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${ad.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                      <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                          <Icon className="h-5 w-5 text-white" />
                          <span className="text-white font-semibold text-sm md:text-base">
                            {ad.subtitle}
                          </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                          {ad.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                          {ad.description}
                        </p>
                        <Button
                          asChild
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-6 md:py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                          <Link href={ad.href} className="flex items-center gap-2">
                            {ad.cta}
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden lg:block" />
                  <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl hidden lg:block" />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-6 h-10 w-10 md:h-12 md:w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm" />
        <CarouselNext className="right-4 md:right-6 h-10 w-10 md:h-12 md:w-12 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm" />
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {ads.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

