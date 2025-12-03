/**
 * SMS notification service using Twilio
 */
import twilio from 'twilio';
import type { Booking, User, Car } from '@/types';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendBookingConfirmationSMS(
  booking: Booking & { user: User; car: Car },
  phoneNumber: string
) {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER || !phoneNumber) {
      console.warn('SMS not configured or phone number missing');
      return { success: false, error: 'SMS not configured' };
    }

    const duration = booking.booking_type === 'hourly'
      ? `${booking.total_hours} hour(s)`
      : `${booking.total_days} day(s)`;

    const message = `
Booking Confirmed!

Booking ID: ${booking.id.substring(0, 8)}
Vehicle: ${booking.car.make} ${booking.car.model}
Duration: ${duration}
Total: $${booking.total_price.toFixed(2)}

Start: ${new Date(booking.start_date + 'T' + booking.start_time).toLocaleString()}
End: ${new Date(booking.end_date + 'T' + booking.end_time).toLocaleString()}

Thank you for choosing our service!
    `.trim();

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
}

export async function sendOTP(phoneNumber: string, otp: string) {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER || !phoneNumber) {
      console.warn('SMS not configured or phone number missing');
      return { success: false, error: 'SMS not configured' };
    }

    const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error };
  }
}

