import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import { PRODUCTS, formatVND } from '../data/mockData';
import { getMarketplacePlants } from '../services/plantApi';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import { Badge, Chip } from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';
import { useI18n } from '../i18n';

const normalizeItems = (res) => (Array.isArray(res) ? res : res?.items || res?.data || []);

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
  Soil: 'market.filter.soil',
  Fertilizer: 'market.filter.fertilizer',
  Accessory: 'market.filter.accessory',
  'N/A': 'market.value.notApplicable',
};

const SkeletonCard = () => (
  <Card padding="none" className="flex flex-col overflow-hidden border border-[#E4EEE6] dark:border-[#2A4532]">
    <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
    <div className="flex flex-grow flex-col p-4 space-y-4">
      <div className="flex justify-between gap-3 items-start">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse shrink-0" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>
      <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-auto" />
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    </div>
  </Card>
);

const PlantList = () => {
  const pageRef = useRef(null);
  const gridRevealedRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await getMarketplacePlants();
        const items = normalizeItems(res);
        if (alive) {
          if (!items.length) console.warn("[DeskBoost] Using fallback marketplace data");
          setPlants(items.length ? items : PRODUCTS);
        }
      } catch (err) {
        console.warn("[DeskBoost] Using fallback marketplace data", err);
        if (alive) {
          setPlants(PRODUCTS);
          setError(t('market.fallbackNotice'));
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [t]);

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
    { value: 'Pot', icon: 'nest_eco_leaf', labelKey: 'market.filter.pot' },
    { value: 'Soil', icon: 'grass', labelKey: 'market.filter.soil' },
    { value: 'Fertilizer', icon: 'spa', labelKey: 'market.filter.fertilizer' },
    { value: 'Accessory', icon: 'handyman', labelKey: 'market.filter.accessory' },
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

  const sortedAndFilteredPlants = useMemo(() => plants
    .filter(p => p.status === 'Active' || p.status === 'Out of Stock')
    .filter(plant => {
      const matchesSearch = (plant.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || plant.tags?.includes(activeFilter) || plant.category === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    }), [plants, searchTerm, activeFilter, sortBy]);

  const resultLabel = isLoading ? t('market.result.loading') : t('market.result.count', { count: sortedAndFilteredPlants.length });

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <section className="mb-6 overflow-hidden rounded-3xl border border-[#E4EEE6] bg-surface-light shadow-sm dark:border-[#2A4532] dark:bg-surface-dark">
          <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_0.65fr] md:p-8">
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
                      <span className="block text-lg font-extrabold text-primary">{formatVND(plant.price || 0)}</span>
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
      </main>
    </div>
  );
};

export default PlantList;
