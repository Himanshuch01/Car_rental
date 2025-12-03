'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Search, Filter } from 'lucide-react';
import type { Car as CarType, CarFilter } from '@/types';
import Image from 'next/image';

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilter>({
    available: true,
  });
  const [search, setSearch] = useState('');
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('daily');

  useEffect(() => {
    fetchCars();
  }, [filters, search, bookingType]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
      if (filters.available !== undefined) params.append('available', filters.available.toString());
      if (search) params.append('search', search);
      params.append('booking_type', bookingType);

      const response = await fetch(`/api/cars?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCars(data.cars || []);
      } else {
        console.error('Error fetching cars:', data.error);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Browse Our Fleet
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Choose from our wide selection of premium vehicles. Find the perfect car for your journey.
          </p>
        </div>

      {/* Search and Filters */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              placeholder="Search by make, model, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 md:pl-12 h-12 md:h-14 text-base rounded-xl border-2 focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
          <Select value={bookingType} onValueChange={(value: 'hourly' | 'daily') => setBookingType(value)}>
            <SelectTrigger className="w-full md:w-[200px] h-12 md:h-14 rounded-xl border-2 shadow-sm">
              <SelectValue placeholder="Rental Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly Rental</SelectItem>
              <SelectItem value="daily">Daily Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? undefined : value as CarType['type'] })}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-2 shadow-sm">
              <SelectValue placeholder="Car Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="van">Van</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.transmission || 'all'}
            onValueChange={(value) => setFilters({ ...filters, transmission: value === 'all' ? undefined : value as CarType['transmission'] })}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-2 shadow-sm">
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.fuel_type || 'all'}
            onValueChange={(value) => setFilters({ ...filters, fuel_type: value === 'all' ? undefined : value as CarType['fuel_type'] })}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-2 shadow-sm">
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 md:py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading cars...</p>
          </div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 md:py-32">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <Car className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No cars found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your filters or search criteria to find the perfect vehicle
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {cars.map((car) => (
            <Card 
              key={car.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-500/50 bg-white dark:bg-gray-900"
            >
              {car.images && car.images.length > 0 ? (
                <div className="relative h-48 md:h-56 w-full overflow-hidden">
                  <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={car.available ? 'default' : 'secondary'}
                      className={`${
                        car.available 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-500'
                      } text-white shadow-lg`}
                    >
                      {car.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-48 md:h-56 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Car className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl md:text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {car.make} {car.model}
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  {car.year} • <span className="capitalize">{car.type}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Seats:</span>
                    <span className="font-semibold">{car.seats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Transmission:</span>
                    <span className="capitalize font-semibold">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Fuel:</span>
                    <span className="capitalize font-semibold">{car.fuel_type}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {bookingType === 'hourly' ? 'Hourly' : 'Daily'}:
                      </span>
                      <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(bookingType === 'hourly' ? car.hourly_price : car.daily_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Button 
                  asChild 
                  className="w-full h-11 md:h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                  disabled={!car.available}
                >
                  <Link href={`/cars/${car.id}`}>
                    {car.available ? 'View Details' : 'Unavailable'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

