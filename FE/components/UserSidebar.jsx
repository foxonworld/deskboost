import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
  { name: 'My Plants', icon: 'potted_plant', path: '/app/my-plants' },
  { name: 'Add Plant', icon: 'add_circle', path: '/app/add-plant' },
  { name: 'AI Diagnosis', icon: 'smart_toy', path: '/app/ai-analysis' },
  { name: 'AI Chat', icon: 'forum', path: '/app/ai-chat' },
  { name: 'Reminder', icon: 'notifications_active', path: '/app/settings' },
  { name: 'Feedback', icon: 'rate_review', path: '/app/profile' },
  { name: 'Marketplace', icon: 'storefront', path: '/plants' },
  { name: 'Profile', icon: 'person', path: '/app/profile' },
];

const UserNavLinks = ({ currentPath, onNavigate }) => (
  <>
    {menuItems.map((item) => {
      const isActive = currentPath === item.path;
      return (
        <Link
          key={item.name}
          to={item.path}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
            isActive
              ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
              : 'text-slate-500 dark:text-slate-400 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50]'
          }`}
        >
          <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-sm">{item.name}</span>
        </Link>
      );
    })}
  </>
);

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
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
          aria-label={isMobileOpen ? 'Close user navigation' : 'Open user navigation'}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((value) => !value)}
          className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl border border-[#4CAF50]/20 bg-white px-4 py-3 text-left text-sm font-black text-[#4CAF50] shadow-xl dark:bg-slate-900"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">menu</span>
            User navigation
          </span>
          <span className="material-symbols-outlined">{isMobileOpen ? 'close' : 'expand_more'}</span>
        </button>
        {isMobileOpen && (
          <div className="fixed inset-0 z-30 bg-slate-950/40 px-4 pb-20 pt-24 backdrop-blur-sm" onClick={closeMobile}>
            <nav className="max-h-full overflow-y-auto rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950" aria-label="User mobile navigation" onClick={(event) => event.stopPropagation()}>
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4CAF50]">User navigation</p>
                <button type="button" aria-label="Close user navigation" onClick={closeMobile} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <UserNavLinks currentPath={currentPath} onNavigate={closeMobile} />
            </nav>
          </div>
        )}
      </div>

      <aside className="w-64 hidden md:flex flex-col border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full shrink-0 overflow-y-auto">
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-sm shadow-[#4CAF50]/20">
              <span className="material-symbols-outlined text-white">potted_plant</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white font-display">DeskBoost</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-2" aria-label="User navigation">
          <UserNavLinks currentPath={currentPath} />
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 p-2 min-w-0">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              <span className="material-symbols-outlined text-slate-400">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold dark:text-white truncate max-w-[150px]">{user?.name || 'User Account'}</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate max-w-[150px]">{user?.email || 'DeskBoost MVP'}</span>
            </div>
          </div>
          <button
            disabled={isLoading}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>{isLoading ? 'progress_activity' : 'logout'}</span>
            <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
