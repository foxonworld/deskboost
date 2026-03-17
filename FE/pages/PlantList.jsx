
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { useCart } from '../context/CartContext';

const PlantList = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Popularity');

  const plants = PRODUCTS.filter(p => p.status === 'Active' || p.status === 'Out of Stock');

  const filters = [
    { name: 'All', icon: 'filter_list' },
    { name: 'Dễ chăm', icon: 'water_drop' },
    { name: 'Ánh sáng thấp', icon: 'wb_twilight' },
    { name: 'Mọng nước', icon: 'crop_square' },
    { name: 'Ra hoa', icon: 'local_florist' },
  ];

  const sortedAndFilteredPlants = plants
    .filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || plant.tags?.includes(activeFilter);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      return 0; // Popularity (default)
    });

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Find your perfect desk companion</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl font-medium">Bring life to your workspace with our curated selection of low-maintenance, high-impact desk plants.</p>
        </div>

        {/* Filters & Sort */}
        <div className="sticky top-[65px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0 py-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 items-center">
            {filters.map(filter => (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  activeFilter === filter.name
                    ? 'bg-primary text-[#111813] shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{filter.icon}</span>
                {filter.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {/* Mobile Search */}
            <div className="md:hidden flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                placeholder="Search..."
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-[#111813] dark:text-white font-bold cursor-pointer outline-none"
              >
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Plant Grid */}
        {sortedAndFilteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredPlants.map(plant => (
              <div key={plant.id} className="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    {plant.isBestseller && (
                      <span className="px-2 py-1 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[10px] font-bold text-[#111813] dark:text-white shadow-sm uppercase">Bestseller</span>
                    )}
                    {plant.isNew && (
                      <span className="px-2 py-1 rounded-md bg-primary/90 text-[10px] font-bold text-[#111813] shadow-sm uppercase">New</span>
                    )}
                  </div>
                  <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-[#111813] dark:text-white line-clamp-1">{plant.name}</h3>
                  <span className="text-lg font-black text-primary">{formatVND(plant.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 font-medium">{plant.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {plant.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-background-light dark:bg-background-dark text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/plants/${plant.id}`} 
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-[#25d360] active:scale-95 text-[#111813] text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-300">potted_plant</span>
            <p className="text-xl font-bold text-gray-500">No plants found matching your search.</p>
            <button onClick={() => {setSearchTerm(''); setActiveFilter('All');}} className="text-primary font-bold hover:underline">Clear all filters</button>
          </div>
        )}

        {/* Pagination placeholder */}
        <div className="mt-16 flex justify-center">
          <nav className="flex items-center gap-2">
            <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-lg bg-primary text-[#111813] font-bold shadow-sm">1</button>
            <button className="size-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-500 hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </nav>
        </div>

      </main>
    </div>
  );
};

export default PlantList;
