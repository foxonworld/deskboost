import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMarketplacePlants } from '../services/plantApi';
import { filterMarketplacePlants, getAllMarketplacePlants } from '../services/marketplaceCatalog';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import { Badge, Chip } from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';
import { formatVND } from '../utils/currency';
import { getCareScaleDisplay } from '../utils/careDisplay';
import { useI18n } from '../i18n';
import { trackEvent } from '../utils/analytics';

const getProductTranslationKey = (plant, field) => `market.product.${plant.id}.${field}`;

const displayValueKeys = {
  'Trong nhà': 'market.value.indoor',
  'Dễ chăm': 'market.value.easyCare',
  'Ánh sáng vừa': 'market.value.mediumLight',
  'Ánh sáng thấp': 'market.value.lowLight',
  'Lọc không khí': 'market.value.airPurifying',
  'Mọc nhanh': 'market.value.fastGrowing',
  'Gốm': 'market.value.ceramic',
  'Thoát nước tốt': 'market.value.wellDraining',
  'Dinh dưỡng': 'market.value.nutritious',
  'Ánh sáng gián tiếp': 'market.value.indirectLight',
  'Bóng mát một phần': 'market.value.partialShade',
  'Mỗi 1–2 tuần': 'market.value.everyOneTwoWeeks',
  'Mỗi 3–4 tuần': 'market.value.everyThreeFourWeeks',
  'Hàng tuần': 'market.value.weekly',
  'Sơ cấp': 'market.value.beginner',
  Pot: 'market.filter.pot',
  pot: 'market.filter.pot',
  Soil: 'market.filter.soil',
  soil: 'market.filter.soil',
  Fertilizer: 'market.filter.fertilizer',
  fertilizer: 'market.filter.fertilizer',
  Accessory: 'market.filter.accessory',
  accessory: 'market.filter.accessory',
  'N/A': 'market.value.notApplicable',
};

const SkeletonCard = () => (
  <Card variant="glass" radius="hero" padding="none" className="flex flex-col overflow-hidden">
    <div className="relative aspect-[4/3] m-2.5 rounded-[1.25rem] bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
    <div className="flex flex-grow flex-col px-4 pb-4 space-y-3">
      <div className="flex justify-between items-center gap-2">
        <div className="h-3 w-1/4 bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse" />
        <div className="h-5 w-1/3 bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>
      <div className="h-5 w-3/4 bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse" />
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-12 bg-slate-200/70 dark:bg-slate-700/50 rounded-full animate-pulse" />
        <div className="h-5 w-16 bg-slate-200/70 dark:bg-slate-700/50 rounded-full animate-pulse" />
      </div>
      <div className="h-[20px] bg-slate-200/70 dark:bg-slate-700/50 rounded-md animate-pulse mt-auto" />
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="h-[36px] bg-slate-200/70 dark:bg-slate-700/50 rounded-full animate-pulse" />
        <div className="h-[36px] bg-slate-200/70 dark:bg-slate-700/50 rounded-full animate-pulse" />
      </div>
    </div>
  </Card>
);

const PlantList = () => {
  const pageRef = useRef(null);
  const gridRevealedRef = useRef(false);
  const itemListTrackedRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getAllMarketplacePlants(getMarketplacePlants);
        const items = res.items;
        if (alive) setPlants(items);
      } catch (err) {
        if (alive) {
          setPlants([]);
          setError(t('market.fallbackNotice'));
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [t]);

  useEffect(() => {
    if (itemListTrackedRef.current || plants.length === 0) return;

    itemListTrackedRef.current = true;
    trackEvent('view_item_list', {
      item_list_id: 'deskboost_marketplace',
      item_list_name: 'DeskBoost Marketplace',
      currency: 'VND',
      items: plants.slice(0, 20).map((plant, index) => ({
        item_id: String(plant.id),
        item_name: plant.name,
        item_category: plant.category || 'Plant',
        index,
        price: Number(plant.price) || 0,
        quantity: 1,
      })),
    });
  }, [plants]);

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
    { value: 'all', icon: 'filter_list', labelKey: 'market.filter.all' },
    { value: 'plant', icon: 'potted_plant', labelKey: 'admin.category.plant' },
    { value: 'pot', icon: 'nest_eco_leaf', labelKey: 'market.filter.pot' },
    { value: 'soil', icon: 'grass', labelKey: 'market.filter.soil' },
    { value: 'fertilizer', icon: 'spa', labelKey: 'market.filter.fertilizer' },
    { value: 'accessory', icon: 'handyman', labelKey: 'market.filter.accessory' },
    { value: 'other', icon: 'category', labelKey: 'admin.category.other' },
  ];

  const getDisplayValue = (value) => {
    if (!value) return '';
    const key = displayValueKeys[value];
    return key ? t(key) : value;
  };

  const getProductDisplay = (plant, field) => {
    const key = getProductTranslationKey(plant, field);
    const translated = t(key);
    return translated === key ? plant[field] : translated;
  };

  const getTagDisplay = (tag, index) => {
    const metricType = index === 0 ? 'care' : index === 1 ? 'light' : '';
    const metricDisplay = metricType ? getCareScaleDisplay(metricType, tag, t) : null;
    return metricDisplay?.value || getDisplayValue(tag);
  };

  const sortedAndFilteredPlants = useMemo(
    () => filterMarketplacePlants(plants, { searchTerm, category: activeFilter, sortBy }),
    [plants, searchTerm, activeFilter, sortBy],
  );

  const resultLabel = isLoading ? t('market.result.loading') : t('market.result.count', { count: sortedAndFilteredPlants.length });
  const openPlantDetail = (plantId) => navigate(`/plants/${plantId}`);
  const handlePlantCardKeyDown = (event, plantId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openPlantDetail(plantId);
  };

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <section className="relative mb-6 overflow-hidden rounded-[2.5rem] border border-[#E4EEE6]/80 bg-white/70 backdrop-blur-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] dark:border-white/5 dark:bg-surface-dark/40">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/20 pointer-events-none" />
          <div className="relative z-10 grid gap-6 p-5 md:grid-cols-[1.35fr_0.65fr] md:p-8">
            <div className="flex flex-col justify-between gap-6">
              <div>
                <Badge tone="primary" size="md" icon="storefront" className="mb-4">{t('market.badge')}</Badge>
                <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">
                  {t('market.hero.title')}
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-text-secondary dark:text-slate-300 md:text-lg">
                  {t('market.hero.description')}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['support_agent', t('market.signal.contact.title'), t('market.signal.contact.desc')],
                  ['psychiatry', t('market.signal.fit.title'), t('market.signal.fit.desc')],
                  ['verified', t('market.signal.mvp.title'), t('market.signal.mvp.desc')],
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
              <p className="text-sm font-extrabold text-primary dark:text-green-200">{t('market.process.title')}</p>
              <ol className="mt-4 space-y-4 text-sm font-semibold text-[#111813] dark:text-white">
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>{t('market.process.step1')}</li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>{t('market.process.step2')}</li>
                <li className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">3</span>{t('market.process.step3')}</li>
              </ol>
            </div>
          </div>
        </section>

        {error && <StateNotice tone="warning" className="mb-6" data-motion="marketplace-fallback">{error}</StateNotice>}

        <div className="mb-4 lg:hidden">
          <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto]">
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-text-secondary dark:text-slate-400">
            <span>{resultLabel} · {activeFilter === 'all' ? t('market.result.allCategories') : t(filters.find((filter) => filter.value === activeFilter)?.labelKey || 'market.result.allCategories')}</span>
            <span>{t('market.result.contactOnly')}</span>
          </div>
        </div>

        <section className="relative -mx-4 mb-8 border-y border-[#E4EEE6]/80 bg-white/80 px-4 py-3 backdrop-blur-xl shadow-sm dark:border-white/10 dark:bg-surface-dark/80 md:mx-0 md:rounded-full md:border md:px-5 md:py-3.5 md:shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
              {filters.map(filter => (
                <Chip key={filter.value} active={activeFilter === filter.value} icon={filter.icon} onClick={() => setActiveFilter(filter.value)}>
                  {t(filter.labelKey)}
                </Chip>
              ))}
            </div>
            <div className="hidden lg:grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] lg:w-[520px]">
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
          <div className="mt-3 hidden lg:flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-text-secondary dark:text-slate-400">
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
            {sortedAndFilteredPlants.map(plant => {
              const cat = plant.category || plant.tags?.[0];
              const categoryDisplay = (!cat || cat.toLowerCase() === 'plant') ? 'Cây cảnh' : getDisplayValue(cat);
              
              return (
              <Card
                key={plant.id}
                variant="glass"
                radius="hero"
                padding="none"
                interactive={false}
                role="link"
                tabIndex={0}
                aria-label={`${t('market.card.detail')} ${getProductDisplay(plant, 'name')}`}
                onClick={() => openPlantDetail(plant.id)}
                onKeyDown={(event) => handlePlantCardKeyDown(event, plant.id)}
                className="group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:bg-white/95 dark:hover:bg-surface-dark/95 dark:hover:border-primary/30"
                data-motion="marketplace-card"
              >
                <div className="relative aspect-[4/3] m-2.5 overflow-hidden rounded-[1.25rem] bg-slate-100 dark:bg-slate-800/50">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute left-2.5 top-2.5 z-20 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-md dark:bg-black/50">
                      <span className="material-symbols-outlined text-[12px] text-primary dark:text-green-400">forum</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-white">{t('market.badge.contact')}</span>
                    </div>
                  </div>
                  {(plant.status === 'Out of Stock') && (
                    <div className="absolute right-2.5 top-2.5 z-20 flex items-center rounded-full bg-amber-500/90 px-2.5 py-1 backdrop-blur-md">
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-white">{t('market.badge.outOfStock')}</span>
                    </div>
                  )}
                  <img src={plant.image || plant.imageUrl} alt={getProductDisplay(plant, 'name')} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                <div className="flex flex-grow flex-col px-4 pb-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary/70 dark:text-green-400/80">{categoryDisplay}</p>
                    <div className="flex items-end gap-1.5 text-right">
                      {plant.originalPrice && plant.originalPrice > plant.price && <span className="mb-0.5 text-[10px] font-bold text-slate-400 line-through">{formatVND(plant.originalPrice)}</span>}
                      <span className="text-[16px] font-black tracking-tight text-primary">{formatVND(plant.price || 0)}</span>
                    </div>
                  </div>
                  
                  <h2 className="mb-1.5 line-clamp-2 text-[17px] font-extrabold leading-tight text-slate-800 dark:text-white">{getProductDisplay(plant, 'name')}</h2>
                  <p className="mb-3 line-clamp-2 text-[13px] font-medium leading-snug text-slate-500 dark:text-slate-400">{getProductDisplay(plant, 'description')}</p>
                  
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {plant.tags?.slice(0, 3).map((tag, index) => (
                      <span key={`${tag}-${index}`} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                        {getTagDisplay(tag, index)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto mb-3 flex items-center gap-1.5 text-primary/80 dark:text-green-300/80">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span className="text-[11px] font-bold tracking-wide">Contact-only · Xem kỹ trước khi liên hệ</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button to={`/plants/${plant.id}`} variant="secondary" className="flex h-[36px] w-full items-center justify-center rounded-full border border-slate-200 bg-white text-[12px] font-extrabold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">Xem chi tiết</Button>
                    <Button to={`/plants/${plant.id}`} className="flex h-[36px] w-full items-center justify-center rounded-full bg-primary text-[12px] font-extrabold text-white shadow-sm transition-all hover:bg-green-600 hover:-translate-y-0.5">Liên hệ</Button>
                  </div>
                </div>
              </Card>
              );
            })}
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
      </main>
    </div>
  );
};

export default PlantList;
