import React from 'react';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';

const PlantProfile = () => {
  const { id } = useParams();
  const plant = MY_PLANTS.find(p => p.id === id) || MY_PLANTS[0];

  return (
    <UserLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <Link to="/app/my-plants" className="text-sm font-bold text-[#4CAF50] hover:underline">← Back to My Plants</Link>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <img src={plant.image} alt={plant.nickname} className="w-full aspect-square object-cover rounded-[28px]" />
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">{plant.nickname}</h1>
                <p className="text-[#4CAF50] font-black uppercase tracking-widest mt-2">{plant.species}</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{plant.notes}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">Light</p><p className="font-bold">{plant.light}</p></div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">Water</p><p className="font-bold">{plant.water}</p></div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">Status</p><p className="font-bold">{plant.status}</p></div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"><p className="text-xs font-black text-slate-400">Next Watering</p><p className="font-bold">{plant.nextWatering}</p></div>
              </div>
              <Link to="/app/ai-analysis" className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-[#4CAF50] text-white font-black uppercase tracking-widest">Bio Scan</Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PlantProfile;
