import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Navbar from './Navbar';

const adminItems = [
  { label: 'Overview', hint: 'MVP status', icon: 'dashboard', path: '/admin/overview' },
  { label: 'Users', hint: 'Accounts later', icon: 'group', path: '/admin/users' },
  { label: 'Plants', hint: 'User plants later', icon: 'potted_plant', path: '/admin/plants' },
  { label: 'Marketplace', hint: 'Contact listings', icon: 'storefront', path: '/admin/marketplace' },
  { label: 'AI', hint: 'Chat status later', icon: 'smart_toy', path: '/admin/ai' },
];

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-[#F7F9F8] dark:bg-[#10221f]">
    <Navbar />
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 md:flex-row md:gap-6 md:px-8 md:py-6">
      <aside className="w-full shrink-0 rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm md:w-64">
        <div className="px-2 py-3 md:px-3 md:py-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4CAF50]">Admin MVP</p>
          <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">DeskBoost shell</h2>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">Lightweight controls only. No analytics dashboard.</p>
        </div>
        <nav className="mt-2 grid gap-2 sm:grid-cols-2 md:flex md:flex-col" aria-label="Admin navigation">
          {adminItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-slate-500 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] dark:text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="min-w-0">
                <span className="block truncate">{item.label}</span>
                <span className="block truncate text-[11px] font-bold normal-case tracking-normal opacity-60">{item.hint}</span>
              </span>
            </NavLink>
          ))}
        </nav>
        <Link to="/app/dashboard" className="mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#4CAF50] md:mt-6">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          User app
        </Link>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
