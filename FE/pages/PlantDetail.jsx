import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND, getProductById } from '../data/mockData';
import { getMarketplacePlant } from '../services/plantApi';
import { getVerifiedFeedback } from '../services/feedbackApi';

const PlantDetail = () => {
  const { plantId } = useParams();
  const fallbackPlant = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
  const [plant, setPlant] = useState(fallbackPlant);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPlant = async () => {
      const nextFallback = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
      setPlant(nextFallback);
      try {
        const data = await getMarketplacePlant(plantId);
        if (active && data?.id) setPlant(data);
      } catch {
        if (active) setPlant(nextFallback);
      }
    };

    loadPlant();
    return () => { active = false; };
  }, [plantId]);

  const relatedProducts = (plant.relatedProductIds || []).map(id => getProductById(id)).filter(Boolean);

  useEffect(() => {
    let active = true;
    const loadFeedback = async () => {
      setFeedbackLoading(true);
      setFeedbackError('');
      try {
        const data = await getVerifiedFeedback({ catalogPlantId: plant.id });
        if (active) setFeedbackItems(data?.items || []);
      } catch (err) {
        if (active) setFeedbackError(err?.message || 'Could not load manually verified feedback.');
      } finally {
        if (active) setFeedbackLoading(false);
      }
    };

    loadFeedback();
    return () => { active = false; };
  }, [plant.id]);

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

  const handleContactFacebook = () => {
    alert("Đang chuyển hướng tới Facebook để nhắn tin...");
    window.open("https://m.me/deskboost", "_blank");
  };

  const handleContactZalo = () => {
    alert("Đang chuyển hướng tới Zalo để nhắn tin...");
    window.open("https://zalo.me/YOUR_ZALO_NUMBER", "_blank");
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

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card radius="hero" variant="elevated" className="overflow-hidden" data-motion="detail-hero">
              <div className="flex flex-wrap gap-2">
                <Badge tone="primary" size="md" icon="verified">{t('detail.contactFirst')}</Badge>
                <Badge tone="neutral" size="md">{plant.category || t('detail.fallbackCategory')}</Badge>
              </div>
              <h1 id="plant-detail-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">{plant.name}</h1>
              <p className="mt-2 text-base font-semibold italic text-text-secondary dark:text-slate-300">{plant.species}</p>
              <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{plant.description}</p>

              <div className="mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-4 dark:border-primary/25 dark:bg-primary/10">
                <p className="text-xs font-extrabold text-primary dark:text-green-200">{t('detail.referencePrice')}</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-extrabold text-primary">{plant.priceText || formatVND(plant.price || 0)}</span>
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
                <span className="material-symbols-outlined text-[#4CAF50]">spa</span>
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
                  </div>
                )}
              </div>
            )}

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-surface-dark" aria-labelledby="verified-feedback-heading">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Manually verified feedback</p>
                  <h2 id="verified-feedback-heading" className="mt-1 text-lg font-black text-text-main dark:text-white">Customer stories</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">Verified manually</span>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-text-secondary">Simple notes from customers who contacted DeskBoost outside the app.</p>

              <div className="mt-4 space-y-3">
                {feedbackLoading ? (
                  <p className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-400 dark:bg-white/5">Loading manually verified feedback...</p>
                ) : feedbackError ? (
                  <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{feedbackError}</p>
                ) : feedbackItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 p-3 text-xs font-bold text-slate-400 dark:border-slate-700">No manually verified feedback for this plant yet.</p>
                ) : (
                  feedbackItems.map((feedback) => (
                    <article key={feedback.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-text-main dark:text-white">{feedback.customerAlias || 'Customer from HCMC'}</p>
                        <p className="text-xs font-black text-yellow-500" aria-label={`${feedback.rating} out of 5 stars`}>{'★'.repeat(feedback.rating || 5)}</p>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-text-secondary">“{feedback.comment}”</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">Bought via Zalo</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-300">Verified manually</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleContactFacebook}
                className="w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 bg-[#0866FF] text-white hover:bg-[#0050d1]"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" className="w-7 h-7 filter brightness-0 invert" />
                Dự kiến mua qua Messenger
              </button>
              <button
                onClick={handleContactZalo}
                className="w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 bg-[#0068FF] text-white hover:bg-[#0055d4]"
              >
                Nhắn tin Zalo ngay
              </button>
            </div>
<<<<<<< Updated upstream
=======
          </Card>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4EEE6] bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:hidden dark:border-[#2A4532] dark:bg-background-dark/95" data-motion="detail-mobile-cta">
        <div className="mx-auto grid max-w-[520px] grid-cols-[1fr_auto] gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[#111813] dark:text-white">{plant.name}</p>
            <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{plant.priceText || formatVND(plant.price || 0)} · {t('detail.trust.contactOnly')}</p>
>>>>>>> Stashed changes
          </div>
        </div>

      </main>
    </div>
  );
};

export default PlantDetail;
