-- Simple SQL to create the cars table only
-- Run this in Supabase SQL Editor if you just need the cars table

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van')),
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  mileage INTEGER NOT NULL DEFAULT 0,
  hourly_price DECIMAL(10, 2) NOT NULL,
  daily_price DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_available ON public.cars(available);
CREATE INDEX IF NOT EXISTS idx_cars_type ON public.cars(type);

-- Enable Row Level Security
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view available cars" ON public.cars;

-- Create policy to allow anyone to view cars (public access)
CREATE POLICY "Anyone can view available cars"
  ON public.cars FOR SELECT
  USING (true);

-- Insert some sample cars for testing
INSERT INTO public.cars (
  make, model, year, color, license_plate, type, seats, transmission, 
  fuel_type, mileage, hourly_price, daily_price, description, available
) VALUES
  ('Toyota', 'Camry', 2023, 'White', 'ABC-1234', 'sedan', 5, 'automatic', 'petrol', 5000, 25.00, 150.00, 'Comfortable and reliable sedan perfect for city driving', true),
  ('Honda', 'CR-V', 2023, 'Black', 'XYZ-5678', 'suv', 7, 'automatic', 'hybrid', 3000, 35.00, 200.00, 'Spacious SUV with excellent fuel economy', true),
  ('Ford', 'Mustang', 2022, 'Red', 'MUS-2022', 'coupe', 4, 'manual', 'petrol', 8000, 50.00, 300.00, 'Sporty coupe with powerful engine', true),
  ('Tesla', 'Model 3', 2024, 'Blue', 'TSL-001', 'sedan', 5, 'automatic', 'electric', 2000, 45.00, 250.00, 'Electric vehicle with advanced features', true),
  ('BMW', 'X5', 2023, 'Silver', 'BMW-X5', 'suv', 5, 'automatic', 'diesel', 6000, 60.00, 350.00, 'Luxury SUV with premium features', true),
  ('Hyundai', 'Elantra', 2023, 'Gray', 'HYU-456', 'sedan', 5, 'automatic', 'petrol', 4000, 20.00, 120.00, 'Economical and efficient compact sedan', true)
ON CONFLICT (license_plate) DO NOTHING;

-- Verify the table was created
SELECT COUNT(*) as car_count FROM public.cars;

