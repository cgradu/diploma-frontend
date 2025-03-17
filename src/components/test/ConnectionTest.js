// src/components/ConnectionTest.js
import React, { useState } from 'react';
import axios from 'axios';

function ConnectionTest() {
  const [status, setStatus] = useState('Not tested');
  const [message, setMessage] = useState('');
  
  const testConnection = async () => {
    setStatus('Testing...');
    try {
      const response = await axios.get('/db-status');
      setStatus('Connected');
      setMessage(`Server time: ${response.data.server_time}`);
    } catch (error) {
      setStatus('Failed');
      setMessage(error.message);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd' }}>
      <h3>Backend Connection Test</h3>
      <button 
        onClick={testConnection}
        style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Test Connection
      </button>
      <div style={{ marginTop: '10px' }}>
        <p>Status: <strong>{status}</strong></p>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default ConnectionTest;