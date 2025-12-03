# Quick Start Guide - Your Supabase Project

## Your Supabase Project
**Project URL**: `https://nlipqnescidcbvetbmmt.supabase.co`

## Step 1: Get Your Supabase API Keys

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nlipqnescidcbvetbmmt
2. Navigate to **Settings** → **API**
3. Copy these three values:
   - **Project URL**: `https://nlipqnescidcbvetbmmt.supabase.co` (you already have this!)
   - **anon public key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role secret key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`) ⚠️ Keep this secret!

## Step 2: Create Environment Variables File

Create a file named `.env.local` in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nlipqnescidcbvetbmmt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here

# Stripe Configuration (Optional for now - add later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email Configuration (Optional for now - add later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# SMS Configuration (Optional for now - add later)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Replace `paste_your_anon_key_here` and `paste_your_service_role_key_here` with your actual keys from Step 1.

## Step 3: Set Up Database Schema

1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open the file `lib/db/schema.sql` from your project
4. Copy ALL the SQL code from that file
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message - you should see "Success. No rows returned"

This will create:
- ✅ All database tables (users, cars, bookings, tracking, notifications)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automatic updates

## Step 4: Install Dependencies

Run this command in your terminal:

```bash
pnpm install
```

## Step 5: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Step 6: Create Your Admin Account

1. Go to http://localhost:3000/auth/signup
2. Create an account with your email
3. After signing up, go to your Supabase Dashboard → **Table Editor** → **users**
4. Find your user (by email)
5. Click on the row to edit it
6. Change the `role` column from `user` to `admin`
7. Save

**OR** run this SQL in Supabase SQL Editor:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

(Replace `your-email@example.com` with the email you used to sign up)

## Step 7: Verify Everything Works

1. **Test User Registration**: Go to `/auth/signup` and create a test account
2. **Test Login**: Go to `/auth/login` and sign in
3. **Browse Cars**: Go to `/cars` - it should work (even if no cars yet)
4. **Test Admin**: Sign in with your admin account and try accessing `/admin`

## Next Steps

### Add Some Test Cars

Once logged in as admin, you can:
1. Go to `/admin` (once the admin panel is built)
2. OR directly add cars via Supabase Table Editor:
   - Go to **Table Editor** → **cars**
   - Click **Insert** → **Insert row**
   - Fill in car details

### Optional: Set Up Payments (Stripe)

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the dashboard
3. Add them to `.env.local`

### Optional: Set Up Email/SMS

1. Configure email (Gmail or other SMTP)
2. Configure SMS (Twilio)
3. Add credentials to `.env.local`

## Troubleshooting

### "Supabase environment variables are not set"
- Make sure `.env.local` exists in the root directory
- Check that the keys are correct (no extra spaces)
- Restart your dev server: Stop (Ctrl+C) and run `pnpm dev` again

### Can't find the API keys
- Make sure you're in the right project dashboard
- Go to Settings → API (not Database)
- The keys are in the "Project API keys" section

### Database errors
- Make sure you ran the SQL schema successfully
- Check the SQL Editor for any error messages
- Verify all tables were created: Go to Table Editor and you should see: users, cars, bookings, tracking, notifications

### Authentication not working
- Check browser console for errors
- Verify your Supabase URL and keys are correct
- Make sure the schema was run (especially the trigger that creates user profiles)

## Need Help?

- Check the main `SETUP.md` file for detailed instructions
- Check `README.md` for full documentation
- Verify your Supabase project is active and not paused

---

**You're all set!** 🎉 Start building your car rental system!

