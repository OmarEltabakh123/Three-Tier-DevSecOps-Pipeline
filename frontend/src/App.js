import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://backend-service:80') // اسم الـ Service بتاع الـ Backend
      .then(response => setMessage(response.data))
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to connect to Backend');
      });
  }, []);

  return (
    <div className="App">
      <h1>Three-Tier App - Frontend</h1>
      {message && <p>Message from Backend: {message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default App;