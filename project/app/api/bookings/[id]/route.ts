/**
 * Single Booking API Routes
 * GET: Get booking by ID
 * PUT: Update booking (user can update own, admin can update any)
 * DELETE: Cancel booking
 */
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentUser, requireAuth, isAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'cancelled']).optional(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
}).partial();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('bookings')
      .select(`
        *,
        user:users(*),
        car:cars(*)
      `)
      .eq('id', params.id)
      .single();

    const { data: booking, error } = await query;

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const admin = await isAdmin();
    if (!admin && booking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Get booking error:', error);
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
    const user = await requireAuth();
    const body = await request.json();
    const updateData = updateBookingSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // Check if booking exists and user has permission
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const admin = await isAdmin();
    if (!admin && existingBooking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Users can only cancel their bookings
    if (!admin && updateData.status && updateData.status !== 'cancelled') {
      return NextResponse.json(
        { error: 'You can only cancel bookings' },
        { status: 403 }
      );
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        user:users(*),
        car:cars(*)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
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

    console.error('Update booking error:', error);
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
    const user = await requireAuth();

    const supabase = await createServerSupabaseClient();

    // Check if booking exists and user has permission
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const admin = await isAdmin();
    if (!admin && existingBooking.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Cancel instead of delete
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

