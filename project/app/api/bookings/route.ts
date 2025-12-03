/**
 * Bookings API Routes
 * GET: Get bookings (user's own or all for admin)
 * POST: Create a new booking
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentUser, requireAuth, isAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { differenceInHours, differenceInDays } from 'date-fns';
import type { BookingFormData } from '@/types';

const bookingSchema = z.object({
  car_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  booking_type: z.enum(['hourly', 'daily']),
  pickup_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
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
    const userId = searchParams.get('user_id');
    const carId = searchParams.get('car_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        user:users(*),
        car:cars(*)
      `)
      .order('created_at', { ascending: false });

    // If not admin, only show user's bookings
    const admin = await isAdmin();
    if (!admin) {
      query = query.eq('user_id', user.id);
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    if (carId) {
      query = query.eq('car_id', carId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ bookings: bookings || [] }, { status: 200 });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const bookingData = bookingSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // Check if car is available
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', bookingData.car_id)
      .single();

    if (carError || !car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    if (!car.available) {
      return NextResponse.json(
        { error: 'Car is not available' },
        { status: 400 }
      );
    }

    // Check for conflicting bookings
    const startDateTime = new Date(`${bookingData.start_date}T${bookingData.start_time}`);
    const endDateTime = new Date(`${bookingData.end_date}T${bookingData.end_time}`);

    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('*')
      .eq('car_id', bookingData.car_id)
      .in('status', ['pending', 'confirmed', 'active'])
      .or(`and(start_date.lte.${bookingData.end_date},end_date.gte.${bookingData.start_date})`);

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError);
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      // Check for time overlaps
      const hasConflict = conflictingBookings.some((booking) => {
        const bookingStart = new Date(`${booking.start_date}T${booking.start_time}`);
        const bookingEnd = new Date(`${booking.end_date}T${booking.end_time}`);
        return (
          (startDateTime >= bookingStart && startDateTime < bookingEnd) ||
          (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
          (startDateTime <= bookingStart && endDateTime >= bookingEnd)
        );
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Car is already booked for the selected time period' },
          { status: 400 }
        );
      }
    }

    // Calculate total price
    let totalHours = 0;
    let totalDays = 0;
    let totalPrice = 0;

    if (bookingData.booking_type === 'hourly') {
      totalHours = differenceInHours(endDateTime, startDateTime);
      if (totalHours < 1) totalHours = 1;
      totalPrice = totalHours * car.hourly_price;
    } else {
      totalDays = differenceInDays(endDateTime, startDateTime);
      if (totalDays < 1) totalDays = 1;
      totalPrice = totalDays * car.daily_price;
    }

    // Create booking
    const bookingRecord = {
      user_id: user.id,
      car_id: bookingData.car_id,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      start_time: bookingData.start_time,
      end_time: bookingData.end_time,
      booking_type: bookingData.booking_type,
      total_hours: bookingData.booking_type === 'hourly' ? totalHours : null,
      total_days: bookingData.booking_type === 'daily' ? totalDays : null,
      total_price: totalPrice,
      status: 'pending',
      payment_status: 'pending',
      pickup_location: bookingData.pickup_location || null,
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingRecord])
      .select(`
        *,
        user:users(*),
        car:cars(*)
      `)
      .single();

    if (bookingError) {
      return NextResponse.json(
        { error: bookingError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ booking }, { status: 201 });
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

    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

