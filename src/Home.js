import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>🚀 Welcome to Internship App</h1>
      <p>Your Spring Boot + React Application</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Link to="/login" className="btn">Sign In</Link>
        <Link to="/register" className="btn">Create Account</Link>
      </div>
    </div>
  );
}

export default Home;