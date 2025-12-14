import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ConsentScreen } from './components/ConsentScreen';
import { Dashboard } from './components/Dashboard';

type ViewState = 'login' | 'consent' | 'dashboard';

const App = () => {
  const [view, setView] = useState<ViewState>('login');

  const handleLogin = () => {
    setView('consent');
  };

  const handleAgree = () => {
    setView('dashboard');
  };

  switch (view) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    case 'consent':
      return <ConsentScreen onAgree={handleAgree} />;
    case 'dashboard':
      return <Dashboard />;
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
};

export default App;