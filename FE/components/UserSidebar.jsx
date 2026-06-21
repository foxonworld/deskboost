import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n';

const menuItems = [
  { labelKey: 'userSidebar.dashboard', icon: 'dashboard', path: '/app/dashboard' },
  { labelKey: 'userSidebar.myPlants', icon: 'potted_plant', path: '/app/my-plants' },
  { labelKey: 'userSidebar.addPlant', icon: 'add_circle', path: '/app/add-plant' },
  { labelKey: 'userSidebar.aiDiagnosis', icon: 'smart_toy', path: '/app/ai-analysis' },
  { labelKey: 'userSidebar.aiChat', icon: 'forum', path: '/app/ai-chat' },
  { labelKey: 'userSidebar.reminder', icon: 'notifications_active', path: '/app/settings' },
  { labelKey: 'userSidebar.marketplace', icon: 'storefront', path: '/plants' },
  { labelKey: 'userSidebar.profile', icon: 'person', path: '/app/profile' },
];

const UserNavLinks = ({ currentPath, onNavigate, t }) => (
  <>
    {menuItems.map((item) => {
      const isActive = currentPath === item.path;
      return (
        <Link
          key={item.path + item.labelKey}
          to={item.path}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
            isActive
              ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 dark:ring-primary/30'
              : 'text-slate-500 hover:bg-black/5 hover:text-primary dark:text-slate-400 dark:hover:bg-white/5'
          }`}
        >
          <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-sm">{t(item.labelKey)}</span>
        </Link>
      );
    })}
  </>
);

const UserAvatar = ({ user }) => {
  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user?.name || 'User'} className="h-full w-full object-cover" />;
  }

  return <span className="material-symbols-outlined text-slate-400">person</span>;
};

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { t } = useI18n();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const currentPath = location.pathname;

  const closeMobile = () => setIsMobileOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          aria-label={isMobileOpen ? t('userSidebar.closeNav') : t('userSidebar.openNav')}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((value) => !value)}
          className="fixed bottom-4 left-4 right-4 z-40 flex h-12 items-center justify-between rounded-2xl border border-primary/50 bg-surface-light/95 px-4 text-left text-sm font-bold text-primary shadow-[0_0_20px_rgba(76,175,80,0.25)] ring-2 ring-primary/30 backdrop-blur transition-all dark:border-primary/40 dark:bg-surface-dark/95 dark:shadow-[0_0_20px_rgba(76,175,80,0.15)]"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">menu</span>
            <span className="pl-3">{t('userSidebar.nav')}</span>
          </span>
          <span className="material-symbols-outlined">{isMobileOpen ? 'close' : 'expand_more'}</span>
        </button>
        {isMobileOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 px-4 pb-20 pt-24 backdrop-blur-sm" onClick={closeMobile}>
            <nav className="max-h-full overflow-y-auto rounded-3xl border border-[#E4EEE6] bg-surface-light p-3 shadow-xl dark:border-[#2A4532] dark:bg-surface-dark" aria-label={t('userSidebar.mobileNav')} onClick={(event) => event.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <p className="text-xs font-bold tracking-wide text-primary">{t('userSidebar.nav')}</p>
                <button type="button" aria-label={t('userSidebar.closeNav')} onClick={closeMobile} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <UserNavLinks currentPath={currentPath} onNavigate={closeMobile} t={t} />
            </nav>
          </div>
        )}
      </div>

      <aside className="hidden my-2 ml-3 mr-1 h-[calc(100%-1rem)] w-[260px] shrink-0 flex-col overflow-y-auto rounded-3xl border border-white/50 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-[#2A4532]/50 dark:bg-surface-dark/70 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:flex">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-white">potted_plant</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white font-display">DeskBoost</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-2" aria-label={t('userSidebar.nav')}>
          <UserNavLinks currentPath={currentPath} t={t} />
        </nav>

        <div className="space-y-4 border-t border-[#E4EEE6]/30 p-4 dark:border-white/5 mt-auto">
          <div className="flex items-center gap-3 p-3 min-w-0 rounded-2xl bg-white/50 shadow-sm border border-white/60 dark:bg-black/20 dark:border-white/5">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-[#2A4532]/50 border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden shrink-0">
              <UserAvatar user={user} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="max-w-[150px] truncate text-sm font-bold dark:text-white">{user?.name || t('userSidebar.account')}</span>
              <span className="max-w-[150px] truncate text-[11px] font-semibold text-slate-400">{user?.email || t('userSidebar.mvp')}</span>
            </div>
          </div>
          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>{isLoading ? 'progress_activity' : 'logout'}</span>
            <span>{isLoading ? t('navbar.loggingOut') : t('navbar.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
