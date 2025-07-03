import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.email);
        else window.location.href = '/'; // Redirect to login if not authenticated
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user}!</p>
      {/* Place your AdobeCloudDocument or other protected components here */}
    </div>
  );
}