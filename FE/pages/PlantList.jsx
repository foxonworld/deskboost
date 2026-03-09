
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PLANTS } from '../data/mockData';

const PlantList = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-text-main mb-3 tracking-tight">Find your perfect desk companion</h1>
          <p className="text-text-secondary text-lg max-w-2xl font-medium">Bring life to your workspace with our curated selection of low-maintenance, high-impact desk plants.</p>
        </div>

        <div className="sticky top-16 z-40 bg-background-light/95 backdrop-blur-sm py-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center">
            {['All Plants', 'Easy care', 'Low light', 'Small desk', 'Pet friendly'].map((filter, i) => (
              <button key={i} className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white border border-gray-200 text-text-secondary hover:border-primary hover:text-primary'}`}>
                {filter}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm font-bold text-text-secondary">
            <span>Sort by:</span>
            <select className="bg-transparent border-none focus:ring-0 text-text-main font-bold cursor-pointer">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLANTS.map(p => (
            <div key={p.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider shadow-sm text-primary">Bestseller</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-text-main line-clamp-1">{p.name}</h3>
                  <span className="text-lg font-black text-primary">${p.price}</span>
                </div>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2 font-medium leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  {p.tags.map((tag, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-lg bg-background-light text-[10px] font-bold uppercase tracking-wider text-text-secondary border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/plants/${p.id}`} className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all flex items-center justify-center shadow-sm shadow-primary/10">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default PlantList;
