# How to Get Your Supabase API Keys

## Quick Guide

Your Supabase Project URL: `https://nlipqnescidcbvetbmmt.supabase.co`

### Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/nlipqnescidcbvetbmmt
   - Or go to https://supabase.com/dashboard and select your project

2. **Navigate to API Settings**
   - Click on **Settings** in the left sidebar
   - Click on **API** under Project Settings

3. **Copy Your Keys**

   You'll see a section called **Project API keys** with several keys:

   **a) Project URL** (you already have this!)
   ```
   https://nlipqnescidcbvetbmmt.supabase.co
   ```

   **b) anon public key** (this one!)
   - Look for the key labeled **anon** or **public**
   - It will be a long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This key is safe to use in client-side code
   - Copy this entire string

   **c) service_role secret key** (this one too!)
   - Look for the key labeled **service_role** or **secret**
   - It will also be a long string
   - ⚠️ **IMPORTANT**: This key has admin privileges - keep it SECRET!
   - Only use this in server-side code (API routes)
   - Never commit this to GitHub
   - Copy this entire string

4. **Add to .env.local**

   Create a `.env.local` file in your project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://nlipqnescidcbvetbmmt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_anon_key_here>
   SUPABASE_SERVICE_ROLE_KEY=<paste_service_role_key_here>
   ```

5. **Visual Guide**

   In the Supabase Dashboard, you'll see something like:

   ```
   Project API keys
   ┌─────────────────────────────────────────┐
   │ anon / public                           │
   │ ┌─────────────────────────────────────┐ │
   │ │ eyJhbGciOiJIUzI1NiIsInR5cCI6...     │ │ ← Copy this
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ service_role / secret                   │
   │ ┌─────────────────────────────────────┐ │
   │ │ eyJhbGciOiJIUzI1NiIsInR5cCI6...     │ │ ← Copy this
   │ └─────────────────────────────────────┘ │
   └─────────────────────────────────────────┘
   ```

## Security Notes

- ✅ The **anon/public** key can be used in client-side code (browser)
- ❌ The **service_role** key should ONLY be in `.env.local` (server-side)
- ✅ `.env.local` is automatically ignored by git (won't be committed)
- ❌ Never share your service_role key publicly

## Still Can't Find It?

1. Make sure you're logged into the correct Supabase account
2. Make sure you've selected the correct project
3. The API keys are in Settings → API (not Database or Auth)
4. If you don't see the keys, your project might still be provisioning - wait a few minutes

## Next Step

After getting your keys, follow the `QUICK_START.md` guide to set everything up!

