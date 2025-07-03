async function handleSubmit(e) {
  e.preventDefault();
  setLoginError('');
  const { email, password } = credentials;
  if (!email || !password || !selectedProvider) {
    setLoginError('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', { // Update this URL as needed
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies!
      body: JSON.stringify({ email, password, provider: selectedProvider }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed.');
    }
    // Optionally, check for the session cookie here
    router.push('/dashboard'); // Only redirect if login is successful
  } catch (err) {
    setLoginError(err.message);
  }
}