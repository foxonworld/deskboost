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

  const baseMobileLink = 'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors';
  const avatarUrl = user?.avatarUrl;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E4EEE6] bg-surface-light/95 backdrop-blur-sm transition-colors dark:border-[#2A4532] dark:bg-background-dark/95">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-3">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-text-main dark:text-white shrink-0">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">potted_plant</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">DeskBoost</h2>
        </Link>

        <nav className="flex items-center gap-3 md:gap-8 min-w-0">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-text-main hover:text-primary dark:text-gray-200'}`}>
              <span className="material-symbols-outlined text-lg">home</span>
              <span>{t('navbar.home')}</span>
            </Link>
            <Link to="/plants" className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors ${isActive('/plants') ? 'bg-primary/10 text-primary' : 'text-text-main hover:text-primary dark:text-gray-200'}`}>
              <span className="material-symbols-outlined text-lg">local_florist</span>
              <span>{t('navbar.plants')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <AppDownloadButton variant="header" />
            {isAuthenticated && <CareNotificationBell />}

            {isBootstrapping ? (
              <div className="h-10 w-28 animate-pulse rounded-xl bg-primary/10" aria-label={t('navbar.authLoading')} />
            ) : !isAuthenticated ? (
              <Link to="/login" className="flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-dark sm:px-4 whitespace-nowrap">
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span>{t('navbar.login')}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {isAdmin && !isMobileApp && (
                  <Link to="/admin/overview" className={`hidden sm:inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors ${location.pathname.startsWith('/admin') ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    {t('common.admin')}
                  </Link>
                )}
                <Link to="/app/profile" className={`hidden max-w-32 truncate rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:block ${location.pathname.startsWith('/app') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-primary dark:text-slate-400'}`}>{user?.name || t('common.profile')}</Link>
                <button disabled={isLoading} onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors hidden sm:inline-flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                  {isLoading ? t('navbar.loggingOut') : t('navbar.logout')}
                </button>
                <Link to="/app/profile" aria-label={t('navbar.openProfile')} className="bg-primary/10 rounded-full w-10 h-10 hidden sm:flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-colors shrink-0 overflow-hidden">
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
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 text-sm font-bold text-primary sm:hidden"
                >
                  <span className="material-symbols-outlined text-xl">{isMenuOpen ? 'close' : 'menu'}</span>
                  {t('common.menu')}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {isMenuOpen && isAuthenticated && (
        <div className="border-t border-[#E4EEE6] bg-surface-light px-4 pb-4 shadow-lg dark:border-[#2A4532] dark:bg-surface-dark sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
            <Link onClick={closeMenu} to="/app/dashboard" className={`${baseMobileLink} ${location.pathname.startsWith('/app') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
              <span className="material-symbols-outlined text-lg">dashboard</span>
              {t('navbar.dashboard')}
            </Link>
            {isAdmin && !isMobileApp && (
              <Link onClick={closeMenu} to="/admin/overview" className={`${baseMobileLink} ${location.pathname.startsWith('/admin') ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                {t('common.admin')}
              </Link>
            )}
            <Link onClick={closeMenu} to="/plants" className={`${baseMobileLink} ${isActive('/plants') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
              <span className="material-symbols-outlined text-lg">local_florist</span>
              {t('navbar.plants')}
            </Link>
            <Link onClick={closeMenu} to="/app/profile" className={`${baseMobileLink} text-slate-600 dark:text-slate-300`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.name || t('common.profile')} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-lg">person</span>
              )}
              {t('common.profile')}
            </Link>
            <button disabled={isLoading} onClick={handleLogout} className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500 disabled:opacity-60">
              <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : ''}`}>{isLoading ? 'progress_activity' : 'logout'}</span>
              {isLoading ? t('navbar.loggingOut') : t('navbar.logout')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
