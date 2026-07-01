
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

const FloatingHomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  // Don't show the button if we are already on the home page
  if (location.pathname === '/') return null;

  return (
    <button 
      onClick={() => navigate('/')}
      className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white/90 shadow-lg shadow-black/5 backdrop-blur transition-all group hover:border-primary hover:bg-primary"
      title={t('floatingHome.back')}
      aria-label={t('floatingHome.home')}
    >
      <span className="material-symbols-outlined text-text-secondary group-hover:text-white transition-colors">home</span>
    </button>

  );
};

export default FloatingHomeButton;
