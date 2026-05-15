import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CareNotificationBell from './CareNotificationBell';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isBootstrapping, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f4f2] dark:border-[#1e3a29] bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 text-text-main dark:text-white shrink-0">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">potted_plant</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">DeskBoost</h2>
        </Link>

        <nav className="flex items-center gap-3 md:gap-8 min-w-0">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Trang chủ</span>
            </Link>
            <Link to="/plants" className="flex items-center gap-1.5 text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">local_florist</span>
              <span>Cây cảnh</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated && <CareNotificationBell />}

            {isBootstrapping ? (
              <div className="h-10 w-28 rounded-lg bg-primary/10 animate-pulse" aria-label="Loading session" />
            ) : !isAuthenticated ? (
              <Link to="/login" className="flex items-center gap-2 rounded-lg h-10 px-3 sm:px-4 bg-primary text-text-main text-sm font-bold shadow-sm hover:bg-primary/90 transition-all whitespace-nowrap">
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span>Đăng nhập</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {String(user?.role || '').toUpperCase() === 'ADMIN' && (
                  <Link to="/admin/overview" className="hidden lg:inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    Admin
                  </Link>
                )}
                <Link to="/app/profile" className="hidden sm:block max-w-32 truncate text-sm font-semibold text-text-secondary dark:text-slate-400 hover:text-primary transition-colors">{user?.name || 'Hồ sơ'}</Link>
                <button disabled={isLoading} onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors hidden sm:inline-flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                  {isLoading ? 'Đang xuất...' : 'Đăng xuất'}
                </button>
                <Link to="/app/profile" aria-label="Open profile" className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-primary">person</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
