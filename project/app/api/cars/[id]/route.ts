/**
 * Single Car API Routes
 * GET: Get car by ID
 * PUT: Update car (admin only)
 * DELETE: Delete car (admin only)
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateCarSchema = z.object({
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().min(1).optional(),
  license_plate: z.string().min(1).optional(),
  type: z.enum(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van']).optional(),
  seats: z.number().int().min(1).max(50).optional(),
  transmission: z.enum(['automatic', 'manual']).optional(),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid']).optional(),
  mileage: z.number().int().min(0).optional(),
  hourly_price: z.number().positive().optional(),
  daily_price: z.number().positive().optional(),
  images: z.array(z.string().url()).optional(),
  description: z.string().optional(),
  available: z.boolean().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
}).partial();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: car, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error) {
    console.error('Get car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const carData = updateCarSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    const { data: car, error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ car }, { status: 200 });
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

    console.error('Update car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Car deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
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

    console.error('Delete car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

