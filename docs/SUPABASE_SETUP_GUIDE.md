# Supabase Setup Guide - HomePro

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** HomePro
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to you
   - **Pricing:** Free tier
5. Wait ~2 minutes for project creation

---

## Step 2: Run Database Schema

1. In your Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `homepro_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or Ctrl+Enter)
6. Verify success: Check for green "Success" message

**Expected Output:**
```
CREATE TABLE (8 tables created)
CREATE INDEX (18 indexes created)
CREATE FUNCTION (3 functions created)
CREATE TRIGGER (6 triggers created)
INSERT (8 categories inserted)
```

---

## Step 3: Verify Tables Created

1. Click **"Table Editor"** (left sidebar)
2. You should see 8 tables:
   - users
   - addresses
   - service_categories
   - service_providers
   - provider_availability
   - bookings
   - payments
   - reviews

3. Click on **service_categories** table
4. You should see 8 pre-seeded categories:
   - Plumbing, Electrical, Cleaning, Spa & Massage, etc.

---

## Step 4: Get API Credentials

1. Click **"Project Settings"** (gear icon, left sidebar)
2. Click **"API"** tab
3. Copy these values (you'll need them for backend):

```javascript
// Save these in your .env file
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (secret!)
```

**Key Differences:**
- **ANON_KEY:** Use in frontend (React) - safe to expose
- **SERVICE_ROLE_KEY:** Use in backend only - bypasses RLS, keep secret!

---

## Step 5: Enable Real-time Subscriptions

1. Click **"Database"** → **"Replication"** (left sidebar)
2. Find the **bookings** table
3. Toggle **"Enable"** for real-time
4. Click **"Save"**

**What this does:**
- Allows frontend to listen for booking status changes
- WebSocket notifications when providers confirm bookings

**Frontend code example:**
```javascript
// Listen for booking updates
const subscription = supabase
  .channel('bookings-changes')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'bookings',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Booking updated!', payload.new);
    showNotification('Your booking status changed!');
  })
  .subscribe();
```

---

## Step 6: Set Up Authentication

1. Click **"Authentication"** (left sidebar)
2. Click **"Providers"** tab
3. **Email provider** is enabled by default ✓

### Optional: Enable Google OAuth

1. In **"Providers"** tab, find **Google**
2. Toggle **"Enable"**
3. You'll need Google OAuth credentials:

**Get Google OAuth credentials:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create new project → APIs & Services → Credentials
- Create OAuth 2.0 Client ID
- Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
- Copy Client ID and Client Secret
- Paste into Supabase Google provider settings

**Skip for now if you want to start with email auth only.**

---

## Step 7: Enable Row Level Security (RLS)

**Important:** Supabase tables are PUBLIC by default. Enable RLS to protect user data.

1. Click **"SQL Editor"**
2. Run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can only view/edit their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can manage their own addresses
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Users can view/create their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Users can view/create reviews for their bookings
CREATE POLICY "Users can view all reviews" ON reviews
  FOR SELECT USING (true); -- Reviews are public

CREATE POLICY "Users can create reviews for own bookings" ON reviews
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Public read access for categories and providers
CREATE POLICY "Anyone can view categories" ON service_categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view active providers" ON service_providers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view provider availability" ON provider_availability
  FOR SELECT USING (is_active = true);
```

3. Click **"Run"**

**What RLS does:**
- Prevents users from seeing other users' bookings
- Allows public browsing of providers (no login needed)
- Secures personal data (addresses, payments)

---

## Step 8: Test Database Connection

Create a test file to verify connection:

```javascript
// test-supabase.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

async function testConnection() {
  // Test 1: Fetch categories
  const { data, error } = await supabase
    .from('service_categories')
    .select('*');
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Categories fetched:', data.length);
    console.log(data);
  }
  
  // Test 2: Sign up a test user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test123456',
  });
  
  if (authError) {
    console.error('❌ Auth Error:', authError);
  } else {
    console.log('✅ Test user created:', authData.user.email);
  }
}

testConnection();
```

Run:
```bash
node test-supabase.js
```

**Expected Output:**
```
✅ Categories fetched: 8
[
  { id: '...', name: 'Plumbing', ... },
  { id: '...', name: 'Electrical', ... },
  ...
]
✅ Test user created: test@example.com
```

---

## Step 9: Add Sample Providers (Optional)

For testing, add some providers:

```sql
-- Insert test providers
INSERT INTO service_providers (business_name, category_id, description, hourly_rate, phone, email)
VALUES
(
  'QuickFix Plumbing',
  (SELECT id FROM service_categories WHERE name = 'Plumbing'),
  'Fast and reliable plumbing services. Available 24/7 for emergencies.',
  75.00,
  '555-1234',
  'contact@quickfixplumbing.com'
),
(
  'Sparkle Clean',
  (SELECT id FROM service_categories WHERE name = 'Cleaning'),
  'Professional home cleaning with eco-friendly products.',
  50.00,
  '555-5678',
  'hello@sparkleclean.com'
),
(
  'Relax Spa',
  (SELECT id FROM service_categories WHERE name = 'Spa & Massage'),
  'Therapeutic massage and spa treatments in your home.',
  90.00,
  '555-9999',
  'bookings@relaxspa.com'
);

-- Add availability for providers (Monday-Friday, 9am-5pm)
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time)
SELECT 
  p.id,
  dow,
  '09:00'::TIME,
  '17:00'::TIME
FROM service_providers p
CROSS JOIN generate_series(1, 5) AS dow -- Monday=1 to Friday=5
WHERE p.business_name IN ('QuickFix Plumbing', 'Sparkle Clean', 'Relax Spa');
```

---

## Step 10: Environment Variables

Create `.env` file in your backend project:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
PORT=3001
NODE_ENV=development

# Stripe (Mock)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**Security:**
- Add `.env` to `.gitignore`
- Never commit `SERVICE_ROLE_KEY` to GitHub

---

## Verification Checklist

Before moving to backend development, verify:

- [ ] 8 tables created in Supabase
- [ ] 8 service categories seeded
- [ ] API credentials copied to `.env`
- [ ] Real-time enabled for `bookings` table
- [ ] RLS policies applied to all tables
- [ ] Test connection successful
- [ ] (Optional) Sample providers added

---

## Troubleshooting

### "relation does not exist" error
- **Cause:** Schema didn't run completely
- **Fix:** Delete all tables, re-run `homepro_schema.sql`

### "permission denied" error
- **Cause:** RLS blocking queries
- **Fix:** Check RLS policies, ensure `auth.uid()` matches user

### Can't connect from backend
- **Cause:** Wrong API keys
- **Fix:** Verify `SUPABASE_URL` and keys in `.env`

### Real-time not working
- **Cause:** Replication not enabled
- **Fix:** Database → Replication → Enable for `bookings`

---

## Next Steps

✅ Database is ready!

Now proceed to:
1. **Design REST API endpoints** (Step 7)
2. **Set up Node.js/Express backend**
3. **Create React frontend**

---

## Useful Supabase Resources

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
