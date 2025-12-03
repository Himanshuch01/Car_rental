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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Our Fleet</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our wide selection of premium vehicles
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by make, model, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={bookingType} onValueChange={(value: 'hourly' | 'daily') => setBookingType(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Rental Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly Rental</SelectItem>
              <SelectItem value="daily">Daily Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? undefined : value as CarType['type'] })}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[180px]">
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No cars found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {car.images && car.images.length > 0 ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={car.images[0]}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Car className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">
                    {car.make} {car.model}
                  </CardTitle>
                  <Badge variant={car.available ? 'default' : 'secondary'}>
                    {car.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <CardDescription>{car.year} • {car.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Seats:</span>
                    <span>{car.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transmission:</span>
                    <span className="capitalize">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fuel:</span>
                    <span className="capitalize">{car.fuel_type}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {bookingType === 'hourly' ? 'Hourly' : 'Daily'}:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(bookingType === 'hourly' ? car.hourly_price : car.daily_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" disabled={!car.available}>
                  <Link href={`/cars/${car.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

