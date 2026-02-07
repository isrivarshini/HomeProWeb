<p align="center">**HomePro - Home Services Booking Platform**</p>


A modern, full-stack web application for booking professional home services. Built with a sleek dark theme, glassmorphism UI, and smooth animations.

<img width="1457" height="713" alt="Screenshot 2026-02-06 at 3 53 34 PM" src="https://github.com/user-attachments/assets/7ae89356-c22b-431e-a847-60463278b274" />

## 🌟 Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Service Categories** - Browse 8 categories: Plumbing, Electrical, Cleaning, Spa, Carpentry, Chef Services, Painting, HVAC
- **Modern UI** - Dark theme with purple gradients and glassmorphism effects
- **Animated Experience** - Smooth transitions and grain texture overlay
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Updates** - Supabase real-time for booking notifications

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router v6** - Client-side routing
- **Satoshi Font** - Custom typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Supabase (PostgreSQL)** - Database hosting
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database
- **Supabase** - Backend-as-a-Service
- **Real-time Subscriptions** - Live data updates

## 📁 Project Structure

```
homepro/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js           # Supabase client setup
│   │   │   └── constants.js          # App constants
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── bookingController.js  # Booking CRUD operations
│   │   │   ├── providerController.js # Provider & category logic
│   │   │   └── userController.js     # User profile management
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Global error handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   ├── bookingRoutes.js      # Booking endpoints
│   │   │   ├── providerRoutes.js     # Provider endpoints
│   │   │   └── userRoutes.js         # User endpoints
│   │   ├── utils/
│   │   │   ├── calculateAmount.js    # Booking calculations
│   │   │   ├── generateToken.js      # JWT token generation
│   │   │   └── hashPassword.js       # Password hashing
│   │   ├── server.js                 # Express app entry point
│   │   └── test-api.js               # API testing script
│   ├── .env                          # Environment variables (not in git)
│   ├── .env.example                  # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── API_DOCUMENTATION.md          # API reference docs
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                   # Images, icons
│   │   ├── components/
│   │   │   ├── CategoryGrid.jsx      # Service categories grid
│   │   │   ├── GrainOverlay.jsx      # Grain texture animation
│   │   │   └── Navbar.jsx            # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Home page
│   │   │   ├── LoginPage.jsx         # Login form
│   │   │   └── SignupPage.jsx        # Signup form
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── styles/
│   │   │   ├── fonts.css             # Satoshi font imports
│   │   │   ├── GlobalStyles.jsx      # Global CSS
│   │   │   └── theme.js              # MUI theme config
│   │   ├── utils/                    # Helper functions
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # App entry point
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md                         # This file
```

## 🗄️ Database Schema

### Tables

1. **users** - User accounts
2. **addresses** - User saved addresses
3. **service_categories** - Service types (8 categories)
4. **service_providers** - Service provider profiles
5. **provider_availability** - Provider work schedules
6. **bookings** - Service bookings
7. **payments** - Payment records
8. **reviews** - User reviews and ratings

### Key Relationships

- Users → Addresses (One-to-Many)
- Users → Bookings (One-to-Many)
- Providers → Bookings (One-to-Many)
- Bookings → Payments (One-to-One)
- Bookings → Reviews (One-to-One)

## 🎨 Design System

### Colors

```javascript
// Dark Theme
Background: #0A0A0A (Pure black)
Card Background: rgba(255, 255, 255, 0.03) (Glass)
Primary: #8B5CF6 (Purple)
Secondary: #6366F1 (Indigo)
Text Primary: #FFFFFF (White)
Text Secondary: #A1A1AA (Gray)
```

### Typography

**Font:** Satoshi
- **Light (300)** - Subtle text
- **Regular (400)** - Body text
- **Medium (500)** - Subheadings
- **Bold (700)** - Headings
- **Black (900)** - Hero text

### Components

- **Glassmorphism Cards** - Frosted glass effect with backdrop blur
- **Gradient Orbs** - Animated purple gradients
- **Grain Overlay** - Film grain texture for premium feel

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Categories & Providers
- `GET /api/categories` - List all categories
- `GET /api/providers` - List providers (filter by category)
- `GET /api/providers/:id` - Get provider details
- `GET /api/providers/:id/availability` - Check availability

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking details (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

### User Profile
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update profile (Protected)
- `GET /api/user/addresses` - Get addresses (Protected)
- `POST /api/user/addresses` - Add address (Protected)
- `PUT /api/user/addresses/:id` - Update address (Protected)
- `DELETE /api/user/addresses/:id` - Delete address (Protected)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/homepro.git
cd homepro
```

2. **Set up Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Add your Supabase credentials to .env
```

3. **Set up Database**
- Create a Supabase project at [supabase.com](https://supabase.com)
- Run the SQL schema from `backend/homepro_schema.sql` in Supabase SQL Editor
- Enable real-time for bookings table

4. **Set up Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Testing

**Test Backend API:**
```bash
cd backend
node src/test-api.js
```

**Expected output:**
- ✅ Health check: PASS
- ✅ Categories: 8 loaded
- ✅ Auth (signup/login): Working
- ✅ Protected routes: Working

## 🔒 Environment Variables

### Backend (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Stripe (Mock)
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_PUBLISHABLE_KEY=pk_test_mock
```

## 🎯 Key Features Implementation

### Authentication Flow
1. User signs up → Password hashed with bcrypt
2. JWT token generated and returned
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Middleware verifies token before accessing protected endpoints

### Booking Flow
1. User browses categories
2. Selects provider
3. Checks availability
4. Fills booking form (date, time, address)
5. Calculates amount (hourly_rate × estimated_hours)
6. Creates booking with 'pending' status
7. Mock payment processed
8. Real-time notification sent

### Real-time Updates
- Supabase real-time enabled on `bookings` table
- Frontend listens for status changes
- Shows notifications when booking confirmed

## 🎨 UI Highlights

### Landing Page
- Hero section with animated gradient orbs
- Grain texture overlay
- "Trusted by 10,000+ customers" badge
- Category grid with hover effects
- Stats section (500+ providers, 10k+ customers)

### Category Cards
- Glassmorphism effect
- Smooth hover animations
- Emoji icons
- Uniform sizing (220px height)
- Purple gradient on hover

### Auth Pages
- Consistent dark theme
- Form validation
- Show/hide password toggle
- Error handling with styled alerts
- Back navigation

## 📝 Development Notes

### Code Organization
- **Controllers** - Business logic
- **Routes** - API endpoints
- **Middleware** - Auth, validation, error handling
- **Utils** - Helper functions
- **Components** - Reusable UI elements
- **Pages** - Full page views

### Best Practices
- JWT for stateless authentication
- Bcrypt for password hashing (10 salt rounds)
- Input validation on both frontend and backend
- Error handling with try-catch blocks
- RESTful API design
- Component-based architecture
- Responsive design with MUI breakpoints

## 🐛 Known Issues & TODs

### Current Limitations
- [ ] No provider availability implementation yet
- [ ] Booking flow incomplete (no provider selection page)
- [ ] No user dashboard
- [ ] Payment integration is mocked
- [ ] No image upload for profiles

### Planned Features
- [ ] Provider detail page with calendar
- [ ] Multi-step booking wizard
- [ ] User dashboard (My Bookings)
- [ ] Reviews and ratings display
- [ ] Search and filter functionality
- [ ] Email notifications
- [ ] Admin panel for providers

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)
```bash
cd backend

# Push to GitHub
# Connect repository in Railway/Render dashboard
# Set environment variables
# Deploy
```

### Database
- Already hosted on Supabase
- No additional deployment needed

## 📚 Documentation

- [API Documentation](backend/API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](backend/homepro_schema.sql) - SQL schema with comments
- [Supabase Setup Guide](backend/SUPABASE_SETUP_GUIDE.md) - Step-by-step database setup

## 🤝 Contributing

This is a portfolio project. Feel free to fork and modify for your own use.

## 📄 License

MIT License - Feel free to use this project for learning and portfolio purposes.

## 👤 Author

**Sri Varshini Nakollu**
- MS Computer Science, University of Georgia (May 2025)
- Product Manager Intern @ ABE Scott Enterprises
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]
- Portfolio: [Your Portfolio]

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
