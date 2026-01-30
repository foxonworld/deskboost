
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingHomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the button if we are already on the home page
  if (location.pathname === '/') return null;

  return (
    <button 
      onClick={() => navigate('/')}
      className="fixed top-4 left-4 z-[60] bg-white/90 backdrop-blur border border-gray-200 size-10 rounded-full shadow-lg hover:bg-primary hover:border-primary transition-all flex items-center justify-center group"
      title="Back to Home"
      aria-label="Home"
    >
      <span className="material-symbols-outlined text-text-secondary group-hover:text-text-main transition-colors">home</span>
    </button>
  );
};

export default FloatingHomeButton;
