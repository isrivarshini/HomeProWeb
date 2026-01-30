import { hashPassword, comparePassword } from './utils/hashPassword.js';
import { generateToken, verifyToken } from './utils/generateToken.js';
import { calculateBookingAmount } from './utils/calculateAmount.js';
import dotenv from 'dotenv';
dotenv.config(); // Add this line


// Test password hashing
const testPassword = async () => {
  console.log('\n🔐 Testing password hashing...');
  const password = 'test123';
  const hashed = await hashPassword(password);
  const isMatch = await comparePassword(password, hashed);
  console.log('✅ Password hash:', isMatch ? 'PASS' : 'FAIL');
};

// Test JWT token
const testToken = () => {
  console.log('\n🎫 Testing JWT token...');
  const userId = 'test-user-id';
  const token = generateToken(userId);
  const decoded = verifyToken(token);
  console.log('✅ Token generation:', decoded.id === userId ? 'PASS' : 'FAIL');
};

// Test amount calculation
const testAmount = () => {
  console.log('\n💰 Testing amount calculation...');
  const amount = calculateBookingAmount(50, 2.5);
  console.log('✅ Amount calculation:', amount === 125 ? 'PASS' : 'FAIL');
};

// Run tests
(async () => {
  await testPassword();
  testToken();
  testAmount();
  console.log('\n✅ All utility tests completed!\n');
})();