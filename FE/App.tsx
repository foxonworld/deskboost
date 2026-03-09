
import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import FloatingHomeButton from './components/FloatingHomeButton';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <FloatingHomeButton />
        <ThemeToggle />
        <AppRouter />
      </div>
    </HashRouter>
  );
};

export default App;
