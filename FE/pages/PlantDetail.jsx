
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { useCart } from '../context/CartContext';

const PlantDetail = () => {
  const { plantId } = useParams();
  const plant = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  // Build a CartItem from the Product
  const toCartItem = (qty = 1) => ({
    id: plant.id,
    name: plant.name,
    image: plant.image,
    price: plant.price,
    quantity: qty,
  });

  const handleAddToCart = () => {
    addItem(toCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(toCartItem());
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
              <span className="text-4xl font-black text-primary">{formatVND(plant.price)}</span>
                <div className="flex items-center gap-1 font-bold text-text-main">
                  <span className="material-symbols-outlined text-yellow-500 text-xl fill-1">star</span>
                  <span className="text-lg">4.8</span>
                  <span className="text-sm text-text-secondary underline ml-2 cursor-pointer hover:text-primary transition-colors">12 Reviews</span>
                </div>
              </div>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f0f4f2] dark:bg-white/10 text-xs font-bold text-[#111813] dark:text-white gap-1.5 border border-transparent dark:border-white/5">
                <span className="material-symbols-outlined text-primary text-base">air</span> Air Purifying
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-xs font-bold text-primary gap-1.5 border border-primary/20">
                <span className="material-symbols-outlined text-base">verified</span> Healthy Guarantee
              </div>
            </div>

            {/* Care Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-yellow-500">wb_sunny</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Light</p>
                <p className="text-xs font-bold">Bright Indirect</p>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-blue-500">water_drop</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Water</p>
                <p className="text-xs font-bold">Weekly</p>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-green-500">spa</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Care</p>
                <p className="text-xs font-bold">Beginner</p>
              </div>
            </div>

            {/* AI Chatbot Placeholder */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-400 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-500"></div>
              <div className="p-1 pr-2 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/10 flex items-center gap-3 relative">
                <div className="p-3 bg-[#f0f4f2] dark:bg-black/20 rounded-lg text-primary">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">DeskBoost AI Helper</p>
                  <input className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-[#111813] dark:text-white placeholder:text-gray-400" placeholder="Ask about this plant..." type="text"/>
                </div>
                <button className="bg-primary/20 hover:bg-primary text-primary hover:text-white p-1.5 rounded-lg transition-all">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
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
