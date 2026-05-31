import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { getMarketplacePlants } from '../services/plantApi';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';

const normalizeItems = (res) => (Array.isArray(res) ? res : res?.items || res?.data || []);

const PlantList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Phổ biến');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getMarketplacePlants();
        const items = normalizeItems(res);
        if (alive) setPlants(items.length ? items : PRODUCTS);
      } catch (err) {
        if (alive) {
          setPlants(PRODUCTS);
          setError(err?.message || 'Backend unavailable. Showing marketplace fallback data.');
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-8 md:mb-12"><h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Tìm người bạn đồng hành hoàn hảo</h2><p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl font-medium">Mang sức sống đến không gian làm việc của bạn. Marketplace MVP chỉ hỗ trợ xem giá và liên hệ người bán.</p></div>
        {error && <StateNotice tone="warning" className="mb-6">{error}</StateNotice>}
        <div className="sticky top-[65px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0 py-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 items-center">{filters.map(filter => (<button key={filter.name} onClick={() => setActiveFilter(filter.name)} className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeFilter === filter.name ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary'}`}><span className="material-symbols-outlined text-[18px]">{filter.icon}</span>{filter.label || filter.name}</button>))}</div>
          <div className="flex items-center gap-4"><div className="md:hidden flex-1 relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" placeholder="Tìm kiếm..." /></div><div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"><span className="hidden sm:inline">Sắp xếp:</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none focus:ring-0 text-[#111813] dark:text-white font-bold cursor-pointer outline-none"><option>Phổ biến</option><option>Giá: Thấp đến Cao</option><option>Giá: Cao đến Thấp</option></select></div></div>
        </div>
        <div className="hidden md:block relative mb-8 max-w-md"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/30 font-medium" placeholder="Tìm kiếm sản phẩm..." /></div>
        {isLoading ? <LoadingState message="Loading..." /> : sortedAndFilteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredPlants.map(plant => (<div key={plant.id} className="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"><div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800"><span className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50] shadow-sm dark:bg-black/60">Liên hệ</span><img src={plant.image || plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div><div className="p-4 flex flex-col flex-grow"><div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-start sm:justify-between"><h3 className="text-lg font-bold text-[#111813] dark:text-white line-clamp-1">{plant.name}</h3><div className="flex flex-col items-end"><span className="text-lg font-black text-primary">{formatVND(plant.price || 0)}</span>{plant.originalPrice && plant.originalPrice > plant.price && <span className="text-xs text-slate-400 line-through font-bold">{formatVND(plant.originalPrice)}</span>}</div></div><p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 font-medium">{plant.description}</p><p className="mb-4 rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary">Contact-only: xem chi tiết để liên hệ, không có giỏ hàng/thanh toán.</p><div className="flex flex-wrap gap-2 mb-4 mt-auto">{plant.tags?.map(tag => <span key={tag} className="px-2 py-1 rounded bg-background-light dark:bg-background-dark text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 uppercase tracking-wider">{tag}</span>)}</div><Link to={`/plants/${plant.id}`} className="w-full py-2.5 rounded-lg bg-primary hover:bg-[#43A047] active:scale-95 text-white text-sm font-bold transition-all flex items-center justify-center gap-2">Xem giá & liên hệ</Link></div></div>))}
          </div>
<<<<<<< Updated upstream
        ) : <EmptyState title="No data found" description="No marketplace items match your filters." action={<button type="button" onClick={() => { setSearchTerm(''); setActiveFilter('Tất cả'); }} className="text-primary font-bold hover:underline focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg px-2 py-1">Try again</button>} />}
=======
        </section>

        {error && <StateNotice tone="warning" className="mb-6" data-motion="marketplace-fallback">{error}</StateNotice>}

        <section className="sticky top-[65px] z-40 -mx-4 mb-8 border-y border-[#E4EEE6] bg-background-light/95 px-4 py-4 backdrop-blur-sm dark:border-[#2A4532] dark:bg-background-dark/95 md:mx-0 md:rounded-3xl md:border md:px-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
              {filters.map(filter => (
                <Chip key={filter.value} active={activeFilter === filter.value} icon={filter.icon} onClick={() => setActiveFilter(filter.value)}>
                  {t(filter.labelKey)}
                </Chip>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] lg:w-[520px]">
              <label className="relative block">
                <span className="sr-only">{t('market.searchLabel')}</span>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">search</span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-[#E4EEE6] bg-white pl-12 pr-4 text-sm font-semibold outline-none transition-all focus:ring-4 focus:ring-primary/20 dark:border-[#2A4532] dark:bg-surface-dark dark:text-white"
                  placeholder={t('market.searchPlaceholder')}
                />
              </label>
              <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-[#E4EEE6] bg-white px-4 text-sm font-semibold text-text-secondary dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300">
                <span className="material-symbols-outlined text-base" aria-hidden="true">sort</span>
                <span className="sr-only">{t('market.sortLabel')}</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-[#111813] outline-none dark:text-white">
                  <option value="popular">{t('market.sort.popular')}</option>
                  <option value="priceAsc">{t('market.sort.priceAsc')}</option>
                  <option value="priceDesc">{t('market.sort.priceDesc')}</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-text-secondary dark:text-slate-400">
            <span>{resultLabel} · {activeFilter === 'all' ? t('market.result.allCategories') : t(filters.find((filter) => filter.value === activeFilter)?.labelKey || 'market.result.allCategories')}</span>
            <span>{t('market.result.contactOnly')}</span>
          </div>
        </section>

        {isLoading ? (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </section>
        ) : sortedAndFilteredPlants.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={t('market.listAria')}>
            {sortedAndFilteredPlants.map(plant => (
              <Card key={plant.id} padding="none" interactive={false} className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/20" data-motion="marketplace-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                    <Badge tone="overlay" icon="forum">{t('market.badge.contact')}</Badge>
                  </div>
                  {(plant.status === 'Out of Stock') && <Badge tone="warning" className="absolute right-3 top-3 z-10">{t('market.badge.outOfStock')}</Badge>}
                  <img src={plant.image || plant.imageUrl} alt={getProductDisplay(plant, 'name')} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
                <div className="flex flex-grow flex-col p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{getDisplayValue(plant.category || plant.tags?.[0]) || t('market.card.fallbackCategory')}</p>
                      <h2 className="mt-1 line-clamp-1 text-lg font-extrabold tracking-tight text-[#111813] dark:text-white">{getProductDisplay(plant, 'name')}</h2>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="block text-lg font-extrabold text-primary">{plant.priceText || formatVND(plant.price || 0)}</span>
                      {plant.originalPrice && plant.originalPrice > plant.price && <span className="text-xs font-bold text-slate-400 line-through">{formatVND(plant.originalPrice)}</span>}
                    </div>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{getProductDisplay(plant, 'description')}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {plant.tags?.slice(0, 3).map(tag => <Badge key={tag} tone="neutral">{getDisplayValue(tag)}</Badge>)}
                  </div>
                  <div className="mt-auto rounded-2xl border border-primary/15 bg-primary/5 p-3 dark:border-primary/20 dark:bg-primary/10">
                    <p className="text-xs font-bold leading-5 text-primary dark:text-green-200">{t('market.card.contactOnly')}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button to={`/plants/${plant.id}`} variant="secondary" size="sm" className="w-full">{t('market.card.detail')}</Button>
                    <Button to={`/plants/${plant.id}`} size="sm" className="w-full">{t('market.card.contactSeller')}</Button>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <EmptyState
            title={t('market.empty.title')}
            description={t('market.empty.description')}
            action={<Button variant="secondary" size="sm" onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}>{t('market.empty.clear')}</Button>}
          />
        )}

        <Card variant="subtle" radius="hero" className="mt-10">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge tone="success" icon="verified" className="mb-3">{t('market.transparency.badge')}</Badge>
              <h2 className="text-xl font-extrabold text-[#111813] dark:text-white">{t('market.transparency.title')}</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{t('market.transparency.description')}</p>
            </div>
            <Button to="/" variant="ghost" size="sm">{t('market.transparency.cta')}</Button>
          </div>
        </Card>
>>>>>>> Stashed changes
      </main>
    </div>
  );
};

export default PlantList;
