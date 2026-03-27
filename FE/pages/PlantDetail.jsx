
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND, getProductById } from '../data/mockData';
import { useCart } from '../context/CartContext';

const PlantDetail = () => {
  const { plantId } = useParams();
  const plant = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
  const { addItem, addItems } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedRelated, setSelectedRelated] = useState(plant.relatedProductIds || []);

  const relatedProducts = (plant.relatedProductIds || []).map(id => getProductById(id)).filter(Boolean);

  const calculateCombo = () => {
    const basePrice = plant.price;
    const relatedPrice = selectedRelated.reduce((sum, id) => {
      const p = getProductById(id);
      return sum + (p ? p.price : 0);
    }, 0);
    const subtotal = basePrice + relatedPrice;
    const discount = plant.comboDiscount || 0;
    const discountAmount = (subtotal * discount) / 100;
    return { subtotal, discountAmount, total: subtotal - discountAmount };
  };

  const combo = calculateCombo();

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
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(toCartItem());
    navigate('/cart');
  };

  const handleAddCombo = () => {
    const items = [
      toCartItem(),
      ...selectedRelated.map(id => {
        const p = getProductById(id);
        const discountScale = 1 - (plant.comboDiscount || 0) / 100;
        return {
          id: p.id,
          name: p.name,
          image: p.image,
          price: p.price * discountScale, // Apply discount to each item or just handle it here
          quantity: 1
        };
      })
    ];
    // NOTE: The main item also gets a discount in a combo!
    const updatedItems = items.map(item => ({
      ...item,
      price: item.price * (1 - (plant.comboDiscount || 0) / 100)
    }));
    
    addItems(updatedItems);
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
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">Bestseller</span>
                {plant.originalPrice && plant.originalPrice > plant.price && (
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-red-200">
                    SALE {Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)}%
                  </span>
                )}
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
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-primary">{formatVND(plant.price)}</span>
                  {plant.originalPrice && plant.originalPrice > plant.price && (
                    <span className="text-lg font-bold text-slate-400 line-through">{formatVND(plant.originalPrice)}</span>
                  )}
                </div>
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
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${isAdded ? 'bg-green-500 text-white shadow-green-200' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'}`}
              >
                <span className="material-symbols-outlined text-2xl">{isAdded ? 'check_circle' : 'shopping_cart'}</span>
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
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

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-20">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tight uppercase">Mua kèm ưu đãi</h3>
                <p className="text-text-secondary font-medium">Bí kíp để cây của bạn luôn xanh tốt • Tiết kiệm tới {plant.comboDiscount}%</p>
              </div>
              <div className="hidden md:flex gap-2">
                 <div className="size-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                   <span className="material-symbols-outlined">chevron_left</span>
                 </div>
                 <div className="size-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                   <span className="material-symbols-outlined">chevron_right</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-8 flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar">
                {/* Main Item */}
                <div className="min-w-[200px] space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary relative shadow-lg">
                    <img src={plant.image} className="w-full h-full object-cover" alt={plant.name} />
                    <div className="absolute inset-0 bg-primary/10"></div>
                    <div className="absolute top-2 right-2 size-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">
                      <span className="material-symbols-outlined text-sm font-black">check</span>
                    </div>
                  </div>
                  <p className="text-xs font-black text-center truncate px-2">{plant.name}</p>
                </div>

                <div className="flex-shrink-0 text-gray-300 font-bold text-3xl">+</div>

                {/* Related Items */}
                {relatedProducts.map(p => {
                  const isSelected = selectedRelated.includes(p.id);
                  return (
                    <React.Fragment key={p.id}>
                      <div 
                        onClick={() => setSelectedRelated(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                        className="min-w-[200px] space-y-4 cursor-pointer group"
                      >
                        <div className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative ${isSelected ? 'border-primary shadow-lg' : 'border-transparent grayscale opacity-60 hover:grayscale-0 hover:opacity-100 shadow-sm'}`}>
                          <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                          {isSelected && (
                            <div className="absolute top-2 right-2 size-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">
                              <span className="material-symbols-outlined text-sm font-black">check</span>
                            </div>
                          )}
                        </div>
                        <div className="text-center px-2">
                           <p className="text-xs font-black truncate">{p.name}</p>
                           <p className="text-sm font-bold text-primary mt-1">{formatVND(p.price)}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="md:col-span-4 bg-white rounded-[32px] border border-gray-100 p-8 flex flex-col justify-between shadow-2xl shadow-primary/5">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
                    <span>Tổng đơn lẻ:</span>
                    <span className="line-through">{formatVND(combo.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-primary uppercase tracking-widest">Ưu đãi Combo:</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">-{plant.comboDiscount}%</span>
                  </div>
                  <div className="h-[2px] bg-gray-50 dark:bg-white/5 my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-text-main">Giá Combo:</span>
                    <span className="text-4xl font-black text-primary tracking-tight">{formatVND(combo.total)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleAddCombo}
                  disabled={selectedRelated.length === 0}
                  className="mt-10 w-full py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                >
                  <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
                  Mua trọn bộ ngay
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PlantDetail;
