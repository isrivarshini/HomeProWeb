# HomePro Database Schema Documentation

## Overview
This document explains the database design for the HomePro home services booking platform.

## Entity Relationship Diagram (ERD)

```
users (1) ──────< (M) addresses
  │
  │ (1)
  │
  └──────< (M) bookings ────< (1) payments
              │              
              │ (M)          
              │              
              ├──────> (1) service_providers ────< (M) reviews
              │                 │
              │                 │ (M)
              │                 │
              │                 ├──────> (1) service_categories
              │                 │
              │                 └──────< (M) provider_availability
              │
              └──────> (1) addresses
```

## Table Explanations

### 1. users
**Purpose:** Store user account information

**Key Fields:**
- `id` (UUID): Primary key, auto-generated
- `email` (VARCHAR): Unique user identifier
- `password_hash` (VARCHAR): Bcrypt hashed password
- `phone` (VARCHAR): Required for booking confirmations

**Relationships:**
- One user has many addresses
- One user has many bookings
- One user can write many reviews

---

### 2. addresses
**Purpose:** Store user delivery/service addresses

**Key Fields:**
- `user_id` (FK): Links to users table
- `is_primary` (BOOLEAN): One primary address per user (enforced by trigger)

**Business Logic:**
- Users can save multiple addresses
- Must select address when booking
- Trigger ensures only one primary address per user

**SQL Trigger:**
```sql
CREATE TRIGGER enforce_single_primary_address 
BEFORE INSERT OR UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_address();
```

---

### 3. service_categories
**Purpose:** Define service types (Plumbing, Spa, Chef, etc.)

**Key Fields:**
- `name` (VARCHAR): Unique category name
- `icon_url` (VARCHAR): Icon for UI display
- `display_order` (INTEGER): Sort order in category grid

**Pre-seeded Data:**
1. Plumbing
2. Electrical
3. Cleaning
4. Spa & Massage
5. Carpentry
6. Chef Services
7. Painting
8. HVAC

---

### 4. service_providers
**Purpose:** Store provider business information

**Key Fields:**
- `category_id` (FK): Links to service_categories
- `hourly_rate` (DECIMAL): Base rate per hour
- `rating` (DECIMAL): Auto-calculated from reviews (0.00-5.00)
- `total_reviews` (INTEGER): Count of reviews
- `is_active` (BOOLEAN): Provider account status

**Calculated Fields:**
- `rating` and `total_reviews` are auto-updated via trigger when reviews are added

**SQL Trigger:**
```sql
CREATE TRIGGER update_rating_on_review 
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_provider_rating();
```

---

### 5. provider_availability
**Purpose:** Define when providers are available to work

**Design:** Weekly recurring schedule (not specific dates)

**Key Fields:**
- `provider_id` (FK): Links to service_providers
- `day_of_week` (INTEGER): 0=Sunday, 1=Monday, ..., 6=Saturday
- `start_time` (TIME): Shift start (e.g., 09:00)
- `end_time` (TIME): Shift end (e.g., 17:00)
- `is_active` (BOOLEAN): Enable/disable specific shifts

**Example Data:**
```sql
-- Provider works Monday-Friday, 9am-5pm
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time) VALUES
('abc-123', 1, '09:00', '17:00'), -- Monday
('abc-123', 2, '09:00', '17:00'), -- Tuesday
('abc-123', 3, '09:00', '17:00'), -- Wednesday
('abc-123', 4, '09:00', '17:00'), -- Thursday
('abc-123', 5, '09:00', '17:00'); -- Friday
```

**Availability Check Logic (Backend):**
```javascript
// Check if provider is available on a specific date/time
function isProviderAvailable(providerId, bookingDate, bookingTime) {
  const dayOfWeek = bookingDate.getDay(); // 0-6
  
  // Query: Does provider work on this day?
  const availability = await db.query(`
    SELECT * FROM provider_availability
    WHERE provider_id = $1 
      AND day_of_week = $2
      AND start_time <= $3
      AND end_time >= $4
      AND is_active = TRUE
  `, [providerId, dayOfWeek, bookingTime, bookingTime]);
  
  if (availability.length === 0) return false;
  
  // Check for booking conflicts (30min buffer)
  const conflicts = await db.query(`
    SELECT * FROM bookings
    WHERE provider_id = $1
      AND service_date = $2
      AND service_time BETWEEN $3 - INTERVAL '30 minutes' 
                           AND $3 + INTERVAL '30 minutes'
      AND status NOT IN ('cancelled')
  `, [providerId, bookingDate, bookingTime]);
  
  return conflicts.length === 0;
}
```

---

### 6. bookings
**Purpose:** Store service booking requests

**Key Fields:**
- `user_id`, `provider_id`, `address_id` (FKs): Links entities
- `service_date` (DATE): Date of service
- `service_time` (TIME): Start time (1-hour slots)
- `estimated_hours` (DECIMAL): User-selected duration (0.5-8.0 hrs)
- `status` (ENUM): Booking lifecycle

**Status Flow:**
```
pending → confirmed → in_progress → completed
                  ↓
              cancelled
```

**Total Amount Calculation:**
```javascript
total_amount = hourly_rate * estimated_hours
```

**Composite Index for Conflict Detection:**
```sql
CREATE INDEX idx_bookings_provider_date 
ON bookings(provider_id, service_date, service_time);
```

---

### 7. payments
**Purpose:** Track payment transactions

**Key Fields:**
- `booking_id` (FK): One-to-one with bookings
- `stripe_payment_id` (VARCHAR): Mock ID for test mode (e.g., "test_ch_1234")
- `status` (ENUM): pending, completed, failed, refunded
- `payment_method` (VARCHAR): 'card' for mock Stripe

**Mock Payment Flow:**
```javascript
// Frontend: Stripe test card
const testCard = "4242 4242 4242 4242";

// Backend: Create mock payment record
const payment = {
  booking_id: bookingId,
  stripe_payment_id: `test_ch_${Date.now()}`,
  amount: totalAmount,
  status: 'completed', // Mock always succeeds
  payment_method: 'card'
};
```

---

### 8. reviews
**Purpose:** User feedback after service completion

**Key Fields:**
- `booking_id` (FK): One review per booking (UNIQUE constraint)
- `rating` (INTEGER): 1-5 stars
- `comment` (TEXT): Optional written review

**Constraints:**
- Can only review after booking status = 'completed'
- One review per booking (UNIQUE on booking_id)

**Auto-update Provider Rating:**
When a review is inserted, trigger recalculates provider's average rating:
```sql
UPDATE service_providers
SET rating = (SELECT AVG(rating) FROM reviews WHERE provider_id = X),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE provider_id = X)
WHERE id = X;
```

---

## Key Design Decisions

### 1. Why UUIDs instead of INTEGER IDs?
- **Security:** No sequential ID guessing
- **Distributed systems:** Avoid ID collisions across services
- **Industry standard:** Used at Salesforce, IBM, modern SaaS

### 2. Why separate provider_availability table?
- **Normalization:** Avoid JSON columns (harder to query)
- **Flexibility:** Providers can have multiple shifts per day
- **Performance:** Indexed queries for availability checks
- **Interview talking point:** Demonstrate understanding of normalization

### 3. Why DECIMAL for money instead of INTEGER?
- **Precision:** Avoids floating-point errors
- **Standard:** DECIMAL(10,2) = up to $99,999,999.99
- **SQL best practice:** Never use FLOAT for currency

### 4. Why triggers for rating updates?
- **Data integrity:** Ensure rating always matches reviews
- **Performance:** Pre-calculated vs. runtime aggregation
- **Real-time:** Updates immediately when review submitted

---

## Indexes Strategy

### High-Priority Indexes (Query Performance)
```sql
-- Provider search by category + rating
idx_providers_category, idx_providers_rating

-- Booking conflict detection
idx_bookings_provider_date

-- User booking history
idx_bookings_user

-- Provider availability lookup
idx_availability_provider, idx_availability_day
```

### Why These Indexes?
- **Provider search:** Most common query (browse by category)
- **Conflict detection:** Check overlapping bookings (critical for UX)
- **User history:** Fast retrieval of "My Bookings"
- **Availability:** Real-time slot checking

---

## Interview Talking Points

### Question: "Why did you choose PostgreSQL over MongoDB?"
**Answer:**
"Booking systems have inherent relationships - users have bookings, bookings reference providers and addresses. PostgreSQL's foreign keys enforce referential integrity. For example, if a provider is deleted, CASCADE rules prevent orphaned bookings. MongoDB's flexibility wasn't needed here; the schema is well-defined and relational."

### Question: "How do you prevent double-booking?"
**Answer:**
"Two layers: 
1. **DB constraint:** Composite index on (provider_id, service_date, service_time) makes conflict queries fast
2. **Backend validation:** Check existing bookings ±30min buffer before confirming
3. **Transaction isolation:** Use BEGIN/COMMIT to prevent race conditions"

### Question: "How would you scale this for millions of bookings?"
**Answer:**
"Partition bookings table by service_date (monthly partitions), archive old bookings to cold storage, add read replicas for booking history queries, cache provider availability in Redis, implement database connection pooling."

---

## Setup Instructions

### 1. Supabase Setup
```bash
# Create new Supabase project at supabase.com
# Copy the SQL schema from homepro_schema.sql
# Run in SQL Editor
```

### 2. Enable Real-time
```sql
-- In Supabase dashboard, enable real-time for:
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
```

### 3. Row Level Security (RLS)
```sql
-- Users can only see their own data
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## Next Steps
1. Set up Supabase project
2. Run schema SQL
3. Enable RLS policies
4. Create API endpoints
5. Build frontend components
