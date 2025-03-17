import React from 'react';
import './App.css';
import ConnectionTest from './components/test/ConnectionTest';
import ReduxTest from './components/test/ReduxTest';

function App() {
  return (
    <div className="App">
      <main>
        <ConnectionTest />
      </main>
      <ReduxTest/ >
      {}
    </div>
  );
}

export default App;