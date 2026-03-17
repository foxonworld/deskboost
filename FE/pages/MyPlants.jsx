import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';

const MyPlants = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = ['All', 'Thriving', 'Needs Water', 'Recovering'];

  return (
    <UserLayout>
      <div className="p-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Collection</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Manage your desk oasis. You have <span className="text-[#4CAF50] font-black">{MY_PLANTS.length}</span> plants thriving.
            </p>
          </div>
          <Link to="/app/add-plant" className="flex items-center justify-center gap-3 bg-[#4CAF50] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined font-bold">add</span>
            Add New Plant
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative min-w-[320px] group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#4CAF50] transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search your collection..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#4CAF50]/5 focus:border-[#4CAF50] transition-all outline-none"
            />
          </div>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pb-20">
          {MY_PLANTS.filter(plant => 
            (activeTab === 'All' || plant.status === activeTab.toLowerCase().replace(' ', '-')) &&
            (plant.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || plant.species.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map(plant => (
            <div key={plant.id} className="group flex flex-col rounded-[32px] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="relative aspect-[5/4] w-full overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${
                    plant.status === 'thriving' ? 'text-green-600 border-green-100' :
                    plant.status === 'needs-water' ? 'text-amber-600 border-amber-100' : 'text-blue-600 border-blue-100'
                  }`}>
                    <span className={`size-2 rounded-full ${plant.status === 'thriving' ? 'bg-green-500 animate-pulse' : plant.status === 'needs-water' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                    {plant.status.replace('-', ' ')}
                  </span>
                </div>
                <img src={plant.image} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={plant.nickname} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                     Quick Action
                   </button>
                </div>
              </div>
              <div className="flex flex-col p-8 gap-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{plant.nickname}</h3>
                    <p className="text-xs text-[#4CAF50] font-black uppercase tracking-widest mt-1.5">{plant.species}</p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>

                <div className="mt-auto space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health</span>
                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full ${plant.status === 'thriving' ? 'bg-[#4CAF50] w-[95%]' : 'bg-amber-500 w-[40%]'}`}></div>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Refined</span>
                        <span className="text-xs font-black dark:text-white text-slate-900 uppercase">2h ago</span>
                     </div>
                  </div>
                  
                  <Link 
                    to={`/app/my-plants/${plant.id}/profile`} 
                    className={`w-full h-14 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest transition-all ${
                      plant.status === 'needs-water' 
                        ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20 hover:opacity-90' 
                        : 'border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {plant.status === 'needs-water' ? 'Water Now' : 'Inspection'}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Empty State */}
          <Link 
            to="/app/add-plant"
            className="group flex flex-col items-center justify-center rounded-[32px] bg-slate-50/50 dark:bg-slate-900/50 border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#4CAF50] hover:bg-white dark:hover:bg-slate-900 transition-all p-10 min-h-[460px] text-center"
          >
            <div className="size-20 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center text-[#4CAF50] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[#4CAF50] group-hover:text-white transition-all border border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Expand Jungle</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-[220px] font-medium leading-relaxed italic">The planet needs more green. Start your next botanical mission here.</p>
          </Link>
        </div>
      </div>
    </UserLayout>
  );
};

export default MyPlants;
