async function test() {
  try {
    const loginRes = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@artloop.com', password: 'admin' })
    });
    const loginData = await loginRes.json();
    console.log("LOGIN:", loginData);
    
    if (loginData.token) {
      const meRes = await fetch('http://localhost:8000/api/auth/me', {
        headers: { 'x-auth-token': loginData.token }
      });
      const meData = await meRes.json();
      console.log("ME:", meData);
    }
  } catch (e) {
    console.error(e);
  }
}
test();
