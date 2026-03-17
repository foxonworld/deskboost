import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex items-center justify-between">
           <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black dark:text-white text-slate-900">Good morning, Sarah! 🌱</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Your Monstera needs some love today.</p>
          </div>
          <div className="hidden sm:block relative w-64 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input type="text" placeholder="Search your jungle..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-[#4CAF50]/20 transition-all font-medium" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Plants</span>
              <span className="material-symbols-outlined text-[#4CAF50] bg-[#4CAF50]/10 p-2 rounded-xl">potted_plant</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">12</p>
            <p className="text-xs text-[#4CAF50] font-bold mt-1">+2 this month</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Care Streak</span>
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-2 rounded-xl">local_fire_department</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">15 Days</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">Keep it up!</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">AI Status</span>
              <span className="material-symbols-outlined text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl">auto_awesome</span>
            </div>
            <p className="text-4xl font-black dark:text-white text-slate-900">Healthy</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">All systems go</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black dark:text-white text-slate-900">Today's Protocol</h2>
              <button className="text-sm font-bold text-[#4CAF50] hover:underline uppercase tracking-widest">Calendar</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Water the Snake Plant', desc: 'Approx 200ml • Soil is dry', icon: 'water_drop', color: 'blue' },
                { title: 'Rotate Pothos', desc: 'Turn 180° towards window', icon: 'wb_sunny', color: 'amber' },
                { title: 'Mist Fiddle Leaf Fig', desc: 'Humidity boost needed', icon: 'opacity', color: 'cyan' }
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
            <h2 className="text-2xl font-black px-2 dark:text-white text-slate-900">Quick Actions</h2>
            <Link to="/app/ai-analysis" className="w-full bg-[#4CAF50] text-white p-6 rounded-3xl shadow-xl shadow-[#4CAF50]/20 font-black text-xl flex flex-col items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all text-center">
              <span className="material-symbols-outlined text-4xl">qr_code_scanner</span>
              <span>AI SCAN</span>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/app/my-plants" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 text-center flex flex-col items-center gap-4 hover:border-[#4CAF50] hover:shadow-xl transition-all group">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychiatry</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">Jungle</span>
              </Link>
              <Link to="/app/settings" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 text-center flex flex-col items-center gap-4 hover:border-[#4CAF50] hover:shadow-xl transition-all group">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">settings</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-400">Setup</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
