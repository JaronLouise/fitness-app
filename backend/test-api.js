// Simple test script for the backend API
// Run these tests manually using PowerShell or curl

console.log('=== Fitness App Backend API Tests ===\n');

console.log('1. Health Check:');
console.log('   Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET\n');

console.log('2. Test Protected Endpoint (should fail without token):');
console.log('   Invoke-RestMethod -Uri "http://localhost:5000/api/user/profile" -Method GET\n');

console.log('3. Test Signup Step (should fail without token):');
console.log('   Invoke-RestMethod -Uri "http://localhost:5000/api/user/signup-step" -Method PUT -ContentType "application/json" -Body \'{"step": 1, "data": {"gender": "male"}}\'\n');

console.log('4. Test with invalid token (should fail):');
console.log('   Invoke-RestMethod -Uri "http://localhost:5000/api/user/profile" -Method GET -Headers @{"Authorization"="Bearer invalid-token"}\n');

console.log('=== Expected Results ===');
console.log('✅ Health check should return: {"status": "OK", "message": "Fitness App Backend is running"}');
console.log('❌ Protected endpoints should return: {"error": "No token provided"} or {"error": "Invalid token"}');
console.log('✅ This confirms authentication middleware is working correctly\n');

console.log('=== Next Steps ===');
console.log('1. Test the frontend signup process');
console.log('2. After successful signup, test the post-signup flow');
console.log('3. Verify data is being saved to Supabase database');

