import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedProvider, setSelectedProvider] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoginError('');
    const { email, password } = credentials;
    if (!email || !password || !selectedProvider) {
      setLoginError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Needed for cookies!
        body: JSON.stringify({ email, password, provider: selectedProvider }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed.');
      }
      router.push('/dashboard');
    } catch (err) {
      setLoginError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={credentials.password}
        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
        required
      />
      <select
        value={selectedProvider}
        onChange={e => setSelectedProvider(e.target.value)}
        required
      >
        <option value="">Select Provider</option>
        <option value="google">Google</option>
        <option value="email">Email</option>
        {/* Add more providers if needed */}
      </select>
      <button type="submit">Login</button>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
    </form>
  );
}