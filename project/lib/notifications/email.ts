/**
 * Email notification service using Nodemailer
 */
import nodemailer from 'nodemailer';
import type { Booking, User, Car } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendBookingConfirmationEmail(
  booking: Booking & { user: User; car: Car }
) {
  try {
    const bookingType = booking.booking_type === 'hourly' ? 'hourly' : 'daily';
    const duration = booking.booking_type === 'hourly'
      ? `${booking.total_hours} hour(s)`
      : `${booking.total_days} day(s)`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.user.email,
      subject: 'Booking Confirmation - Car Rental',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { font-size: 24px; font-weight: bold; color: #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.user.full_name || 'Valued Customer'},</p>
              <p>Your booking has been confirmed. Here are your booking details:</p>
              
              <div class="details">
                <h3>Booking Information</h3>
                <div class="detail-row">
                  <span><strong>Booking ID:</strong></span>
                  <span>${booking.id.substring(0, 8)}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Vehicle:</strong></span>
                  <span>${booking.car.make} ${booking.car.model} (${booking.car.year})</span>
                </div>
                <div class="detail-row">
                  <span><strong>Rental Type:</strong></span>
                  <span>${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Duration:</strong></span>
                  <span>${duration}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Start Date & Time:</strong></span>
                  <span>${new Date(booking.start_date + 'T' + booking.start_time).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span><strong>End Date & Time:</strong></span>
                  <span>${new Date(booking.end_date + 'T' + booking.end_time).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Total Amount:</strong></span>
                  <span class="total">$${booking.total_price.toFixed(2)}</span>
                </div>
              </div>

              <p>Thank you for choosing our car rental service. If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request - Car Rental',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>You requested to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <p>If you didn't request this, please ignore this email.</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

