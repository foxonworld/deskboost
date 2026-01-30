
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PLANTS } from '../data/mockData';

const PlantDetail = () => {
  const { plantId } = useParams();
  const plant = PLANTS.find(p => p.id === plantId) || PLANTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <nav className="flex mb-8 gap-2 text-sm font-medium text-text-secondary">
          <Link to="/">Home</Link> <span>/</span> <Link to="/plants">Shop</Link> <span>/</span> <span className="text-text-main font-bold">{plant.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-white group">
              <img src={plant.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p => p.name} />
              <div className="absolute top-4 left-4">
                <span className="bg-primary/90 text-text-main text-xs font-bold px-3 py-1 rounded-full">Bestseller</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer">
                  <img src={plant.image} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
              <div className="aspect-square rounded-xl bg-white flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
                <span className="text-xs font-bold">Watch Video</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight">{plant.name}</h1>
              <p className="text-lg text-text-secondary font-medium">{plant.species}</p>
              <div className="flex items-center gap-6">
                <span className="text-3xl font-bold text-primary">${plant.price}</span>
                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                  <span>4.8</span>
                  <span className="text-sm text-gray-400 underline ml-2">12 Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-xs font-bold">
                <span className="material-symbols-outlined text-primary text-base">air</span> Air Purifying
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold">
                <span className="material-symbols-outlined text-base">verified</span> Healthy Guarantee
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Light', val: plant.light, icon: 'wb_sunny', color: 'yellow' },
                { label: 'Water', val: plant.water, icon: 'water_drop', color: 'blue' },
                { label: 'Difficulty', val: plant.difficulty, icon: 'spa', color: 'green' }
              ].map((m, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center space-y-1">
                  <span className={`material-symbols-outlined text-${m.color}-500 mb-1`}>{m.icon}</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{m.label}</p>
                  <p className="text-xs font-bold">{m.val}</p>
                </div>
              ))}
            </div>

            <div className="p-1 bg-white border border-gray-100 rounded-xl flex items-center gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <input type="text" placeholder="Will this fit on a small desk?" className="flex-1 border-none focus:ring-0 text-sm" />
              <button className="bg-primary/20 p-2 rounded-lg text-primary-dark mr-1">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>

            <button className="w-full bg-primary hover:bg-primary-dark text-text-main py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetail;
