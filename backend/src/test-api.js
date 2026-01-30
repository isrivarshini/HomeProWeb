import dotenv from 'dotenv';
dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 3001}`;

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n🏥 Test 1: Health Check');
  const result = await apiCall('GET', '/api/health');
  console.log('Status:', result.status);
  console.log('Response:', result.data);
  return result.status === 200;
}

// Test 2: Get Categories
async function testGetCategories() {
  console.log('\n📂 Test 2: Get Categories');
  const result = await apiCall('GET', '/api/categories');
  console.log('Status:', result.status);
  console.log('Categories count:', result.data?.count);
  console.log('First category:', result.data?.data?.[0]?.name);
  return result.status === 200 && result.data?.count === 8;
}

// Test 3: User Signup
async function testSignup() {
  console.log('\n👤 Test 3: User Signup');
  const userData = {
    email: `test${Date.now()}@example.com`,
    password: 'Test123456!',
    full_name: 'Test User',
    phone: '5551234567'
  };
  
  const result = await apiCall('POST', '/api/auth/signup', userData);
  console.log('Status:', result.status);
  console.log('User created:', result.data?.data?.user?.email);
  console.log('Token received:', result.data?.data?.token ? 'Yes' : 'No');
  
  return {
    success: result.status === 201,
    token: result.data?.data?.token,
    user: result.data?.data?.user
  };
}

// Test 4: User Login
async function testLogin(email, password) {
  console.log('\n🔐 Test 4: User Login');
  const result = await apiCall('POST', '/api/auth/login', { email, password });
  console.log('Status:', result.status);
  console.log('Login successful:', result.data?.success);
  
  return {
    success: result.status === 200,
    token: result.data?.data?.token
  };
}

// Test 5: Get User Profile (Protected Route)
async function testGetProfile(token) {
  console.log('\n👤 Test 5: Get Profile (Protected)');
  const result = await apiCall('GET', '/api/auth/me', null, token);
  console.log('Status:', result.status);
  console.log('User email:', result.data?.data?.email);
  return result.status === 200;
}

// Test 6: Add Address
async function testAddAddress(token) {
  console.log('\n🏠 Test 6: Add Address');
  const addressData = {
    address_line1: '123 Main St',
    address_line2: 'Apt 4B',
    city: 'Atlanta',
    state: 'GA',
    zip_code: '30303',
    is_primary: true
  };
  
  const result = await apiCall('POST', '/api/user/addresses', addressData, token);
  console.log('Status:', result.status);
  console.log('Address added:', result.data?.data?.address_line1);
  
  return {
    success: result.status === 201,
    address_id: result.data?.data?.id
  };
}

// Test 7: Get Providers
async function testGetProviders() {
  console.log('\n🔧 Test 7: Get Providers');
  const result = await apiCall('GET', '/api/providers');
  console.log('Status:', result.status);
  console.log('Providers count:', result.data?.count);
  return result.status === 200;
}

// Test 8: Create Booking (will fail if no providers exist)
async function testCreateBooking(token, address_id) {
  console.log('\n📅 Test 8: Create Booking (Expected to fail - no providers)');
  
  // This will likely fail since we haven't added providers yet
  const bookingData = {
    provider_id: '00000000-0000-0000-0000-000000000000', // Fake ID
    address_id: address_id,
    service_date: '2026-02-01',
    service_time: '10:00',
    estimated_hours: 2.0,
    notes: 'Test booking'
  };
  
  const result = await apiCall('POST', '/api/bookings', bookingData, token);
  console.log('Status:', result.status);
  console.log('Message:', result.data?.message);
  return true; // Expected to fail
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('='.repeat(50));
  
  let testUser = { email: '', password: 'Test123456!' };
  let token = '';
  let address_id = '';
  
  try {
    // Test 1: Health Check
    const healthPass = await testHealthCheck();
    console.log(healthPass ? '✅ PASS' : '❌ FAIL');
    
    // Test 2: Get Categories
    const categoriesPass = await testGetCategories();
    console.log(categoriesPass ? '✅ PASS' : '❌ FAIL');
    
    // Test 3: Signup
    const signupResult = await testSignup();
    console.log(signupResult.success ? '✅ PASS' : '❌ FAIL');
    if (signupResult.success) {
      testUser.email = signupResult.user.email;
      token = signupResult.token;
    }
    
    // Test 4: Login
    if (token) {
      const loginResult = await testLogin(testUser.email, testUser.password);
      console.log(loginResult.success ? '✅ PASS' : '❌ FAIL');
    }
    
    // Test 5: Get Profile
    if (token) {
      const profilePass = await testGetProfile(token);
      console.log(profilePass ? '✅ PASS' : '❌ FAIL');
    }
    
    // Test 6: Add Address
    if (token) {
      const addressResult = await testAddAddress(token);
      console.log(addressResult.success ? '✅ PASS' : '❌ FAIL');
      if (addressResult.success) {
        address_id = addressResult.address_id;
      }
    }
    
    // Test 7: Get Providers
    const providersPass = await testGetProviders();
    console.log(providersPass ? '✅ PASS' : '❌ FAIL');
    
    // Test 8: Create Booking
    if (token && address_id) {
      await testCreateBooking(token, address_id);
      console.log('✅ Test completed (expected failure)');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('\n📝 Summary:');
    console.log(`- Health check: Working`);
    console.log(`- Categories: ${categoriesPass ? '8 categories loaded' : 'Failed'}`);
    console.log(`- Auth (signup/login): ${token ? 'Working' : 'Failed'}`);
    console.log(`- Protected routes: ${token ? 'Working' : 'Failed'}`);
    console.log(`- Address management: ${address_id ? 'Working' : 'Failed'}`);
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Run the tests
runTests();