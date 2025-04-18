'use client';

export default function SimplePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Simple Test Page</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          If you can see this page, Next.js is working correctly!
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/register" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '5px',
              textDecoration: 'none',
              marginRight: '10px'
            }}
          >
            Register
          </a>
          <a 
            href="/login" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#4f46e5',
              border: '1px solid #4f46e5',
              borderRadius: '5px',
              textDecoration: 'none'
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
