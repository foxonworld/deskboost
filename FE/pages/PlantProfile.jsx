import React from 'react';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS, MOCK_ALL_USER_PLANTS } from '../data/mockData';

const PlantProfile = () => {
  const { id } = useParams();
  const plant = [...MY_PLANTS, ...MOCK_ALL_USER_PLANTS].find(p => p.id === id) || MY_PLANTS[0];

  return (
    <UserLayout>
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
        <nav className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/app/dashboard" className="hover:text-[#4CAF50] transition-colors">Base</Link> 
          <span className="opacity-30">/</span> 
          <Link to="/app/my-plants" className="hover:text-[#4CAF50] transition-colors">Jungle</Link> 
          <span className="opacity-30">/</span> 
          <span className="dark:text-white text-slate-900">{plant.nickname}</span>
        </nav>

        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black dark:text-white text-slate-900 tracking-tight uppercase">{plant.nickname}</h1>
            <p className="text-lg text-slate-500 font-medium italic">{plant.species} • Operational</p>
          </div>
          <button className="flex items-center gap-3 px-8 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm">edit</span> Mod Profile
          </button>
        </div>

        <div className="bg-[#4CAF50]/5 border border-[#4CAF50]/10 rounded-3xl p-8 flex gap-6 items-start shadow-sm hover:shadow-lg transition-all">
          <div className="bg-[#4CAF50]/10 p-4 rounded-2xl text-[#4CAF50] shrink-0 transform rotate-12">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
          </div>
          <div className="space-y-2">
            <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">AI Behavioral Insight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Your {plant.nickname} is showing optimal chlorophyll production. Ambient sensors detect lower humidity (35%). 
              Consider a misting protocol in the next 12 hours to maintain leaf elasticity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                 <img src={plant.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={plant.name} />
              </div>
              <div className="absolute top-10 left-10 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                <span className="size-2 bg-[#4CAF50] rounded-full animate-ping"></span> 
                Status: Prime
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link to={`/app/my-plants/${plant.id}/analyze`} className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl bg-[#4CAF50] text-white transition-all shadow-xl shadow-[#4CAF50]/20 hover:opacity-90 active:scale-95 group/btn">
                  <span className="material-symbols-outlined text-3xl group-hover/btn:scale-110 transition-transform">biotech</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Bio Scan</span>
                </Link>
                <button className="flex flex-col items-center justify-center gap-2 h-24 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white transition-all hover:bg-slate-50 active:scale-95">
                  <span className="material-symbols-outlined text-3xl text-blue-500">notification_important</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Photons', val: 'Low Indirect', icon: 'wb_sunny', color: 'amber', p: 35 },
                { label: 'Hydration', val: '85%', icon: 'water_drop', color: 'blue', p: 85 },
                { label: 'Schedule', val: 'T-Minus 2D', icon: 'schedule', color: 'emerald', p: 100 }
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-6 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                    <span className={`material-symbols-outlined text-${stat.color}-500 bg-${stat.color}-50 dark:bg-${stat.color}-500/10 p-2 rounded-xl`}>{stat.icon}</span>
                  </div>
                  <p className="text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tight">{stat.val}</p>
                  <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${stat.color === 'emerald' ? '[#4CAF50]' : stat.color + '-500'} rounded-full`} style={{ width: `${stat.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/20 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Logs • Care</h3>
                <button className="text-[#4CAF50] font-black text-[10px] uppercase tracking-widest hover:underline">Full Archive</button>
              </div>
              <div className="p-10 space-y-10 relative">
                <div className="absolute left-12 top-10 bottom-10 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                {[
                  { date: 'Operational • Oct 28', title: 'Hydration Protocol', active: true, icon: 'water_drop' },
                  { date: 'Nov 15', title: 'Macro-Nutrition Feed', future: true, icon: 'eco' },
                  { date: 'Archive • Oct 24', title: 'Hydration Protocol', done: true, icon: 'check_circle' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-10 relative z-10 ${item.done ? 'opacity-40' : ''}`}>
                    <div className={`size-6 rounded-full border-4 border-white dark:border-slate-900 mt-2 shadow-sm ${item.active ? 'bg-[#4CAF50]' : item.future ? 'bg-slate-300' : 'bg-slate-900'}`}></div>
                    <div className="flex-1 flex justify-between items-center bg-white dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 hover:border-[#4CAF50]/30 transition-all">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.active ? 'text-[#4CAF50]' : 'text-slate-400'}`}>{item.date}</p>
                        <p className={`text-lg font-black text-slate-900 dark:text-white ${item.done ? 'line-through' : ''}`}>{item.title}</p>
                      </div>
                      {item.active && (
                        <button className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#4CAF50]/10">Execute</button>
                      )}
                      {item.done && <span className="material-symbols-outlined text-[#4CAF50] text-3xl">task_alt</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PlantProfile;
