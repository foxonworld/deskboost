import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { getCatalogPlants } from '../services/plantApi';
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
        const res = await getCatalogPlants();
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
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 items-center">{filters.map(filter => (<button key={filter.name} onClick={() => setActiveFilter(filter.name)} className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeFilter === filter.name ? 'bg-primary text-[#111813] shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary'}`}><span className="material-symbols-outlined text-[18px]">{filter.icon}</span>{filter.label || filter.name}</button>))}</div>
          <div className="flex items-center gap-4"><div className="md:hidden flex-1 relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium" placeholder="Tìm kiếm..." /></div><div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"><span className="hidden sm:inline">Sắp xếp:</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border-none focus:ring-0 text-[#111813] dark:text-white font-bold cursor-pointer outline-none"><option>Phổ biến</option><option>Giá: Thấp đến Cao</option><option>Giá: Cao đến Thấp</option></select></div></div>
        </div>
        <div className="hidden md:block relative mb-8 max-w-md"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary/30 font-medium" placeholder="Tìm kiếm sản phẩm..." /></div>
        {isLoading ? <LoadingState message="Loading..." /> : sortedAndFilteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredPlants.map(plant => (<div key={plant.id} className="group flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"><div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800"><span className="absolute top-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50] shadow-sm dark:bg-black/60">Liên hệ</span><img src={plant.image || plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div><div className="p-4 flex flex-col flex-grow"><div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-start sm:justify-between"><h3 className="text-lg font-bold text-[#111813] dark:text-white line-clamp-1">{plant.name}</h3><div className="flex flex-col items-end"><span className="text-lg font-black text-primary">{formatVND(plant.price || 0)}</span>{plant.originalPrice && plant.originalPrice > plant.price && <span className="text-xs text-slate-400 line-through font-bold">{formatVND(plant.originalPrice)}</span>}</div></div><p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 font-medium">{plant.description}</p><p className="mb-4 rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary">Contact-only: xem chi tiết để liên hệ, không có giỏ hàng/thanh toán.</p><div className="flex flex-wrap gap-2 mb-4 mt-auto">{plant.tags?.map(tag => <span key={tag} className="px-2 py-1 rounded bg-background-light dark:bg-background-dark text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1 uppercase tracking-wider">{tag}</span>)}</div><Link to={`/plants/${plant.id}`} className="w-full py-2.5 rounded-lg bg-primary hover:bg-[#25d360] active:scale-95 text-[#111813] text-sm font-bold transition-all flex items-center justify-center gap-2">Xem giá & liên hệ</Link></div></div>))}
          </div>
        ) : <EmptyState title="No data found" description="No marketplace items match your filters." action={<button type="button" onClick={() => { setSearchTerm(''); setActiveFilter('Tất cả'); }} className="text-primary font-bold hover:underline focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg px-2 py-1">Try again</button>} />}
      </main>
    </div>
  );
};

export default PlantList;
