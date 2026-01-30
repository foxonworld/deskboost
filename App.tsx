
import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import FloatingHomeButton from './components/FloatingHomeButton';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <FloatingHomeButton />
        <AppRouter />
      </div>
    </HashRouter>
  );
};

export default App;
