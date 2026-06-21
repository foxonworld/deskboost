import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CareNotificationBell from './CareNotificationBell';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';
import AppDownloadButton from './AppDownloadButton';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isBootstrapping, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();
  const isMobileApp = import.meta.env.VITE_MOBILE_APP === 'true';
  const isActive = (path) => location.pathname === path;
  const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN';

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate('/', { replace: true });
  };

  const baseMobileLink = 'flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-colors';
  const avatarUrl = user?.avatarUrl;

  return (
    <header className="sticky top-0 z-[100] w-full pt-3 pb-2 px-3 sm:px-4 transition-colors">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-2 md:gap-4 rounded-full border border-white/50 bg-white/70 px-3 py-2.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-[#2A4532]/50 dark:bg-surface-dark/70 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-colors">
        
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-text-main dark:text-white shrink-0 pl-1 md:pl-2 hover:opacity-80 transition-opacity">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">potted_plant</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight hidden sm:block">DeskBoost</h2>
          </Link>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-1 justify-center shrink-0">
          <Link to="/" className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-text-main hover:bg-black/5 hover:text-primary dark:text-gray-200 dark:hover:bg-white/5'}`}>
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>{t('navbar.home')}</span>
          </Link>
          <Link to="/plants" className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${isActive('/plants') ? 'bg-primary/10 text-primary' : 'text-text-main hover:bg-black/5 hover:text-primary dark:text-gray-200 dark:hover:bg-white/5'}`}>
            <span className="material-symbols-outlined text-[20px]">local_florist</span>
            <span>{t('navbar.plants')}</span>
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-2.5 min-w-0 pr-1">
          <AppDownloadButton variant="header" />
          {isAuthenticated && <CareNotificationBell />}

          {isBootstrapping ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-primary/10" aria-label={t('navbar.authLoading')} />
          ) : !isAuthenticated ? (
            <Link to="/login" className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 sm:px-5 text-sm font-bold text-white transition-all hover:bg-primary-dark whitespace-nowrap hover:scale-[1.02]">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span>{t('navbar.login')}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              {isAdmin && !isMobileApp && (
                <Link to="/admin/overview" className={`hidden sm:inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all hover:scale-[1.02] ${location.pathname.startsWith('/admin') ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  {t('common.admin')}
                </Link>
              )}
              
              <Link to="/app/profile" className={`hidden max-w-32 truncate rounded-full px-4 py-2 text-sm font-semibold transition-colors md:block ${location.pathname.startsWith('/app') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-primary dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                {user?.name || t('common.profile')}
              </Link>
              
              <button disabled={isLoading} onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors hidden sm:inline-flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed rounded-full px-3 py-2 hover:bg-red-50 dark:hover:bg-red-500/10">
                {isLoading && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                {isLoading ? t('navbar.loggingOut') : t('navbar.logout')}
              </button>
              
              <Link to="/app/profile" aria-label={t('navbar.openProfile')} className="bg-primary/10 rounded-full w-10 h-10 hidden sm:flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-colors shrink-0 overflow-hidden hover:scale-[1.05]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name || t('common.profile')} className="h-full w-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary">person</span>
                )}
              </Link>
              
              <button
                type="button"
                aria-label={isMenuOpen ? t('navbar.closeMobileNav') : t('navbar.openMobileNav')}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((value) => !value)}
                className={`inline-flex h-10 w-10 sm:w-auto items-center justify-center sm:px-4 gap-1.5 rounded-full border border-primary/20 transition-all sm:hidden ${isMenuOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
              >
                <span className="material-symbols-outlined text-xl">{isMenuOpen ? 'close' : 'menu'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && isAuthenticated && (
        <div className="mx-auto w-[98%] sm:hidden mt-2 overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-2 shadow-[0_10px_40px_rgba(15,23,42,0.1)] backdrop-blur-2xl backdrop-saturate-150 dark:border-[#2A4532]/50 dark:bg-surface-dark/90 dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all origin-top animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-1">
            <Link onClick={closeMenu} to="/app/dashboard" className={`${baseMobileLink} ${location.pathname.startsWith('/app') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              {t('navbar.dashboard')}
            </Link>
            {isAdmin && !isMobileApp && (
              <Link onClick={closeMenu} to="/admin/overview" className={`${baseMobileLink} ${location.pathname.startsWith('/admin') ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                {t('common.admin')}
              </Link>
            )}
            <Link onClick={closeMenu} to="/plants" className={`${baseMobileLink} ${isActive('/plants') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <span className="material-symbols-outlined text-[20px]">local_florist</span>
              {t('navbar.plants')}
            </Link>
            <Link onClick={closeMenu} to="/app/profile" className={`${baseMobileLink} text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.name || t('common.profile')} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[20px]">person</span>
              )}
              {t('common.profile')}
            </Link>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
            <button disabled={isLoading} onClick={handleLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-bold text-red-500 disabled:opacity-60 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>{isLoading ? 'progress_activity' : 'logout'}</span>
              {isLoading ? t('navbar.loggingOut') : t('navbar.logout')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
