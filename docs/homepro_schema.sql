-- HomePro Database Schema
-- PostgreSQL (Supabase)

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Service categories table
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Service providers table
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
    description TEXT,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    profile_image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AVAILABILITY & SCHEDULING
-- ============================================

-- Provider availability - defines when providers work
CREATE TABLE provider_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_provider_day_time UNIQUE (provider_id, day_of_week, start_time, end_time)
);

-- ============================================
-- BOOKINGS & PAYMENTS
-- ============================================

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE RESTRICT,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    service_date DATE NOT NULL,
    service_time TIME NOT NULL,
    estimated_hours DECIMAL(3, 1) NOT NULL CHECK (estimated_hours >= 0.5 AND estimated_hours <= 8.0), -- Min 30min, Max 8hrs
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    stripe_payment_id VARCHAR(255), -- Mock: "test_ch_xxxxx"
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50) DEFAULT 'card',
    transaction_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User & Address indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_primary ON addresses(user_id, is_primary) WHERE is_primary = TRUE;

-- Service provider indexes
CREATE INDEX idx_providers_category ON service_providers(category_id);
CREATE INDEX idx_providers_rating ON service_providers(rating DESC);
CREATE INDEX idx_providers_active ON service_providers(is_active) WHERE is_active = TRUE;

-- Availability indexes
CREATE INDEX idx_availability_provider ON provider_availability(provider_id);
CREATE INDEX idx_availability_day ON provider_availability(day_of_week);
CREATE INDEX idx_availability_active ON provider_availability(provider_id, is_active) WHERE is_active = TRUE;

-- Booking indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(service_date);
CREATE INDEX idx_bookings_datetime ON bookings(service_date, service_time);
CREATE INDEX idx_bookings_provider_date ON bookings(provider_id, service_date, service_time);

-- Payment indexes
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Review indexes
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON service_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON provider_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update provider rating when new review is added
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_providers
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE provider_id = NEW.provider_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE provider_id = NEW.provider_id
        )
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update provider rating
CREATE TRIGGER update_rating_on_review AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Function to ensure only one primary address per user
CREATE OR REPLACE FUNCTION ensure_single_primary_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE addresses
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for primary address constraint
CREATE TRIGGER enforce_single_primary_address BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION ensure_single_primary_address();

-- ============================================
-- SEED DATA FOR TESTING
-- ============================================

-- Insert service categories
INSERT INTO service_categories (name, description, icon_url, display_order) VALUES
('Plumbing', 'Professional plumbing services for repairs and installations', 'https://example.com/icons/plumbing.svg', 1),
('Electrical', 'Licensed electricians for home and commercial work', 'https://example.com/icons/electrical.svg', 2),
('Cleaning', 'Professional cleaning services for homes and offices', 'https://example.com/icons/cleaning.svg', 3),
('Spa & Massage', 'Relaxing spa treatments and therapeutic massage', 'https://example.com/icons/spa.svg', 4),
('Carpentry', 'Custom woodwork and furniture repair', 'https://example.com/icons/carpentry.svg', 5),
('Chef Services', 'Personal chefs for events and meal preparation', 'https://example.com/icons/chef.svg', 6),
('Painting', 'Interior and exterior painting services', 'https://example.com/icons/painting.svg', 7),
('HVAC', 'Heating, ventilation, and air conditioning services', 'https://example.com/icons/hvac.svg', 8);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE addresses IS 'User saved addresses for service delivery';
COMMENT ON TABLE service_categories IS 'Categories of services offered (Plumbing, Spa, etc.)';
COMMENT ON TABLE service_providers IS 'Service providers registered in the system';
COMMENT ON TABLE provider_availability IS 'Weekly recurring availability schedule for providers';
COMMENT ON TABLE bookings IS 'Service bookings made by users';
COMMENT ON TABLE payments IS 'Payment records for bookings (includes mock Stripe payments)';
COMMENT ON TABLE reviews IS 'User reviews and ratings for completed services';

COMMENT ON COLUMN provider_availability.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN bookings.estimated_hours IS 'User-selected estimated duration (0.5 to 8.0 hours)';
COMMENT ON COLUMN bookings.status IS 'Booking lifecycle: pending -> confirmed -> in_progress -> completed/cancelled';
COMMENT ON COLUMN payments.stripe_payment_id IS 'Stripe payment intent ID (mock: test_ch_xxxxx)';
