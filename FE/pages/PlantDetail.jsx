import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMarketplacePlant } from '../services/plantApi';
import { getVerifiedFeedback } from '../services/feedbackApi';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';
import { formatVND } from '../utils/currency';
import { getCareScaleDisplay } from '../utils/careDisplay';
import { useI18n } from '../i18n';

const PlantDetail = () => {
  const pageRef = useRef(null);
  const feedbackRevealedRef = useRef(false);
  const { plantId } = useParams();
  const [plant, setPlant] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [plantLoading, setPlantLoading] = useState(true);
  const [plantError, setPlantError] = useState('');
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({ supported: true, blocker: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState('');
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useI18n();

  useEffect(() => {
    let active = true;
    const loadPlant = async () => {
      setPlantLoading(true);
      setPlantError('');
      try {
        const data = await getMarketplacePlant(plantId);
        if (active) setPlant(data);
      } catch (err) {
        if (active) {
          setPlant(null);
          setPlantError(err?.message || 'Marketplace item could not be loaded.');
        }
      } finally {
        if (active) setPlantLoading(false);
      }
    };

    loadPlant();
    return () => { active = false; };
  }, [plantId]);

  const relatedProducts = [];
  const category = String(plant?.category || '').toLowerCase();
  const isPlant = !['pot', 'soil', 'fertilizer', 'accessory'].includes(category);
  const feedbackMarketplaceItemId = plant?.marketplaceItemId || plant?.id;
  const lightDisplay = getCareScaleDisplay('light', plant?.light, t);
  const waterDisplay = getCareScaleDisplay('water', plant?.water, t);
  const careDisplay = getCareScaleDisplay('care', plant?.difficulty, t);
  const careHighlights = [
    { icon: 'wb_sunny', label: t('detail.care.light'), value: lightDisplay.value || t('detail.care.lightFallback'), hint: lightDisplay.hint, tone: 'text-amber-500' },
    { icon: 'water_drop', label: t('detail.care.water'), value: waterDisplay.value || t('detail.care.waterFallback'), hint: waterDisplay.hint, tone: 'text-sky-500' },
    { icon: 'psychiatry', label: t('detail.care.difficulty'), value: careDisplay.value || t('detail.care.difficultyFallback'), hint: careDisplay.hint, tone: 'text-primary' },
  ];
  const trustStats = [
    ['verified', t('detail.trust.feedback'), t('detail.trust.records', { count: feedbackItems.length })],
    ['forum', t('detail.trust.preClose'), t('detail.trust.channels')],
    ['payments', t('detail.trust.noPayment'), t('detail.trust.contactOnly')],
  ];
  const galleryImages = plant?.images?.length ? plant.images : [plant?.image || plant?.imageUrl].filter(Boolean);
  const activeImage = selectedImage || plant?.primaryImage || plant?.image || plant?.imageUrl || galleryImages[0] || '';
  const hasGallery = galleryImages.length > 1;
  const activeImageIndex = Math.max(0, galleryImages.indexOf(activeImage));

  const selectGalleryImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const moveGalleryImage = (direction) => {
    if (!galleryImages.length) return;
    const currentIndex = galleryImages.indexOf(activeImage);
    const nextIndex = (Math.max(0, currentIndex) + direction + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  useEffect(() => {
    setSelectedImage(plant?.primaryImage || plant?.image || plant?.imageUrl || plant?.images?.[0] || '');
  }, [plant]);

  useEffect(() => {
    let active = true;
    const loadFeedback = async () => {
      setFeedbackLoading(true);
      setFeedbackError('');
      try {
        const data = await getVerifiedFeedback({ marketplaceItemId: feedbackMarketplaceItemId });
        if (active) {
          setFeedbackItems(data?.items || []);
          setFeedbackStatus({ supported: data?.supported !== false, blocker: data?.blocker || '' });
        }
      } catch (err) {
        if (active) setFeedbackError(err?.message || t('detail.feedback.error'));
      } finally {
        if (active) setFeedbackLoading(false);
      }
    };

    if (feedbackMarketplaceItemId) loadFeedback();
    return () => { active = false; };
  }, [feedbackMarketplaceItemId, t]);

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
    window.open("https://www.facebook.com/profile.php?id=61589573026631", "_blank");
  };

  const handleContactZalo = () => {
    alert(t('detail.alert.zalo'));
    window.open("https://zalo.me/0345674779", "_blank");
  };

  if (plantLoading || !plant) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-[#111813] dark:text-white font-display transition-colors">
        <Navbar />
        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-10">
          <div className="rounded-[32px] border border-[#E4EEE6] bg-white p-12 text-center text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-300">
            {plantLoading ? t('common.loading') : plantError || 'Marketplace item not found.'}
          </div>
        </main>
      </div>
    );
  }

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
                {activeImage ? (
                  <img src={activeImage} className="h-full w-full bg-white object-contain p-3 transition-transform duration-500 group-hover:scale-[1.01] dark:bg-slate-950" alt={plant.name} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-secondary dark:text-slate-400">{plant.name}</div>
                )}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge tone="overlay" icon="spa">{t('detail.careFit')}</Badge>
                  {plant.status === 'Out of Stock' ? <Badge tone="warning">{t('detail.outOfStock')}</Badge> : <Badge tone="overlay" icon="forum">{t('detail.canContact')}</Badge>}
                </div>
                {hasGallery && (
                  <>
                    <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-extrabold text-white shadow-sm backdrop-blur">
                      {activeImageIndex + 1}/{galleryImages.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(-1)}
                      className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-[#111813] shadow-sm transition hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-primary/20 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 dark:text-white"
                      aria-label="Previous product image"
                    >
                      <span className="material-symbols-outlined text-xl" aria-hidden="true">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(1)}
                      className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 backdrop-blur-md text-[#111813] shadow-sm transition hover:bg-white/80 focus:outline-none focus:ring-4 focus:ring-primary/20 dark:bg-slate-900/50 dark:hover:bg-slate-900/80 dark:text-white"
                      aria-label="Next product image"
                    >
                      <span className="material-symbols-outlined text-xl" aria-hidden="true">chevron_right</span>
                    </button>
                  </>
                )}
              </div>
            </Card>

            {hasGallery && (
              <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Marketplace product gallery" data-motion="detail-hero">
                {galleryImages.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => selectGalleryImage(imageUrl)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition focus:outline-none focus:ring-4 focus:ring-primary/20 sm:h-24 sm:w-24 dark:bg-surface-dark ${activeImage === imageUrl ? 'border-primary ring-2 ring-primary/25' : 'border-[#E4EEE6] opacity-80 hover:border-primary/50 hover:opacity-100 dark:border-[#2A4532]'}`}
                    aria-label={`View product image ${index + 1}`}
                    aria-current={activeImage === imageUrl ? 'true' : undefined}
                  >
                    <img src={imageUrl} alt={`${plant.name} ${index + 1}`} className="h-full w-full object-cover" />
                    {activeImage === imageUrl && <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-primary" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3" aria-label={t('detail.careSummaryAria')} data-motion="detail-hero">
              {careHighlights.map(item => (
                <Card key={item.label} padding="compact" className="text-center">
                  <span className={`material-symbols-outlined text-2xl ${item.tone}`} aria-hidden="true">{item.icon}</span>
                  <p className="mt-2 text-[11px] font-extrabold text-text-secondary dark:text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-[#111813] dark:text-white">{item.value}</p>
                  {item.hint && <p className="mt-1 text-[11px] font-semibold leading-4 text-text-secondary dark:text-slate-400">{item.hint}</p>}
                </Card>
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <Card radius="hero" variant="elevated" className="overflow-hidden" data-motion="detail-hero">
              <div className="flex flex-wrap gap-2">
                <Badge tone="primary" size="md" icon="verified">{t('detail.contactFirst')}</Badge>
                <Badge tone="neutral" size="md">{(!plant.category || plant.category.toLowerCase() === 'plant') ? 'Cây cảnh' : plant.category}</Badge>
              </div>
              <h1 id="plant-detail-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#111813] dark:text-white md:text-5xl">{plant.name}</h1>
              <p className="mt-2 text-base font-semibold italic text-text-secondary dark:text-slate-300">{plant.species}</p>
              <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">{plant.description}</p>

              <div className="mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-4 dark:border-primary/25 dark:bg-primary/10">
                <p className="text-xs font-extrabold text-primary dark:text-green-200">{t('detail.referencePrice')}</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-extrabold text-primary">{formatVND(plant.price || 0)}</span>
                  {plant.originalPrice && plant.originalPrice > plant.price && (
                    <span className="pb-1 text-sm font-bold text-text-secondary line-through dark:text-slate-500">{formatVND(plant.originalPrice)}</span>
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-text-secondary dark:text-slate-300">{t('detail.priceNote')}</p>
              </div>

              <div className="mt-5 rounded-3xl border border-[#E4EEE6] bg-white/80 p-3 shadow-sm dark:border-[#2A4532] dark:bg-white/5">
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div>
                    <p className="text-sm font-extrabold text-[#111813] dark:text-white">{t('detail.contactChannels')}</p>
                    <p className="mt-0.5 text-xs font-semibold text-text-secondary dark:text-slate-400">{t('detail.contactChannelsDesc')}</p>
                  </div>
                  <span className="material-symbols-outlined rounded-2xl bg-primary/10 p-2 text-primary" aria-hidden="true">forum</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="secondary" size="lg" onClick={handleContactZalo} className="group w-full justify-start rounded-2xl bg-white border border-slate-200 px-4 hover:bg-slate-50 hover:border-[#0068FF]/30 dark:bg-surface-dark dark:border-white/10 dark:hover:border-[#0068FF]/50 transition-all">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0068FF]/10 text-sm font-black text-[#0068FF]">Z</span>
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-extrabold text-slate-800 dark:text-white">{t('detail.zalo')}</span>
                      <span className="block truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">0345674779</span>
                    </span>
                    <span className="material-symbols-outlined ml-auto text-lg text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0068FF]" aria-hidden="true">arrow_forward</span>
                  </Button>
                  <Button variant="secondary" size="lg" onClick={handleContactFacebook} className="group w-full justify-start rounded-2xl bg-white border border-slate-200 px-4 hover:bg-slate-50 hover:border-[#0866FF]/30 dark:bg-surface-dark dark:border-white/10 dark:hover:border-[#0866FF]/50 transition-all">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0866FF]/10 text-sm font-black text-[#0866FF]">f</span>
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-sm font-extrabold text-slate-800 dark:text-white">{t('detail.messenger')}</span>
                      <span className="block truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">Facebook</span>
                    </span>
                    <span className="material-symbols-outlined ml-auto text-lg text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0866FF]" aria-hidden="true">arrow_forward</span>
                  </Button>
                </div>
                <Button size="md" onClick={handleContactZalo} className="mt-3 w-full rounded-2xl bg-primary text-white font-extrabold shadow-sm transition-all hover:bg-green-600 hover:-translate-y-0.5">{t('detail.contactThis')}</Button>
              </div>
              <p className="mt-3 text-center text-[11px] font-bold tracking-wide text-text-secondary dark:text-slate-400">Không giỏ hàng · Không thanh toán trong DeskBoost</p>
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
                [t('detail.workspace.careLevel'), careDisplay.value || t('detail.workspace.careLevelFallback')],
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
                  {item.hint && <p className="mt-1 text-xs font-medium leading-5 text-text-secondary dark:text-slate-300">{item.hint}</p>}
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
              <Badge tone={feedbackStatus.supported ? 'success' : 'neutral'} size="md">
                {feedbackStatus.supported ? t('detail.feedback.manualTrust') : t('detail.feedback.blocked')}
              </Badge>
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
                <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E4EEE6] bg-slate-50/50 py-8 px-4 text-center dark:border-[#2A4532] dark:bg-surface-dark/50">
                  <span className="material-symbols-outlined mb-2 text-3xl text-slate-300 dark:text-slate-600">rate_review</span>
                  <p className="text-sm font-bold text-text-secondary dark:text-slate-400">
                    {feedbackStatus.supported ? "Chưa có phản hồi xác minh." : t('detail.feedback.backendBlocked')}
                  </p>
                </div>
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
            <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{formatVND(plant.price || 0)} · Không thanh toán in-app</p>
          </div>
          <Button size="sm" onClick={handleContactZalo} className="animate-cta-pulse-once">{t('detail.mobileContact')}</Button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
