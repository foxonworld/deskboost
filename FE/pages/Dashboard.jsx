import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { useI18n } from '../i18n';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <UserLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black dark:text-white text-slate-900">{t('dashboard.greeting')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">{t('dashboard.subtitle')}</p>
          </div>
          <div className="hidden sm:block relative w-64 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input type="text" placeholder={t('dashboard.search')} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-[#4CAF50]/20 transition-all font-medium" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('dashboard.totalPlants')}</span>
              <span className="material-symbols-outlined text-[#4CAF50] bg-[#4CAF50]/10 p-2 rounded-xl">potted_plant</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">12</p>
            <p className="text-xs text-[#4CAF50] font-bold mt-1">{t('dashboard.monthDelta')}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('dashboard.careStreak')}</span>
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-2 rounded-xl">local_fire_department</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">{t('dashboard.days')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">{t('dashboard.keepItUp')}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('dashboard.aiStatus')}</span>
              <span className="material-symbols-outlined text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl">auto_awesome</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">{t('dashboard.healthy')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">{t('dashboard.allSystemsGo')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black dark:text-white text-slate-900">{t('dashboard.protocol')}</h2>
              <button className="text-sm font-bold text-[#4CAF50] hover:underline uppercase tracking-widest">{t('dashboard.calendar')}</button>
            </div>
            <div className="space-y-4">
              {[
                { title: t('dashboard.task.waterSnake'), desc: t('dashboard.task.waterSnakeDesc'), icon: 'water_drop', color: 'blue' },
                { title: t('dashboard.task.rotatePothos'), desc: t('dashboard.task.rotatePothosDesc'), icon: 'wb_sunny', color: 'amber' },
                { title: t('dashboard.task.mistFig'), desc: t('dashboard.task.mistFigDesc'), icon: 'opacity', color: 'cyan' }
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="w-6 h-6 rounded-lg border-slate-200 dark:border-slate-700 text-[#4CAF50] focus:ring-[#4CAF50] cursor-pointer bg-slate-50 dark:bg-slate-800" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white group-hover:text-[#4CAF50] transition-colors">{task.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{task.desc}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-[#4CAF50]/10 group-hover:text-[#4CAF50] rounded-2xl transition-all">
                    <span className="material-symbols-outlined text-2xl">{task.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-black px-2 dark:text-white text-slate-900">{t('dashboard.quickActions')}</h2>
            <Link to="/app/ai-analysis" className="w-full bg-[#4CAF50] text-white p-6 rounded-3xl shadow-xl shadow-[#4CAF50]/20 font-black text-xl flex flex-col items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all text-center">
              <span className="material-symbols-outlined text-4xl">qr_code_scanner</span>
              <span>{t('dashboard.aiScan')}</span>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/app/my-plants" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 text-center flex flex-col items-center gap-4 hover:border-[#4CAF50] hover:shadow-xl transition-all group">
                <div className="p-4 bg-[#F0FDF4] dark:bg-[#4CAF50]/10 rounded-2xl text-[#2E7D32] dark:text-[#A5D6A7] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychiatry</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('dashboard.jungle')}</span>
              </Link>
              <Link to="/app/settings" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 text-center flex flex-col items-center gap-4 hover:border-[#4CAF50] hover:shadow-xl transition-all group">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">settings</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('dashboard.setup')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
