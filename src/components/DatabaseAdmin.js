// src/components/DatabaseAdmin.js
import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/api';

const DatabaseAdmin = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check database connection when component mounts
    const checkConnection = async () => {
      try {
        const status = await databaseService.checkConnection();
        setConnectionStatus(status);
        setLoading(false);
      } catch (err) {
        setError(`Connection error: ${err.message}`);
        setLoading(false);
      }
    };

    const fetchTables = async () => {
      try {
        const data = await databaseService.getTables();
        setTables(data);
      } catch (err) {
        setError(`Failed to fetch tables: ${err.message}`);
      }
    };

    checkConnection();
    fetchTables();
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <h2 style={{ marginBottom: '15px' }}>Database Connection Status</h2>
      
      {loading ? (
        <p>Checking connection...</p>
      ) : connectionStatus ? (
        <div style={{ backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>
          <p>Status: <strong style={{ color: 'green' }}>Connected</strong></p>
          <p>Server Time: {connectionStatus.server_time}</p>
          <p>{connectionStatus.message}</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffebeb', padding: '10px', borderRadius: '5px' }}>
          <p>Status: <strong style={{ color: 'red' }}>Disconnected</strong></p>
          {error && <p>Error: {error}</p>}
        </div>
      )}

      <h2 style={{ marginTop: '20px', marginBottom: '15px' }}>Database Tables</h2>
      {tables.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tables.map((table, index) => (
            <li key={index} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              {table.table_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tables found or loading...</p>
      )}
    </div>
  );
};

export default DatabaseAdmin;