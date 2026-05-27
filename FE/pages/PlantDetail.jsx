import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND, getProductById } from '../data/mockData';
import { getVerifiedFeedback } from '../services/feedbackApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';

const PlantDetail = () => {
  const pageRef = useRef(null);
  const feedbackRevealedRef = useRef(false);
  const { plantId } = useParams();
  const plant = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  const relatedProducts = (plant.relatedProductIds || []).map(id => getProductById(id)).filter(Boolean);
  const isPlant = plant.category !== 'Pot' && plant.category !== 'Soil' && plant.category !== 'Fertilizer' && plant.category !== 'Accessory';
  const careHighlights = [
    { icon: 'wb_sunny', label: 'Ánh sáng', value: plant.light || 'Tư vấn theo vị trí đặt', tone: 'text-amber-500' },
    { icon: 'water_drop', label: 'Tưới nước', value: plant.water || 'Theo tình trạng cây', tone: 'text-sky-500' },
    { icon: 'psychiatry', label: 'Độ chăm', value: plant.difficulty || 'Hỏi người bán', tone: 'text-primary' },
  ];
  const trustStats = [
    ['verified', 'Phản hồi xác minh', `${plant.reviewCount || feedbackItems.length || 0} ghi nhận`],
    ['forum', 'Tư vấn trước khi chốt', 'Zalo/Messenger'],
    ['payments', 'Không thanh toán trong app', 'Contact-only MVP'],
  ];

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

  useGSAP(() => {
    const q = gsap.utils.selector(pageRef);
    const reveal = getRevealVars(reducedMotion, motionDistances.md);

    gsap.fromTo(q('[data-motion="detail-hero"]'), reveal.from, {
      ...reveal.to,
      duration: reducedMotion ? reveal.to.duration : 0.3,
      stagger: reducedMotion ? 0 : 0.05,
    });

    gsap.fromTo(q('[data-motion="detail-trust"]'), reveal.from, {
      ...reveal.to,
      duration: reducedMotion ? reveal.to.duration : 0.24,
      stagger: reducedMotion ? 0 : 0.04,
    });

    gsap.fromTo(q('[data-motion="detail-mobile-cta"]'), reveal.from, {
      ...reveal.to,
      duration: reducedMotion ? reveal.to.duration : 0.22,
      stagger: 0,
    });
  }, { scope: pageRef, dependencies: [reducedMotion] });

  useGSAP(() => {
    if (feedbackLoading || feedbackRevealedRef.current) return;

    const q = gsap.utils.selector(pageRef);
    const feedbackCards = q('[data-motion="detail-feedback"]');
    if (!feedbackCards.length) return;

    const reveal = getRevealVars(reducedMotion, motionDistances.sm);
    gsap.fromTo(feedbackCards, reveal.from, {
      ...reveal.to,
      duration: reducedMotion ? reveal.to.duration : 0.22,
      stagger: reducedMotion ? 0 : 0.04,
    });
    feedbackRevealedRef.current = true;
  }, { scope: pageRef, dependencies: [feedbackLoading, reducedMotion] });

  const handleContactFacebook = () => {
    alert("Đang chuyển hướng tới Facebook để nhắn tin...");
    window.open("https://m.me/deskboost", "_blank");
  };

  const handleContactZalo = () => {
    alert("Đang chuyển hướng tới Zalo để nhắn tin...");
    window.open("https://zalo.me/YOUR_ZALO_NUMBER", "_blank");
  };

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-28 pt-6 md:pb-12 md:pt-10">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm font-bold text-text-secondary dark:text-slate-400" aria-label="Điều hướng chi tiết cây">
          <Link to="/" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <Link to="/plants" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg">Marketplace</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111813] dark:text-white">{plant.name}</span>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start" aria-labelledby="plant-detail-heading">
          <div className="space-y-5">
            <Card padding="none" radius="hero" className="group overflow-hidden" data-motion="detail-hero">
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                <img src={plant.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={plant.name} />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge tone="overlay" icon="spa">Care-fit</Badge>
                  {plant.status === 'Out of Stock' ? <Badge tone="warning">Tạm hết</Badge> : <Badge tone="overlay" icon="forum">Có thể liên hệ</Badge>}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3" aria-label="Tóm tắt chăm sóc cây" data-motion="detail-hero">
              {careHighlights.map(item => (
                <Card key={item.label} padding="compact" className="text-center">
                  <span className={`material-symbols-outlined text-2xl ${item.tone}`} aria-hidden="true">{item.icon}</span>
                  <p className="mt-2 text-[11px] font-extrabold text-text-secondary dark:text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-[#111813] dark:text-white">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card radius="hero" variant="elevated" className="overflow-hidden" data-motion="detail-hero">
              <div className="flex flex-wrap gap-2">
                <Badge tone="primary" size="md" icon="verified">Contact-first</Badge>
                <Badge tone="neutral" size="md">{plant.category || 'Desk plant'}</Badge>
              </div>
              <h1 id="plant-detail-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">{plant.name}</h1>
              <p className="mt-2 text-base font-semibold italic text-text-secondary dark:text-slate-300">{plant.species}</p>
              <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{plant.description}</p>

              <div className="mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-4 dark:border-primary/25 dark:bg-primary/10">
                <p className="text-xs font-extrabold text-primary dark:text-green-200">Giá tham khảo</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-extrabold text-primary">{formatVND(plant.price)}</span>
                  {plant.originalPrice && plant.originalPrice > plant.price && (
                    <span className="pb-1 text-sm font-bold text-text-secondary line-through dark:text-slate-500">{formatVND(plant.originalPrice)}</span>
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-text-secondary dark:text-slate-300">DeskBoost hiển thị giá để bạn cân nhắc trước; tư vấn và chốt mua diễn ra qua kênh người bán.</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button variant="channel" size="lg" onClick={handleContactZalo} className="w-full bg-[#0068FF] hover:bg-[#0055d4]">Nhắn Zalo</Button>
                <Button variant="channel" size="lg" onClick={handleContactFacebook} className="w-full bg-[#0866FF] hover:bg-[#0050d1]">Nhắn Messenger</Button>
              </div>
              <Button variant="secondary" size="md" onClick={handleContactZalo} className="mt-3 w-full">Liên hệ tư vấn cây này</Button>
              <p className="mt-3 text-center text-xs font-bold text-text-secondary dark:text-slate-400">Không giỏ hàng · Không checkout · Không thanh toán trong DeskBoost</p>
            </Card>
          </aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {trustStats.map(([icon, title, desc]) => (
            <Card key={title} className="flex gap-4" data-motion="detail-trust">
              <span className="material-symbols-outlined mt-0.5 text-primary" aria-hidden="true">{icon}</span>
              <div>
                <h2 className="text-sm font-extrabold text-[#111813] dark:text-white">{title}</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{desc}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card radius="hero" variant="subtle" aria-labelledby="workspace-fit-heading">
            <Badge tone="primary" icon="desk" className="mb-4">Phù hợp workspace</Badge>
            <h2 id="workspace-fit-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">Có hợp góc làm việc của bạn không?</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Vị trí đặt', isPlant ? 'Bàn làm việc, kệ sáng gián tiếp, góc học tập.' : 'Phụ kiện hỗ trợ setup cây bàn làm việc gọn hơn.'],
                ['Mức chăm', plant.difficulty || 'Hỏi người bán để chọn đúng routine.'],
                ['Khi nên hỏi người bán', 'Nếu phòng thiếu sáng, có điều hòa mạnh, hoặc cần cây ít rụng lá.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-[#E4EEE6] bg-white/70 p-4 dark:border-[#2A4532] dark:bg-white/5">
                  <p className="text-sm font-extrabold text-[#111813] dark:text-white">{title}</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card radius="hero" aria-labelledby="care-notes-heading">
            <Badge tone="success" icon="eco" className="mb-4">Plant care notes</Badge>
            <h2 id="care-notes-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">Ghi chú chăm sóc trước khi liên hệ</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">Mang theo vài thông tin khi nhắn người bán: vị trí đặt cây, mức sáng trong ngày, tần suất bạn có thể tưới và kích thước bàn/kệ. Người bán sẽ tư vấn lựa chọn phù hợp hơn thay vì app tự tạo checkout.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {careHighlights.map(item => (
                <div key={item.label} className="rounded-2xl bg-primary/5 p-4 dark:bg-primary/10">
                  <p className="text-xs font-extrabold text-primary dark:text-green-200">{item.label}</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#111813] dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-8" aria-labelledby="support-heading">
            <Card radius="hero" variant="subtle">
              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <Badge tone="neutral" icon="auto_fix_high" className="mb-4">Gợi ý hỗ trợ chăm sóc</Badge>
                  <h2 id="support-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">Có thể hỏi thêm khi nhắn người bán</h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">Các mục liên quan chỉ là gợi ý để cuộc tư vấn đầy đủ hơn. Không có chọn combo, không tổng tiền, không checkout trong app.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedProducts.map(p => (
                    <div key={p.id} className="flex gap-3 rounded-2xl border border-[#E4EEE6] bg-white/80 p-3 dark:border-[#2A4532] dark:bg-white/5">
                      <img src={p.image} alt={p.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-[#111813] dark:text-white">{p.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-text-secondary dark:text-slate-400">{p.description}</p>
                        <p className="mt-1 text-xs font-bold text-primary">Giá tham khảo: {formatVND(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        )}

        <section className="mt-8" aria-labelledby="verified-feedback-heading">
          <Card radius="hero">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <Badge tone="primary" icon="verified" className="mb-4">Verified feedback</Badge>
                <h2 id="verified-feedback-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">Phản hồi đã xác minh thủ công</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">Ghi nhận từ khách đã liên hệ/mua ngoài app qua Zalo, Messenger hoặc trao đổi thủ công. Dùng để tăng độ tin cậy, không thay thế tư vấn trực tiếp.</p>
              </div>
              <Badge tone="success" size="md">Manual trust</Badge>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {feedbackLoading ? (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500 dark:bg-white/5 dark:text-slate-300">Đang tải phản hồi xác minh...</p>
              ) : feedbackError ? (
                <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{feedbackError}</p>
              ) : feedbackItems.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#E4EEE6] p-4 text-sm font-bold text-text-secondary dark:border-[#2A4532] dark:text-slate-300">Chưa có phản hồi xác minh cho cây này.</p>
              ) : (
                feedbackItems.map((feedback) => (
                  <article key={feedback.id} className="rounded-2xl border border-[#E4EEE6] bg-slate-50 p-4 dark:border-[#2A4532] dark:bg-white/5" data-motion="detail-feedback">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-extrabold text-[#111813] dark:text-white">{feedback.customerAlias || 'Khách hàng DeskBoost'}</p>
                      <p className="text-xs font-extrabold text-yellow-500" aria-label={`${feedback.rating} trên 5 sao`}>{'★'.repeat(feedback.rating || 5)}</p>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">“{feedback.comment}”</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="primary">Liên hệ ngoài app</Badge>
                      <Badge tone="neutral">Xác minh thủ công</Badge>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Card>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4EEE6] bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:hidden dark:border-[#2A4532] dark:bg-background-dark/95" data-motion="detail-mobile-cta">
        <div className="mx-auto grid max-w-[520px] grid-cols-[1fr_auto] gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-[#111813] dark:text-white">{plant.name}</p>
            <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{formatVND(plant.price)} · contact-only</p>
          </div>
          <Button size="sm" onClick={handleContactZalo}>Liên hệ tư vấn</Button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
