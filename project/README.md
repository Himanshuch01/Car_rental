# Car Rental System

A full-stack car rental management system built with Next.js, Supabase, Stripe, and real-time GPS tracking.

## Features

### User Features
- ✅ User authentication (signup, login, password reset)
- ✅ Browse and search cars with filters
- ✅ Book cars for hourly or daily rental
- ✅ Real-time GPS tracking of rented cars
- ✅ View booking history and status
- ✅ Automatic email and SMS notifications on booking confirmation
- ✅ Payment integration with Stripe

### Admin Features
- ✅ Secure admin panel
- ✅ View all bookings with user details
- ✅ Add, edit, and remove cars
- ✅ Manage car pricing (hourly/daily)
- ✅ View real-time location of all cars
- ✅ Access booking and tracking history
- ✅ Send notifications to users

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Real-time**: Supabase Realtime / WebSockets
- **Email**: Nodemailer
- **SMS**: Twilio
- **Maps**: React Leaflet (for GPS tracking)

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Supabase account
- Stripe account
- Twilio account (for SMS)
- SMTP credentials (for email)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password

   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**

   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL schema from `lib/db/schema.sql`
   - This will create all necessary tables, indexes, and security policies

5. **Create a default admin user**

   After running the schema, you'll need to create an admin user manually:
   ```sql
   -- First, sign up a user through the app, then update their role:
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'admin@example.com';
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cars/           # Car management endpoints
│   │   ├── bookings/       # Booking endpoints
│   │   ├── payments/       # Payment endpoints
│   │   └── tracking/       # GPS tracking endpoints
│   ├── auth/               # Authentication pages
│   ├── cars/               # Car browsing pages
│   ├── dashboard/          # User dashboard
│   ├── admin/              # Admin panel
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── lib/                    # Utilities and helpers
│   ├── auth.ts            # Server-side auth utilities
│   ├── auth-client.ts     # Client-side auth utilities
│   ├── supabase/          # Supabase clients
│   ├── db/                # Database schema
│   └── notifications/     # Email & SMS services
├── types/                  # TypeScript type definitions
├── middleware.ts          # Next.js middleware for route protection
└── ...
```

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Cars
- `GET /api/cars` - List cars with filters
- `GET /api/cars/[id]` - Get car details
- `POST /api/cars` - Create car (admin only)
- `PUT /api/cars/[id]` - Update car (admin only)
- `DELETE /api/cars/[id]` - Delete car (admin only)

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent

### Tracking
- `GET /api/tracking` - Get tracking data
- `POST /api/tracking` - Create tracking point

## Database Schema

The system uses the following main tables:

- **users** - User profiles (extends Supabase auth.users)
- **cars** - Vehicle information
- **bookings** - Rental bookings
- **tracking** - GPS tracking data
- **notifications** - User notifications

See `lib/db/schema.sql` for complete schema with indexes and RLS policies.

## Key Features Implementation

### Authentication
- Uses Supabase Auth for secure authentication
- Row Level Security (RLS) policies protect user data
- Middleware protects routes based on authentication status

### Real-time Tracking
- GPS tracking data stored in `tracking` table
- Real-time updates using Supabase Realtime subscriptions
- Accessible by users for their bookings and admins for all cars

### Payments
- Stripe integration for secure payments
- Payment intents created on booking
- Webhook handler updates booking status on payment success

### Notifications
- Email notifications via Nodemailer
- SMS notifications via Twilio
- Automatic confirmation emails/SMS on booking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Make sure to:
- Set all environment variables
- Configure Supabase for production
- Set up Stripe webhooks
- Configure email/SMS services

## Security Features

- Row Level Security (RLS) on all database tables
- Protected API routes with authentication checks
- Middleware for route protection
- Input validation using Zod
- Secure password handling via Supabase Auth
- CORS protection on API routes

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Type Checking
```bash
pnpm typecheck
```

## Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check if RLS policies are correctly set
- Ensure database schema is fully migrated

### Email/SMS Not Working
- Verify SMTP/Twilio credentials
- Check service account permissions
- Review error logs for specific issues

### Payment Issues
- Verify Stripe keys are correct
- Check webhook configuration
- Ensure payment intent creation is successful

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Vehicle maintenance tracking
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] AI-powered car recommendations

