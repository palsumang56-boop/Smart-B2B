// test-auth.js

async function runAuthTests() {
  const baseUrl = 'http://localhost:5000/api/auth';
  
  // We use a random number so you can run this test multiple times without "Email already in use" errors
  const randomId = Math.floor(Math.random() * 10000);
  const testEmail = `wholesaler${randomId}@b2b.com`;

  try {
    console.log('--- 1. Testing User Registration ---');
    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Wholesaler',
        email: testEmail,
        password: 'securepassword123',
        role: 'WHOLESALER'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Status:', registerResponse.status);
    console.log('Response:', registerData);

    console.log('\n--- 2. Testing User Login ---');
    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'securepassword123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Status:', loginResponse.status);
    console.log('Response:', loginData);

    if (loginData.token) {
      console.log('\n🎉 SUCCESS! JWT Token successfully generated:');
      console.log(loginData.token);
    } else {
      console.log('\n❌ Failed to generate token.');
    }

  } catch (error) {
    console.error('Test script failed. Is your server running?', error.message);
  }
}

runAuthTests();