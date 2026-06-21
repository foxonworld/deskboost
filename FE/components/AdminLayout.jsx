import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import { useI18n } from '../i18n';

const adminItems = [
  { labelKey: 'admin.nav.overview', hintKey: 'admin.nav.overviewHint', icon: 'dashboard', path: '/admin/overview' },
  { labelKey: 'admin.nav.users', hintKey: 'admin.nav.usersHint', icon: 'group', path: '/admin/users' },
  { labelKey: 'admin.nav.plants', hintKey: 'admin.nav.plantsHint', icon: 'potted_plant', path: '/admin/plants' },
  { labelKey: 'admin.nav.inventory', hintKey: 'admin.nav.inventoryHint', icon: 'inventory_2', path: '/admin/plant-inventory' },
  { labelKey: 'admin.nav.marketplace', hintKey: 'admin.nav.marketplaceHint', icon: 'storefront', path: '/admin/marketplace' },
  { labelKey: 'admin.nav.reminderOps', hintKey: 'admin.nav.reminderOpsHint', icon: 'event_note', path: '/admin/reminder-operations' },
  { labelKey: 'admin.nav.emailOps', hintKey: 'admin.nav.emailOpsHint', icon: 'outgoing_mail', path: '/admin/email-operations' },
  { labelKey: 'admin.nav.feedback', hintKey: 'admin.nav.feedbackHint', icon: 'rate_review', path: '/admin/feedback' },
  { labelKey: 'admin.nav.ai', hintKey: 'admin.nav.aiHint', icon: 'smart_toy', path: '/admin/ai' },
  { labelKey: 'admin.nav.notifications', hintKey: 'admin.nav.notificationsHint', icon: 'campaign', path: '/admin/notifications' },
];

const AdminNavLinks = ({ onNavigate, t }) => (
  <>
    {adminItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onNavigate}
        className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
          isActive ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'text-slate-500 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] dark:text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined text-xl">{item.icon}</span>
        <span className="min-w-0">
          <span className="block truncate">{t(item.labelKey)}</span>
          <span className="block truncate text-[11px] font-bold normal-case tracking-normal opacity-60">{t(item.hintKey)}</span>
        </span>
      </NavLink>
    ))}
  </>
);

const AdminLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useI18n();
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F8] dark:bg-[#10221f] overflow-x-hidden">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 md:flex-row md:gap-6 md:px-8 md:py-6">
        <div className="md:hidden">
          <button
            type="button"
            aria-label={isMobileOpen ? t('admin.layout.closeNav') : t('admin.layout.openNav')}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((value) => !value)}
            className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl border border-[#4CAF50]/20 bg-white px-4 py-3 text-left text-sm font-black text-[#4CAF50] shadow-xl dark:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              {t('admin.layout.navigation')}
            </span>
            <span className="material-symbols-outlined">{isMobileOpen ? 'close' : 'expand_more'}</span>
          </button>
          {isMobileOpen && (
            <div className="fixed inset-0 z-30 bg-slate-950/40 px-4 pb-20 pt-24 backdrop-blur-sm" onClick={closeMobile}>
              <nav className="grid max-h-full gap-2 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950" aria-label={t('admin.layout.mobileNavAria')} onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4CAF50]">{t('admin.layout.navigation')}</p>
                  <button type="button" aria-label={t('admin.layout.closeNav')} onClick={closeMobile} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <AdminNavLinks onNavigate={closeMobile} t={t} />
                <Link onClick={closeMobile} to="/app/dashboard" className="flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#4CAF50]">
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  {t('admin.layout.userApp')}
                </Link>
              </nav>
            </div>
          )}
        </div>

        <aside className="hidden w-full shrink-0 rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:block md:w-64">
          <div className="px-2 py-3 md:px-3 md:py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#4CAF50]">{t('admin.layout.badge')}</p>
            <h2 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{t('admin.layout.title')}</h2>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-400">{t('admin.layout.description')}</p>
          </div>
          <nav className="mt-2 flex flex-col gap-2" aria-label={t('admin.layout.navigation')}>
            <AdminNavLinks t={t} />
          </nav>
          <Link to="/app/dashboard" className="mt-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#4CAF50]">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {t('admin.layout.userApp')}
          </Link>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
