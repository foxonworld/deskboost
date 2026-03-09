
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MY_PLANTS } from '../data/mockData';

const MyPlants = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col text-text-main dark:text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight">My Collection</h1>
            <p className="text-text-secondary dark:text-slate-400 text-lg font-medium">Manage your desk oasis. You have {MY_PLANTS.length} plants thriving.</p>
          </div>
          <button className="bg-primary text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-dark transition-all">
            <span className="material-symbols-outlined">add</span> Add New Plant
          </button>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {['All Plants', 'Thriving', 'Needs Water', 'Recovering'].map((f, i) => (
            <button key={i} className={`px-6 h-10 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-text-secondary dark:text-slate-400 hover:border-primary hover:text-primary'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MY_PLANTS.map((p) => (
            <div key={p.id} className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${p.status === 'needs-water' ? 'text-amber-700 border-amber-200 dark:border-amber-900/50' : 'text-emerald-700 border-emerald-200 dark:border-emerald-900/50'}`}>
                    <span className={`size-2 rounded-full ${p.status === 'needs-water' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span> 
                    {p.status === 'needs-water' ? 'Needs Water' : 'Thriving'}
                  </span>
                </div>
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
              </div>
              <div className="flex flex-col p-5 gap-4 flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-text-main dark:text-white">{p.nickname}</h3>
                    <button className="text-text-secondary dark:text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-slate-400 italic font-medium">{p.species}</p>
                </div>
                <div className="mt-auto">
                   <div className="flex items-center gap-2 mb-4 text-xs font-bold text-text-secondary dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm text-primary">water_drop</span>
                    <span>Watered 2 days ago</span>
                  </div>
                  <Link to={`/app/my-plants/${p.id}/profile`} className="block w-full text-center h-11 leading-[44px] rounded-xl border border-gray-200 dark:border-slate-700 text-text-main dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-slate-900/50 hover:border-primary hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group">
            <div className="size-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform border border-gray-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <p className="font-bold text-text-main dark:text-white">Add New Plant</p>
            <p className="text-sm text-text-secondary dark:text-slate-400 text-center mt-1 font-medium">Expand your collection</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default MyPlants;
