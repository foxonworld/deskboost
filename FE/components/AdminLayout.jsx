import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Navbar from './Navbar';

const adminItems = [
  { label: 'Overview', icon: 'dashboard', path: '/admin/overview' },
  { label: 'Users', icon: 'group', path: '/admin/users' },
  { label: 'Plants', icon: 'potted_plant', path: '/admin/plants' },
  { label: 'Marketplace', icon: 'storefront', path: '/admin/marketplace' },
  { label: 'AI', icon: 'smart_toy', path: '/admin/ai' },
];

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-[#F7F9F8] dark:bg-[#10221f]">
    <Navbar />
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:px-8">
      <aside className="hidden w-64 shrink-0 rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm md:block">
        <div className="px-3 py-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4CAF50]">Admin MVP</p>
          <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">DeskBoost</h2>
        </div>
        <nav className="mt-2 flex flex-col gap-2">
          {adminItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-slate-500 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] dark:text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/app/dashboard" className="mt-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#4CAF50]">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          User app
        </Link>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
