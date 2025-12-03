/**
 * Tracking API Routes
 * GET: Get tracking data for a booking or car
 * POST: Create tracking data (for GPS device or admin)
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentUser, requireAuth, isAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const trackingSchema = z.object({
  booking_id: z.string().uuid().optional(),
  car_id: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().optional(),
  heading: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const searchParams = request.nextUrl.searchParams;
    const bookingId = searchParams.get('booking_id');
    const carId = searchParams.get('car_id');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabase
      .from('tracking')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (bookingId) {
      query = query.eq('booking_id', bookingId);
    }

    if (carId) {
      query = query.eq('car_id', carId);
    }

    // If not admin, only show tracking for user's bookings
    const admin = await isAdmin();
    if (!admin && bookingId) {
      // Verify booking belongs to user
      const { data: booking } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('id', bookingId)
        .single();

      if (!booking || booking.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    } else if (!admin && carId) {
      // For non-admin users, only show tracking if they have an active booking for that car
      const { data: activeBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('car_id', carId)
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'active'])
        .limit(1)
        .single();

      if (!activeBooking) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      query = query.eq('booking_id', activeBooking.id);
    }

    const { data: tracking, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ tracking: tracking || [] }, { status: 200 });
  } catch (error) {
    console.error('Get tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // For production, this should use API key authentication for GPS devices
    // For now, we'll allow authenticated users (admins or system)
    const user = await requireAuth();
    const body = await request.json();
    const trackingData = trackingSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // Verify car exists
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('id')
      .eq('id', trackingData.car_id)
      .single();

    if (carError || !car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // If booking_id is provided, verify it exists and matches car
    if (trackingData.booking_id) {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', trackingData.booking_id)
        .eq('car_id', trackingData.car_id)
        .single();

      if (bookingError || !booking) {
        return NextResponse.json(
          { error: 'Booking not found or does not match car' },
          { status: 404 }
        );
      }
    }

    const { data: tracking, error } = await supabase
      .from('tracking')
      .insert([trackingData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ tracking }, { status: 201 });
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

    console.error('Create tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

