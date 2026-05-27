import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { getCatalogPlants } from '../services/plantApi';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import { Badge, Chip } from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';

const normalizeItems = (res) => (Array.isArray(res) ? res : res?.items || res?.data || []);

const PlantList = () => {
  const pageRef = useRef(null);
  const gridRevealedRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Phổ biến');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getCatalogPlants();
        const items = normalizeItems(res);
        if (alive) setPlants(items.length ? items : PRODUCTS);
      } catch (err) {
        if (alive) {
          setPlants(PRODUCTS);
          setError('Đang hiển thị dữ liệu mẫu vì chưa kết nối được máy chủ.');
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  useGSAP(() => {
    if (isLoading || gridRevealedRef.current) return;

    const q = gsap.utils.selector(pageRef);
    const reveal = getRevealVars(reducedMotion, motionDistances.md);
    const cards = q('[data-motion="marketplace-card"]');
    const fallbackNotice = q('[data-motion="marketplace-fallback"]');

    if (fallbackNotice.length) {
      gsap.fromTo(fallbackNotice, reveal.from, {
        ...reveal.to,
        duration: reducedMotion ? reveal.to.duration : 0.18,
        stagger: 0,
      });
    }

    if (cards.length) {
      gsap.fromTo(cards, reveal.from, {
        ...reveal.to,
        duration: reducedMotion ? reveal.to.duration : 0.28,
        stagger: reducedMotion ? 0 : 0.04,
      });
    }

    gridRevealedRef.current = true;
  }, { scope: pageRef, dependencies: [isLoading, reducedMotion] });

  const filters = [
    { name: 'Tất cả', icon: 'filter_list' },
    { name: 'Pot', icon: 'nest_eco_leaf', label: 'Chậu cây' },
    { name: 'Soil', icon: 'grass', label: 'Đất trồng' },
    { name: 'Fertilizer', icon: 'spa', label: 'Phân bón' },
    { name: 'Accessory', icon: 'handyman', label: 'Phụ kiện' },
  ];

  const sortedAndFilteredPlants = useMemo(() => plants
    .filter(p => p.status === 'Active' || p.status === 'Out of Stock')
    .filter(plant => {
      const matchesSearch = (plant.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'Tất cả' || plant.tags?.includes(activeFilter) || plant.category === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'Giá: Thấp đến Cao') return a.price - b.price;
      if (sortBy === 'Giá: Cao đến Thấp') return b.price - a.price;
      return 0;
    }), [plants, searchTerm, activeFilter, sortBy]);

  const resultLabel = isLoading ? 'Đang tải' : `${sortedAndFilteredPlants.length} lựa chọn`;

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <section className="mb-6 overflow-hidden rounded-3xl border border-[#E4EEE6] bg-surface-light shadow-sm dark:border-[#2A4532] dark:bg-surface-dark">
          <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_0.65fr] md:p-8">
            <div className="flex flex-col justify-between gap-6">
              <div>
                <Badge tone="primary" size="md" icon="storefront" className="mb-4">Marketplace contact-only</Badge>
                <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">
                  Chọn cây bàn làm việc đẹp, dễ chăm, liên hệ trực tiếp người bán.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-text-secondary dark:text-slate-300 md:text-lg">
                  DeskBoost giúp bạn duyệt cây, xem mức giá tham khảo và kiểm tra độ phù hợp chăm sóc. Không giỏ hàng, không checkout, không thanh toán trong app.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['support_agent', 'Liên hệ thủ công', 'Trao đổi qua kênh người bán'],
                  ['psychiatry', 'Phù hợp bàn làm việc', 'Ưu tiên cây nhỏ gọn, dễ chăm'],
                  ['verified', 'MVP minh bạch', 'Xem giá trước, quyết định sau'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="rounded-2xl border border-[#E4EEE6] bg-white/70 p-4 dark:border-[#2A4532] dark:bg-white/5">
                    <span className="material-symbols-outlined text-xl text-primary" aria-hidden="true">{icon}</span>
                    <p className="mt-2 text-sm font-bold text-[#111813] dark:text-white">{title}</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-text-secondary dark:text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-primary/15 bg-primary/10 p-5 dark:border-primary/25 dark:bg-primary/15">
              <p className="text-sm font-extrabold text-primary dark:text-green-200">Quy trình mua hiện tại</p>
              <ol className="mt-4 space-y-4 text-sm font-semibold text-[#111813] dark:text-white">
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>Chọn cây phù hợp góc làm việc.</li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>Mở chi tiết để xem mô tả và giá.</li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">3</span>Liên hệ người bán để tư vấn/chốt đơn ngoài app.</li>
              </ol>
            </div>
          </div>
        </section>

        {error && <StateNotice tone="warning" className="mb-6" data-motion="marketplace-fallback">{error}</StateNotice>}

        <section className="sticky top-[65px] z-40 -mx-4 mb-8 border-y border-[#E4EEE6] bg-background-light/95 px-4 py-4 backdrop-blur-sm dark:border-[#2A4532] dark:bg-background-dark/95 md:mx-0 md:rounded-3xl md:border md:px-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
              {filters.map(filter => (
                <Chip key={filter.name} active={activeFilter === filter.name} icon={filter.icon} onClick={() => setActiveFilter(filter.name)}>
                  {filter.label || filter.name}
                </Chip>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] lg:w-[520px]">
              <label className="relative block">
                <span className="sr-only">Tìm kiếm sản phẩm</span>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">search</span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-[#E4EEE6] bg-white pl-12 pr-4 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-primary/20 dark:border-[#2A4532] dark:bg-surface-dark dark:text-white"
                  placeholder="Tìm cây, chậu, phụ kiện..."
                />
              </label>
              <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-[#E4EEE6] bg-white px-4 text-sm font-semibold text-text-secondary dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300">
                <span className="material-symbols-outlined text-base" aria-hidden="true">sort</span>
                <span className="sr-only">Sắp xếp</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-[#111813] outline-none dark:text-white">
                  <option>Phổ biến</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-text-secondary dark:text-slate-400">
            <span>{resultLabel} · {activeFilter === 'Tất cả' ? 'Tất cả danh mục' : activeFilter}</span>
            <span>Liên hệ người bán để tư vấn, không thanh toán trong DeskBoost.</span>
          </div>
        </section>

        {isLoading ? (
          <LoadingState message="Đang tải marketplace contact-only..." />
        ) : sortedAndFilteredPlants.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Danh sách sản phẩm marketplace">
            {sortedAndFilteredPlants.map(plant => (
              <Card key={plant.id} padding="none" interactive className="group flex flex-col overflow-hidden" data-motion="marketplace-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                    <Badge tone="overlay" icon="forum">Liên hệ</Badge>
                  </div>
                  {(plant.status === 'Out of Stock') && <Badge tone="warning" className="absolute right-3 top-3 z-10">Tạm hết</Badge>}
                  <img src={plant.image || plant.imageUrl} alt={plant.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-grow flex-col p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{plant.category || plant.tags?.[0] || 'Desk plant'}</p>
                      <h2 className="mt-1 line-clamp-1 text-lg font-extrabold tracking-tight text-[#111813] dark:text-white">{plant.name}</h2>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-lg font-extrabold text-primary">{formatVND(plant.price || 0)}</span>
                      {plant.originalPrice && plant.originalPrice > plant.price && <span className="text-xs font-bold text-slate-400 line-through">{formatVND(plant.originalPrice)}</span>}
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{plant.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {plant.tags?.slice(0, 3).map(tag => <Badge key={tag} tone="neutral">{tag}</Badge>)}
                  </div>
                  <div className="mt-auto rounded-2xl border border-primary/15 bg-primary/5 p-3 dark:border-primary/20 dark:bg-primary/10">
                    <p className="text-xs font-bold leading-5 text-primary dark:text-green-200">Contact-only · Xem chi tiết trước, liên hệ người bán sau.</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button to={`/plants/${plant.id}`} variant="secondary" size="sm" className="w-full">Xem chi tiết</Button>
                    <Button to={`/plants/${plant.id}`} size="sm" className="w-full">Liên hệ người bán</Button>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <EmptyState
            title="Không tìm thấy cây phù hợp"
            description="Thử đổi từ khóa hoặc danh mục. Marketplace vẫn đang ở mô hình xem giá và liên hệ trực tiếp người bán."
            action={<Button variant="secondary" size="sm" onClick={() => { setSearchTerm(''); setActiveFilter('Tất cả'); }}>Xóa bộ lọc</Button>}
          />
        )}

        <Card variant="subtle" radius="hero" className="mt-10">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge tone="success" icon="verified" className="mb-3">Minh bạch MVP</Badge>
              <h2 className="text-xl font-extrabold text-[#111813] dark:text-white">DeskBoost không xử lý thanh toán trong marketplace.</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">Trang này tập trung giúp bạn duyệt cây nhanh, hiểu mức giá, sau đó liên hệ người bán để tư vấn thủ công qua kênh phù hợp.</p>
            </div>
            <Button to="/" variant="ghost" size="sm">Tìm hiểu DeskBoost</Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PlantList;
