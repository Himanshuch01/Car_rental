/**
 * Cars API Routes
 * GET: List all cars with optional filters
 * POST: Create a new car (admin only)
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { CarFilter } from '@/types';

const carSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1),
  license_plate: z.string().min(1),
  type: z.enum(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van']),
  seats: z.number().int().min(1).max(50),
  transmission: z.enum(['automatic', 'manual']),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  mileage: z.number().int().min(0),
  hourly_price: z.number().positive(),
  daily_price: z.number().positive(),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  available: z.boolean().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const searchParams = request.nextUrl.searchParams;

    // Build query
    let query = supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const transmission = searchParams.get('transmission');
    const fuel_type = searchParams.get('fuel_type');
    const available = searchParams.get('available');
    const search = searchParams.get('search');
    const bookingType = searchParams.get('booking_type') || 'daily'; // hourly or daily

    if (type) {
      query = query.eq('type', type);
    }

    if (transmission) {
      query = query.eq('transmission', transmission);
    }

    if (fuel_type) {
      query = query.eq('fuel_type', fuel_type);
    }

    if (available !== null) {
      query = query.eq('available', available === 'true');
    }

    if (minPrice) {
      const priceColumn = bookingType === 'hourly' ? 'hourly_price' : 'daily_price';
      query = query.gte(priceColumn, parseFloat(minPrice));
    }

    if (maxPrice) {
      const priceColumn = bookingType === 'hourly' ? 'hourly_price' : 'daily_price';
      query = query.lte(priceColumn, parseFloat(maxPrice));
    }

    if (search) {
      query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: cars, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cars: cars || [] }, { status: 200 });
  } catch (error) {
    console.error('Get cars error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const body = await request.json();
    const carData = carSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    const { data: car, error } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    console.error('Create car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

