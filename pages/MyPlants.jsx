
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MY_PLANTS } from '../data/mockData';

const MyPlants = () => {
  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black">My Collection</h1>
            <p className="text-text-secondary text-lg">Manage your desk oasis. You have {MY_PLANTS.length} plants thriving.</p>
          </div>
          <button className="bg-primary text-text-main font-bold h-12 px-6 rounded-lg shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined">add</span> Add New Plant
          </button>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {['All Plants', 'Thriving', 'Needs Water', 'Recovering'].map((f, i) => (
            <button key={i} className={`px-5 h-10 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-text-main text-white' : 'bg-white border border-gray-200 text-text-main hover:border-primary'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MY_PLANTS.map((p) => (
            <div key={p.id} className="group flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold border ${p.status === 'needs-water' ? 'text-amber-700 border-amber-200' : 'text-green-700 border-green-200'}`}>
                    <span className={`size-2 rounded-full ${p.status === 'needs-water' ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></span> 
                    {p.status === 'needs-water' ? 'Needs Water' : 'Thriving'}
                  </span>
                </div>
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
              </div>
              <div className="flex flex-col p-4 gap-4 flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{p.nickname}</h3>
                    <button className="text-text-secondary"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <p className="text-sm text-text-secondary italic">{p.species}</p>
                </div>
                <div className="mt-auto">
                   <div className="flex items-center gap-2 mb-4 text-xs font-medium text-text-secondary">
                    <span className="material-symbols-outlined text-sm">water_drop</span>
                    <span>Watered 2 days ago</span>
                  </div>
                  <Link to={`/app/my-plants/${p.id}/profile`} className="block w-full text-center h-10 leading-10 rounded-lg border border-gray-200 text-text-main text-sm font-bold hover:bg-gray-50 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 bg-gray-50 hover:border-primary hover:bg-white transition-all cursor-pointer group">
            <div className="size-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <p className="font-bold">Add New Plant</p>
            <p className="text-sm text-text-secondary text-center mt-1">Expand your collection</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPlants;
