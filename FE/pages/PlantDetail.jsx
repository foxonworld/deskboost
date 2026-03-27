
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
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link> <span>/</span> <Link to="/plants" className="hover:text-primary transition-colors">Cửa hàng</Link> <span>/</span> <span className="text-text-main font-black">{plant.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 bg-white group border border-gray-100">
              <img src={plant.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={plant.name} />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">BÁN CHẠY</span>
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
                <span className="text-[10px] font-black uppercase tracking-wider mt-1">Xem Video</span>
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
                  <span className="text-lg">{plant.rating || '4.8'}</span>
                  <span className="text-sm text-text-secondary underline ml-2 cursor-pointer hover:text-primary transition-colors">{plant.reviewCount || '12'} Đánh giá</span>
                </div>
              </div>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#f0f4f2] dark:bg-white/10 text-xs font-bold text-[#111813] dark:text-white gap-1.5 border border-transparent dark:border-white/5">
                <span className="material-symbols-outlined text-primary text-base">air</span> Lọc không khí
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-xs font-bold text-primary gap-1.5 border border-primary/20">
                <span className="material-symbols-outlined text-base">verified</span> Bảo hành sức khỏe
              </div>
            </div>

            {/* Care Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-yellow-500">wb_sunny</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Ánh sáng</p>
                <p className="text-xs font-bold">{plant.light}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-blue-500">water_drop</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Tưới nước</p>
                <p className="text-xs font-bold">{plant.water}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-green-500">spa</span>
                <p className="text-[10px] font-black uppercase text-gray-400">Độ khó</p>
                <p className="text-xs font-bold">{plant.difficulty}</p>
              </div>
            </div>

            {/* Frequently Bought Together (Combo) Section */}
            {relatedProducts.length > 0 && (
              <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#111813] dark:text-white flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary text-lg">auto_fix_high</span>
                       Gợi ý mua kèm
                    </h3>
                    <p className="text-[10px] font-bold text-primary mt-0.5">Tiết kiệm ngay {plant.comboDiscount}% khi mua trọn bộ</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Main Product (Fixed) */}
                  <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-primary/10">
                    <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate text-slate-400">Sản phẩm hiện tại</p>
                      <p className="text-xs font-black truncate">{plant.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-primary">{formatVND(plant.price * (1 - (plant.comboDiscount || 0) / 100))}</p>
                    </div>
                  </div>

                  {/* Plus icon divider */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-white dark:bg-surface-dark px-2 text-slate-300">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </div>
                  </div>

                  {/* Related Products */}
                  {relatedProducts.map(p => {
                    const isSelected = selectedRelated.includes(p.id);
                    const discountedPrice = p.price * (1 - (plant.comboDiscount || 0) / 100);
                    
                    return (
                      <button 
                        key={p.id}
                        onClick={() => setSelectedRelated(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-transparent bg-slate-50 dark:bg-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="size-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-xs font-black">check</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-black truncate">{p.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-primary">{formatVND(discountedPrice)}</span>
                            <span className="text-[9px] text-slate-400 line-through font-bold">{formatVND(p.price)}</span>
                          </div>
                        </div>
                        <div className={`size-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-black/20'}`}>
                          {isSelected && <span className="material-symbols-outlined text-xs font-black">check</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Summary & Call to Action */}
                {selectedRelated.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng cộng Combo</p>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 line-through mb-1">{formatVND(combo.subtotal)}</p>
                        <p className="text-xl font-black text-primary leading-none">{formatVND(combo.total)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddCombo}
                      className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                       <span className="material-symbols-outlined text-sm">shopping_basket</span>
                       Thêm trọn bộ vào giỏ
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 ${isAdded ? 'bg-green-500 text-white shadow-green-200' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'}`}
              >
                <span className="material-symbols-outlined text-2xl">{isAdded ? 'check_circle' : 'shopping_cart'}</span>
                {isAdded ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 rounded-2xl font-bold text-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>


      </main>
    </div>
  );
};

export default PlantDetail;
