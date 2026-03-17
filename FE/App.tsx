
import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import FloatingHomeButton from './components/FloatingHomeButton';
import ThemeToggle from './components/ThemeToggle';
import { CartProvider } from './context/CartContext';
import { CareProvider } from './context/CareContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <CartProvider>
        <CareProvider>
          <div className="min-h-screen flex flex-col transition-colors duration-300">
            <FloatingHomeButton />
            <ThemeToggle />
            <AppRouter />
          </div>
        </CareProvider>
      </CartProvider>
    </HashRouter>
  );
};

export default App;
