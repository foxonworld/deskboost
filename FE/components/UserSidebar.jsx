import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
    { name: 'My Collection', icon: 'potted_plant', path: '/app/my-plants' },
    { name: 'My Orders', icon: 'receipt_long', path: '/orders' },
    { name: 'AI Plant Analysis', icon: 'smart_toy', path: '/app/ai-analysis' },
    { name: 'Profile', icon: 'person', path: '/app/profile' },
    { name: 'Reminders & Settings', icon: 'settings', path: '/app/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full shrink-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-sm shadow-[#4CAF50]/20">
            <span className="material-symbols-outlined text-white">potted_plant</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight dark:text-white font-display">DeskBoost</h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
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
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 p-2">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-slate-400">person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold dark:text-white truncate max-w-[120px]">User Account</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Free Plan</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
