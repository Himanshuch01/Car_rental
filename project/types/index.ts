/**
 * Type definitions for the Car Rental System
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'truck' | 'van';
  seats: number;
  transmission: 'automatic' | 'manual';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  mileage: number;
  hourly_price: number;
  daily_price: number;
  images: string[];
  description: string;
  available: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  booking_type: 'hourly' | 'daily';
  total_hours?: number;
  total_days?: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id?: string;
  pickup_location?: {
    lat: number;
    lng: number;
  };
  dropoff_location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  car?: Car;
}

export interface Tracking {
  id: string;
  booking_id: string;
  car_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'car_available' | 'reminder' | 'custom';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface CarFilter {
  type?: Car['type'];
  minPrice?: number;
  maxPrice?: number;
  transmission?: Car['transmission'];
  fuel_type?: Car['fuel_type'];
  available?: boolean;
  search?: string;
}

export interface BookingFormData {
  car_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  booking_type: 'hourly' | 'daily';
  pickup_location?: {
    lat: number;
    lng: number;
  };
}

