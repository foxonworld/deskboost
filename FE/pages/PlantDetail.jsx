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
import { useI18n } from '../i18n';

const PlantDetail = () => {
  const pageRef = useRef(null);
  const feedbackRevealedRef = useRef(false);
  const { plantId } = useParams();
  const plant = PRODUCTS.find(p => p.id === plantId) || PRODUCTS[0];
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useI18n();

  const relatedProducts = (plant.relatedProductIds || []).map(id => getProductById(id)).filter(Boolean);
  const isPlant = plant.category !== 'Pot' && plant.category !== 'Soil' && plant.category !== 'Fertilizer' && plant.category !== 'Accessory';
  const careHighlights = [
    { icon: 'wb_sunny', label: t('detail.care.light'), value: plant.light || t('detail.care.lightFallback'), tone: 'text-amber-500' },
    { icon: 'water_drop', label: t('detail.care.water'), value: plant.water || t('detail.care.waterFallback'), tone: 'text-sky-500' },
    { icon: 'psychiatry', label: t('detail.care.difficulty'), value: plant.difficulty || t('detail.care.difficultyFallback'), tone: 'text-primary' },
  ];
  const trustStats = [
    ['verified', t('detail.trust.feedback'), t('detail.trust.records', { count: plant.reviewCount || feedbackItems.length || 0 })],
    ['forum', t('detail.trust.preClose'), t('detail.trust.channels')],
    ['payments', t('detail.trust.noPayment'), t('detail.trust.contactOnly')],
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
        if (active) setFeedbackError(err?.message || t('detail.feedback.error'));
      } finally {
        if (active) setFeedbackLoading(false);
      }
    };

    loadFeedback();
    return () => { active = false; };
  }, [plant.id, t]);

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
    alert(t('detail.alert.facebook'));
    window.open("https://m.me/deskboost", "_blank");
  };

  const handleContactZalo = () => {
    alert(t('detail.alert.zalo'));
    window.open("https://zalo.me/YOUR_ZALO_NUMBER", "_blank");
  };

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pb-28 pt-6 md:pb-12 md:pt-10">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm font-bold text-text-secondary dark:text-slate-400" aria-label={t('detail.breadcrumbAria')}>
          <Link to="/" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg">{t('detail.breadcrumb.home')}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/plants" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-lg">{t('detail.breadcrumb.marketplace')}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111813] dark:text-white">{plant.name}</span>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start" aria-labelledby="plant-detail-heading">
          <div className="space-y-5">
            <Card padding="none" radius="hero" className="group overflow-hidden" data-motion="detail-hero">
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                <img src={plant.image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" alt={plant.name} />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge tone="overlay" icon="spa">{t('detail.careFit')}</Badge>
                  {plant.status === 'Out of Stock' ? <Badge tone="warning">{t('detail.outOfStock')}</Badge> : <Badge tone="overlay" icon="forum">{t('detail.canContact')}</Badge>}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3" aria-label={t('detail.careSummaryAria')} data-motion="detail-hero">
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
                <Badge tone="primary" size="md" icon="verified">{t('detail.contactFirst')}</Badge>
                <Badge tone="neutral" size="md">{plant.category || t('detail.fallbackCategory')}</Badge>
              </div>
              <h1 id="plant-detail-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">{plant.name}</h1>
              <p className="mt-2 text-base font-semibold italic text-text-secondary dark:text-slate-300">{plant.species}</p>
              <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{plant.description}</p>

              <div className="mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-4 dark:border-primary/25 dark:bg-primary/10">
                <p className="text-xs font-extrabold text-primary dark:text-green-200">{t('detail.referencePrice')}</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-extrabold text-primary">{formatVND(plant.price)}</span>
                  {plant.originalPrice && plant.originalPrice > plant.price && (
                    <span className="pb-1 text-sm font-bold text-text-secondary line-through dark:text-slate-500">{formatVND(plant.originalPrice)}</span>
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-text-secondary dark:text-slate-300">{t('detail.priceNote')}</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button variant="channel" size="lg" onClick={handleContactZalo} className="w-full bg-[#0068FF] hover:bg-[#0055d4] animate-cta-pulse-once">{t('detail.zalo')}</Button>
                <Button variant="channel" size="lg" onClick={handleContactFacebook} className="w-full bg-[#0866FF] hover:bg-[#0050d1] animate-cta-pulse-once">{t('detail.messenger')}</Button>
              </div>
              <Button variant="secondary" size="md" onClick={handleContactZalo} className="mt-3 w-full animate-cta-pulse-once">{t('detail.contactThis')}</Button>
              <p className="mt-3 text-center text-xs font-bold text-text-secondary dark:text-slate-400">{t('detail.noCheckout')}</p>
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
            <Badge tone="primary" icon="desk" className="mb-4">{t('detail.workspace.badge')}</Badge>
            <h2 id="workspace-fit-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">{t('detail.workspace.title')}</h2>
            <div className="mt-5 space-y-4">
              {[
                [t('detail.workspace.position'), isPlant ? t('detail.workspace.positionPlant') : t('detail.workspace.positionAccessory')],
                [t('detail.workspace.careLevel'), plant.difficulty || t('detail.workspace.careLevelFallback')],
                [t('detail.workspace.askSeller'), t('detail.workspace.askSellerDesc')],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-[#E4EEE6] bg-white/70 p-4 dark:border-[#2A4532] dark:bg-white/5">
                  <p className="text-sm font-extrabold text-[#111813] dark:text-white">{title}</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card radius="hero" aria-labelledby="care-notes-heading">
            <Badge tone="success" icon="eco" className="mb-4">{t('detail.notes.badge')}</Badge>
            <h2 id="care-notes-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">{t('detail.notes.title')}</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{t('detail.notes.description')}</p>
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
                  <Badge tone="neutral" icon="auto_fix_high" className="mb-4">{t('detail.support.badge')}</Badge>
                  <h2 id="support-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">{t('detail.support.title')}</h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{t('detail.support.description')}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedProducts.map(p => (
                    <div key={p.id} className="flex gap-3 rounded-2xl border border-[#E4EEE6] bg-white/80 p-3 dark:border-[#2A4532] dark:bg-white/5">
                      <img src={p.image} alt={p.name} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-[#111813] dark:text-white">{p.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-text-secondary dark:text-slate-400">{p.description}</p>
                        <p className="mt-1 text-xs font-bold text-primary">{t('detail.support.price', { price: formatVND(p.price) })}</p>
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
                <Badge tone="primary" icon="verified" className="mb-4">{t('detail.feedback.badge')}</Badge>
                <h2 id="verified-feedback-heading" className="text-2xl font-extrabold text-[#111813] dark:text-white">{t('detail.feedback.title')}</h2>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{t('detail.feedback.description')}</p>
              </div>
              <Badge tone="success" size="md">{t('detail.feedback.manualTrust')}</Badge>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {feedbackLoading ? (
                <>
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#E4EEE6] bg-slate-50/50 p-4 dark:border-[#2A4532] dark:bg-white/5 space-y-4 animate-pulse">
                      <div className="flex justify-between gap-3 items-center">
                        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      </div>
                    </div>
                  ))}
                </>
              ) : feedbackError ? (
                <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{feedbackError}</p>
              ) : feedbackItems.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#E4EEE6] p-4 text-sm font-bold text-text-secondary dark:border-[#2A4532] dark:text-slate-300">{t('detail.feedback.empty')}</p>
              ) : (
                feedbackItems.map((feedback) => (
                  <article key={feedback.id} className="rounded-2xl border border-[#E4EEE6] bg-slate-50 p-4 dark:border-[#2A4532] dark:bg-white/5" data-motion="detail-feedback">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-extrabold text-[#111813] dark:text-white">{feedback.customerAlias || t('detail.feedback.customerFallback')}</p>
                      <p className="text-xs font-extrabold text-yellow-500" aria-label={t('detail.feedback.ratingAria', { rating: feedback.rating || 5 })}>{'★'.repeat(feedback.rating || 5)}</p>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">“{feedback.comment}”</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="primary">{t('detail.feedback.offApp')}</Badge>
                      <Badge tone="neutral">{t('detail.feedback.manualVerified')}</Badge>
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
            <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{formatVND(plant.price)} · {t('detail.trust.contactOnly')}</p>
          </div>
          <Button size="sm" onClick={handleContactZalo} className="animate-cta-pulse-once">{t('detail.mobileContact')}</Button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
