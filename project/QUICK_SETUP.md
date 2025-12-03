# Quick Setup Guide - Fix "Invalid API Key" Error

## Problem
You're seeing "Invalid API key" error and cars are not showing.

## Solution Steps

### Step 1: Check Your Environment Variables

Your `.env.local` file should look like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nlipqnescidcbvetbmmt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Replace `your_actual_anon_key_here` with your real anon key from Supabase
- Replace `your_actual_service_role_key_here` with your real service role key
- Make sure there are NO spaces around the `=` sign
- Make sure there are NO quotes around the values

### Step 2: Get Your Supabase Keys

1. Go to: https://supabase.com/dashboard/project/nlipqnescidcbvetbmmt/settings/api
2. Copy the **anon public** key (long string starting with `eyJ...`)
3. Copy the **service_role secret** key (also starts with `eyJ...`)
4. Paste them into your `.env.local` file

### Step 3: Create the Cars Table

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/nlipqnescidcbvetbmmt/sql/new
2. Open the file `lib/db/create_cars_table.sql` from your project
3. Copy ALL the SQL code
4. Paste it into the SQL Editor
5. Click **Run**
6. You should see "Success" and it will create the table + add 6 sample cars!

### Step 4: Restart Your Dev Server

After updating `.env.local`, you MUST restart your dev server:

```bash
# Stop the server (press Ctrl+C)
# Then start it again:
pnpm dev
```

### Step 5: Test

1. Open http://localhost:3000/cars
2. You should now see 6 sample cars!

## Quick Checklist

- [ ] `.env.local` file exists in project root
- [ ] Supabase URL is correct: `https://nlipqnescidcbvetbmmt.supabase.co`
- [ ] Anon key is set (NOT the placeholder text)
- [ ] Service role key is set (NOT the placeholder text)
- [ ] Cars table created in Supabase (run the SQL)
- [ ] Dev server restarted after changing .env.local
- [ ] No quotes around values in .env.local
- [ ] No extra spaces in .env.local

## If Still Not Working

### Check Your .env.local File

Run this command to see if your keys are set:

```powershell
# Check if file exists
Test-Path .env.local

# View first few lines (keys will be visible)
Get-Content .env.local
```

### Verify Keys Are Correct

1. Go to Supabase Dashboard
2. Settings → API
3. Compare the keys shown there with your `.env.local` file
4. Make sure they match EXACTLY

### Test Database Connection

Run this SQL in Supabase to check if cars table exists:

```sql
SELECT COUNT(*) FROM public.cars;
```

If this returns a number, the table exists!

### Common Mistakes

❌ **Wrong**: `NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."` (quotes)
✅ **Right**: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` (no quotes)

❌ **Wrong**: `NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...` (spaces)
✅ **Right**: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` (no spaces)

❌ **Wrong**: Using placeholder text instead of actual key
✅ **Right**: Using actual key from Supabase dashboard

## Need Help?

Share:
1. The first few characters of your anon key (to verify format)
2. Whether the cars table exists in Supabase
3. Any error messages from terminal

