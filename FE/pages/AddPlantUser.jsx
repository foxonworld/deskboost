import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';

const AddPlantUser = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Adopt New Comrade</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add a new plant to your digital sanctuary.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 bg-[#4CAF50]/5 p-8 flex flex-col items-center justify-center text-center">
               <div className="size-48 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mb-6">
                 <span className="material-symbols-outlined text-7xl text-[#4CAF50]">potted_plant</span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">Visual Identity</p>
               <p className="text-xs text-slate-400 mt-2 font-medium">Select a species to update the biometric preview.</p>
            </div>
            
            <div className="lg:w-2/3 p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Species Classification</label>
                <select className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none">
                  <option>Search Species Library...</option>
                  <option selected>Monstera Deliciosa</option>
                  <option>Snake Plant</option>
                  <option>Golden Pothos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Designation (Nickname)</label>
                <input className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold focus:ring-4 focus:ring-[#4CAF50]/10 outline-none" placeholder="e.g. Victor the Vine"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Placement</label>
                  <select className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 text-sm font-bold outline-none">
                    <option>Central Command (Desk)</option>
                    <option>Observation Deck (Window)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alert System</label>
                  <div className="w-full h-14 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 flex items-center justify-between">
                    <span className="text-xs font-bold">Smart Reminders</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[#4CAF50] focus:ring-[#4CAF50]" />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                 <button onClick={() => navigate('/app/my-plants')} className="flex-1 h-14 bg-[#4CAF50] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4CAF50]/20 hover:opacity-90 active:scale-95 transition-all">Initialize Growth</button>
                 <button onClick={() => navigate('/app/my-plants')} className="px-8 h-14 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Abort</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AddPlantUser;
