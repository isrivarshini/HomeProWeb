<img width="1457" height="713" alt="Screenshot 2026-02-06 at 3 53 34 PM" src="https://github.com/user-attachments/assets/7ae89356-c22b-431e-a847-60463278b274" />

# HomePro - Professional Home Services Platform

A modern, full-stack web application for booking professional home services with real-time updates, Stripe payments, and Google OAuth authentication.

🌐 **Live Demo:** https://homeproweb.vercel.app

📡 **API Backend:** https://homeproweb-production.up.railway.app

---

## 🎯 Project Overview

HomePro is a comprehensive home services booking platform that connects users with verified service providers across 8 categories including plumbing, electrical, cleaning, spa services, and more. The platform features a modern dark-themed UI with glassmorphism effects, smooth animations, and a complete booking-to-payment workflow.

**Built by:** Sri Varshini Nakollu  
**Timeline:** February 2026  
**Purpose:** Full-stack portfolio project & MS Computer Science capstone

---

## ✨ Key Features

### User Features
- ✅ **Authentication System**
  - JWT-based email/password authentication
  - Google OAuth integration via Supabase
  - Secure password hashing with bcrypt
  - Protected routes with middleware

- ✅ **Service Discovery**
  - Browse 8 service categories with images
  - Advanced search and filtering
  - Sort by rating, price, or reviews
  - Real-time availability checking

- ✅ **Booking Management**
  - Create bookings with date/time selection
  - Address management (add, edit, delete)
  - View booking history with status filters
  - Cancel pending bookings with reason tracking

- ✅ **Payment Processing**
  - Real Stripe integration (test mode)
  - Secure card payment handling
  - Payment confirmation and receipt generation
  - Automatic booking status updates

- ✅ **Review System**
  - Rate providers (1-5 stars)
  - Write detailed reviews
  - View provider reviews on detail pages
  - Auto-update provider ratings

### Technical Features
- ✅ **Modern UI/UX**
  - Dark theme with purple gradient accents
  - Glassmorphism cards and effects
  - Grain texture overlay
  - Smooth Framer Motion animations
  - Loading skeletons for better UX
  - Mobile responsive design

- ✅ **Real-time Updates**
  - Supabase real-time subscriptions
  - Live booking status changes
  - Instant notification system

---

## 🚀 Tech Stack

### Frontend
- **React 18** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library with custom dark theme
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **React Router v6** - Client-side routing
- **Stripe.js** - Payment processing UI
- **Supabase Client** - Real-time subscriptions and OAuth

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web server framework
- **Supabase (PostgreSQL)** - Database and authentication
- **Stripe API** - Payment processing
- **JWT** - Token-based authentication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **Supabase** - Backend-as-a-Service
  - Row Level Security (RLS)
  - Real-time subscriptions
  - OAuth providers

### Deployment
- **Frontend:** Vercel (Auto-deploy from GitHub)
- **Backend:** Railway (Docker container)
- **Database:** Supabase Cloud (US East)

---

## 📊 Database Architecture

### 8-Table Relational Schema

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
```

**Key Design Decisions:**
- **UUIDs** for primary keys (security & distributed systems)
- **Composite indexes** for conflict detection
- **Database triggers** for auto-calculating ratings
- **Row Level Security** for data isolation
- **Foreign key constraints** for referential integrity

---

## 🔗 API Architecture

### 17 RESTful Endpoints

**Authentication** (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login with credentials
- `GET /me` - Get current user (Protected)

**Categories & Providers** (`/api`)
- `GET /categories` - List all service categories
- `GET /providers?category_id=xxx` - List providers with filters
- `GET /providers/:id` - Get provider details
- `GET /providers/:id/availability` - Check availability

**Bookings** (`/api/bookings`)
- `POST /` - Create new booking (Protected)
- `GET /` - Get user's bookings (Protected)
- `GET /:id` - Get booking details (Protected)
- `PUT /:id/cancel` - Cancel booking (Protected)

**User Profile** (`/api/user`)
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update profile (Protected)
- `GET /addresses` - Get saved addresses (Protected)
- `POST /addresses` - Add address (Protected)
- `PUT /addresses/:id` - Update address (Protected)
- `DELETE /addresses/:id` - Delete address (Protected)

**Payments** (`/api/payments`)
- `POST /create-payment-intent` - Initialize Stripe payment (Protected)
- `POST /confirm-payment` - Confirm payment and update booking (Protected)

**Reviews** (`/api/reviews`)
- `POST /` - Create review (Protected)
- `GET /provider/:provider_id` - Get provider reviews (Public)

---

## 🎨 Design System

### Colors
```javascript
Primary: #8B5CF6 (Purple)
Secondary: #6366F1 (Indigo)
Background: #0A0A0A (Pure Black)
Card Background: rgba(255, 255, 255, 0.03) (Glass)
Text Primary: #FFFFFF (White)
Text Secondary: #A1A1AA (Gray)
```

### Typography
**Font:** Satoshi (Fallback: Inter, system fonts)
- **Black (900)** - Hero headings
- **Bold (700)** - Section titles
- **Medium (500-600)** - Subheadings
- **Regular (400)** - Body text
- **Light (300)** - Subtle text

### Components
- Glassmorphism cards with backdrop blur
- Animated gradient orbs
- Film grain texture overlay
- Loading skeletons
- Smooth page transitions

---

## 📁 Project Structure

```
homepro/
├── backend/                      # Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js      # Supabase client
│   │   │   └── constants.js     # App constants
│   │   ├── controllers/         # Business logic
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── providerController.js
│   │   │   ├── userController.js
│   │   │   ├── paymentController.js
│   │   │   └── reviewController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification
│   │   │   └── errorHandler.js  # Global error handling
│   │   ├── routes/              # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── providerRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── reviewRoutes.js
│   │   └── server.js            # Express app entry
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/                     # React/Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── GrainOverlay.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Logo/
│   │   │   │   └── Logo.jsx
│   │   │   └── ProviderCardSkeleton.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ProvidersListPage.jsx
│   │   │   ├── ProviderDetailPage.jsx
│   │   │   ├── BookingDetailPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── CreateReviewPage.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Axios API client
│   │   │   └── supabase.js      # Supabase client
│   │   ├── styles/
│   │   │   ├── GlobalStyles.jsx
│   │   │   └── theme.js         # MUI theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.production          # Production env vars
│
└── README.md
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier)
- Stripe account (test mode)
- Google Cloud Console (for OAuth)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/homepro.git
cd homepro
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your credentials:
# SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
# JWT_SECRET, JWT_EXPIRE
# STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
# FRONTEND_URL

# Run Supabase schema
# Go to Supabase SQL Editor and run homepro_schema.sql

# Start server
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_..." >> .env.local
echo "VITE_SUPABASE_URL=https://xxx.supabase.co" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Start dev server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/

---

## 🚢 Deployment Guide

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy (auto-deploys on push)

### Backend (Railway)
1. Push code to GitHub
2. Create new project in Railway
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables (see backend/.env.example)
6. Deploy (auto-deploys on push)

### Database (Supabase)
1. Create project at supabase.com
2. Run SQL schema in SQL Editor
3. Enable Row Level Security
4. Configure OAuth providers
5. Enable real-time for bookings table

---

## 🧪 Testing

### Test Credentials
**Email Login:**
- Any valid email/password combination you create

**Google OAuth:**
- Use your Google account

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits

---

## 🎯 Key Technical Achievements

### 1. Security Implementation
- JWT token-based authentication with 7-day expiry
- Bcrypt password hashing (10 salt rounds)
- Row Level Security policies in database
- Protected API routes with middleware
- CORS configuration for production
- Secure payment processing with Stripe

### 2. Performance Optimizations
- Lazy loading of Stripe SDK
- Image optimization with CDN
- Database indexing strategy (18 indexes)
- Loading skeletons for perceived performance
- Debounced search functionality
- Composite indexes for complex queries

### 3. Real-world Features
- Real Stripe payment integration (not mock)
- Google OAuth for social login
- Email validation and sanitization
- Error handling with user-friendly messages
- Form validation on frontend and backend
- Automatic booking status updates

### 4. Scalability Considerations
- Stateless JWT authentication
- RESTful API design
- Decoupled frontend/backend
- Environment-based configuration
- Database connection pooling ready
- Modular code architecture

---

## 📈 Future Enhancements

### Short-term (1-2 weeks)
- [ ] Email notifications (SendGrid)
- [ ] Real-time chat between user/provider
- [ ] Provider dashboard
- [ ] Admin panel
- [ ] Booking calendar view
- [ ] Image upload for profiles
- [ ] Forgot password flow

### Long-term (1-3 months)
- [ ] Mobile app (React Native)
- [ ] AI-powered provider recommendations
- [ ] Dynamic pricing based on demand
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Subscription plans for providers
- [ ] Loyalty rewards program

---

## 🐛 Known Issues & Limitations

### Current State
- Font loading CORS warning (non-breaking)
- Test mode Stripe only (no live payments yet)
- No email verification on signup
- No password reset functionality
- Review editing not implemented
- Provider availability is weekly recurring only

### Won't Fix (By Design)
- No provider self-registration (admin-managed)
- No instant booking (requires confirmation)
- No in-app messaging (future feature)

---

## 📚 Lessons Learned

### Technical Insights
1. **Database Design:** Proper normalization and indexing crucial for query performance
2. **Authentication:** JWT + OAuth provides good security/UX balance
3. **Payment Integration:** Stripe webhooks needed for production reliability
4. **CORS:** Environment-specific configuration prevents deployment headaches
5. **State Management:** Context API sufficient for small-medium apps

### Development Process
1. **Start with MVP:** Built core features first, added polish later
2. **Test Early:** Supabase + Railway made testing in production easy
3. **Documentation:** Writing README while building helped clarify architecture
4. **Git Workflow:** Separate repos for frontend/backend simplified deployment

---

## 👤 About the Developer

**Sri Varshini Nakollu**
- MS Computer Science, University of Georgia (May 2025)
- Product Manager Intern @ ABE Scott Enterprises
- Passionate about building user-centric, scalable web applications

**Connect:**
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]
- Email: [Your Email]
- Portfolio: [Your Portfolio]

---

## 📄 License

MIT License - Free to use for learning and portfolio purposes.

---

## 🙏 Acknowledgments

- Design inspiration: Comet AI, Limitless, Linear
- UI Components: Material-UI team
- Database: Supabase team
- Icons: Material Icons
- Font: Satoshi by Indian Type Foundry
- Deployment: Vercel & Railway teams

---

**⭐ If you found this project helpful, please star the repository!**

**Built with ❤️ using React, Node.js, PostgreSQL, and Stripe**
