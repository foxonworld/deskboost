
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PLANTS } from '../data/mockData';
import { useCart } from '../context/CartContext';

const PlantDetail = () => {
  const { plantId } = useParams();
  const plant = PLANTS.find(p => p.id === plantId) || PLANTS[0];
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(plant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(plant);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <nav className="flex mb-8 gap-2 text-sm font-bold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link> <span>/</span> <Link to="/plants" className="hover:text-primary transition-colors">Shop</Link> <span>/</span> <span className="text-text-main font-black">{plant.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 bg-white group border border-gray-100">
              <img src={plant.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={plant.name} />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">Bestseller</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer shadow-sm">
                  <img src={plant.image} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
              <div className="aspect-square rounded-2xl bg-white flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-all cursor-pointer border border-gray-100 shadow-sm group">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">play_circle</span>
                <span className="text-[10px] font-black uppercase tracking-wider mt-1">Watch Video</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-text-main leading-tight">{plant.name}</h1>
              <p className="text-xl text-text-secondary font-medium italic">{plant.species}</p>
              <div className="flex items-center gap-6">
                <span className="text-4xl font-black text-primary">${plant.price}</span>
                <div className="flex items-center gap-1 font-bold text-text-main">
                  <span className="material-symbols-outlined text-yellow-500 text-xl fill-1">star</span>
                  <span className="text-lg">4.8</span>
                  <span className="text-sm text-text-secondary underline ml-2 cursor-pointer hover:text-primary transition-colors">12 Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-text-main shadow-sm">
                <span className="material-symbols-outlined text-primary text-lg">air</span> Air Purifying
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-lg">verified</span> Healthy Guarantee
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Light', val: plant.light, icon: 'wb_sunny', color: 'text-amber-500' },
                { label: 'Water', val: plant.water, icon: 'water_drop', color: 'text-sky-500' },
                { label: 'Difficulty', val: plant.difficulty, icon: 'spa', color: 'text-emerald-500' }
              ].map((m, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
                  <span className={`material-symbols-outlined ${m.color} mb-1 text-2xl`}>{m.icon}</span>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{m.label}</p>
                  <p className="text-xs font-bold text-text-main">{m.val}</p>
                </div>
              ))}
            </div>

            <div className="p-1.5 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <div className="p-3 bg-background-light rounded-xl text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <input type="text" placeholder="Will this fit on a small desk?" className="flex-1 border-none focus:ring-0 text-sm font-medium text-text-main placeholder:text-text-secondary/50" />
              <button className="bg-primary/10 p-2.5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all mr-1">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${added ? 'bg-green-500 text-white shadow-green-200' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'}`}
              >
                <span className="material-symbols-outlined text-2xl">{added ? 'check_circle' : 'shopping_cart'}</span>
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl font-bold text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PlantDetail;
