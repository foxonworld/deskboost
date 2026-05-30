import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { useCare } from '../context/CareContext';
import { PLANTS, formatVND } from '../data/mockData';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, motionDurations, motionEasings, usePrefersReducedMotion } from '../utils/motion';
import { useI18n } from '../i18n';

gsap.registerPlugin(useGSAP);

const careWorkflowKeys = [
  { icon: 'photo_camera', titleKey: 'home.workflow.signal.title', textKey: 'home.workflow.signal.text' },
  { icon: 'psychology', titleKey: 'home.workflow.ai.title', textKey: 'home.workflow.ai.text' },
  { icon: 'event_available', titleKey: 'home.workflow.schedule.title', textKey: 'home.workflow.schedule.text' },
];

const trustSignalKeys = [
  { valueKey: 'home.trust.contact.value', labelKey: 'home.trust.contact.label', icon: 'touch_app' },
  { valueKey: 'home.trust.ai.value', labelKey: 'home.trust.ai.label', icon: 'smart_toy' },
  { valueKey: 'home.trust.manual.value', labelKey: 'home.trust.manual.label', icon: 'fact_check' },
];

const Home = () => {
  const { pendingTasks } = useCare();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeActivityIndex, setActiveActivityIndex] = React.useState(0);
  const rootRef = React.useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (pendingTasks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % pendingTasks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pendingTasks.length]);

  useGSAP(() => {
    const heroItems = gsap.utils.toArray('[data-motion="home-hero"]');
    const sectionItems = gsap.utils.toArray('[data-motion="home-section"]');

    if (heroItems.length) {
      const vars = getRevealVars(reducedMotion, motionDistances.lg);
      gsap.fromTo(heroItems, vars.from, {
        ...vars.to,
        duration: reducedMotion ? motionDurations.reduced : motionDurations.slow,
        ease: motionEasings.emphasized,
      });
    }

    if (sectionItems.length) {
      const vars = getRevealVars(reducedMotion, motionDistances.md);
      gsap.fromTo(sectionItems, vars.from, vars.to);
    }
  }, { scope: rootRef, dependencies: [reducedMotion] });

  const currentTask = pendingTasks[activeActivityIndex] || {
    plantName: t('home.defaultTask.plantName'),
    taskLabel: t('home.defaultTask.taskLabel'),
    dueTime: t('home.defaultTask.dueTime'),
    urgency: 'upcoming',
    plantEmoji: '🌿',
  };

  const urgencyConfig = {
    overdue: { tone: 'danger', label: t('home.urgency.overdue'), icon: 'notification_important' },
    today: { tone: 'warning', label: t('home.urgency.today'), icon: 'schedule' },
    upcoming: { tone: 'primary', label: t('home.urgency.upcoming'), icon: 'event' },
  };

  const cfg = urgencyConfig[currentTask.urgency] || urgencyConfig.upcoming;
  const featuredPlants = PLANTS.slice(0, 3);

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-background-light text-text-main antialiased dark:bg-background-dark dark:text-white">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="relative border-b border-[#E4EEE6] dark:border-[#2A4532]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,175,80,0.16),transparent_34%),linear-gradient(135deg,rgba(255,248,238,0.9),transparent_42%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(76,175,80,0.14),transparent_34%),linear-gradient(135deg,rgba(23,42,31,0.9),transparent_42%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_0.92fr] lg:py-24">
            <div className="flex max-w-3xl flex-col items-start gap-7">
              <span data-motion="home-hero">
                <Badge tone="primary" size="md" icon="eco">
                  {t('home.badge')}
                </Badge>
              </span>
              <div data-motion="home-hero" className="space-y-5">
                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] bg-gradient-to-br from-text-main to-primary bg-clip-text text-transparent dark:from-white dark:to-green-400 md:text-6xl lg:text-7xl">
                  {t('home.hero.title')}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-text-secondary dark:text-slate-300 md:text-lg md:leading-8">
                  {t('home.hero.description')}
                </p>
              </div>

              <div data-motion="home-hero" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button to="/plants" size="lg" className="w-full sm:w-auto">
                  {t('home.cta.marketplace')}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/app/ai-chat')}
                  className="w-full sm:w-auto"
                >
                  {t('home.cta.aiCare')}
                </Button>
              </div>

              <div data-motion="home-hero" className="grid w-full gap-3 sm:grid-cols-3">
                {trustSignalKeys.map((item) => (
                  <div key={item.valueKey} className="rounded-2xl border border-[#E4EEE6] bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#2A4532] dark:bg-white/5">
                    <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">{item.icon}</span>
                    <p className="mt-2 text-base font-extrabold text-text-main dark:text-white">{t(item.valueKey)}</p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary dark:text-slate-400">{t(item.labelKey)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-motion="home-hero" className="relative">
              <Card variant="elevated" padding="none" radius="hero" className="overflow-hidden ring-1 ring-primary/10">
                <div className="relative aspect-[4/3] min-h-[320px] bg-slate-100 dark:bg-slate-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzaus0c0LOhf2NX2DHlSrgoj7WJftqhZWnq2AaXvZGH_juFX-tzXsGtxKpiUTKI7o1qep8M-_mblF5fLwbfUAZBkbXNAwgdif6Fbd_TTDmR3Fn4bwl0C_sxr66ytyPsaniXtPwZovv8Jj2hG-6jQRdKjFy4Qi9xY456Jx4mhj-YhMXZQom8xGz0E9YuDuNOy_Q7EbzlxZ1eDTQLLSET3rEsIWX0QNNd0-56C2eO61nuFnUF_4wxoXrJY9-HR7VgsF4XTBDdH0Ytpg"
                    alt={t('home.heroImageAlt')}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => navigate('/app/settings')}
                    className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/25 bg-white/85 p-4 text-left shadow-xl backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary/30 active:translate-y-0 dark:border-white/10 dark:bg-slate-950/75 dark:hover:bg-slate-950 md:left-auto md:w-72"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-xl dark:bg-primary/15">
                        {currentTask.plantEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <Badge tone={cfg.tone} icon={cfg.icon}>{cfg.label}</Badge>
                          <span className="material-symbols-outlined text-base text-text-secondary dark:text-slate-400" aria-hidden="true">arrow_forward</span>
                        </div>
                        <p className="mt-2 truncate text-sm font-extrabold text-text-main dark:text-white">{currentTask.plantName}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-text-secondary dark:text-slate-400">{currentTask.taskLabel} · {currentTask.dueTime}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge tone="neutral" size="md">{t('home.problem.badge')}</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                {t('home.problem.title')}
              </h2>
              <p className="text-base leading-7 text-text-secondary dark:text-slate-300">
                {t('home.problem.description')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: 'psychology', titleKey: 'home.trust.feature.1.title', textKey: 'home.trust.feature.1.desc' },
                { icon: 'folder_shared', titleKey: 'home.trust.feature.2.title', textKey: 'home.trust.feature.2.desc' },
                { icon: 'notifications_active', titleKey: 'home.trust.feature.3.title', textKey: 'home.trust.feature.3.desc' },
                { icon: 'storefront', titleKey: 'home.trust.feature.4.title', textKey: 'home.trust.feature.4.desc' },
              ].map((item) => (
                <Card key={item.titleKey} padding="feature" interactive className="bg-white/80 dark:bg-white/5">
                  <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-extrabold text-text-main dark:text-white">{t(item.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-slate-400">{t(item.textKey)}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="border-y border-[#E4EEE6] bg-surface-light py-14 dark:border-[#2A4532] dark:bg-surface-dark md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="primary" size="md" icon="smart_toy">{t('home.workflow.badge')}</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                {t('home.workflow.title')}
              </h2>
              <p className="mt-4 text-base leading-7 text-text-secondary dark:text-slate-300">
                {t('home.workflow.description')}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {careWorkflowKeys.map((step, index) => (
                <Card key={step.titleKey} padding="feature" radius="hero" interactive className="relative overflow-hidden bg-white dark:bg-background-dark">
                  <div className="absolute right-5 top-5 text-6xl font-extrabold text-primary/10">0{index + 1}</div>
                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
                      <span className="material-symbols-outlined text-3xl" aria-hidden="true">{step.icon}</span>
                    </div>
                    <h3 className="mt-8 text-xl font-extrabold text-text-main dark:text-white">{t(step.titleKey)}</h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary dark:text-slate-400">{t(step.textKey)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <Badge tone="neutral" size="md">{t('home.market.badge')}</Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                  {t('home.market.title')}
                </h2>
                <p className="mt-3 text-base leading-7 text-text-secondary dark:text-slate-300">
                  {t('home.market.description')}
                </p>
              </div>
              <Button to="/plants" variant="secondary" className="w-full md:w-auto">
                {t('home.market.cta')}
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featuredPlants.map((plant) => (
                <Card key={plant.id} padding="none" interactive={false} className="group overflow-hidden bg-white dark:bg-surface-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/20">
                  <Link to={`/plants/${plant.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-text-main dark:text-white">{plant.name}</h3>
                        <p className="mt-1 text-sm text-text-secondary dark:text-slate-400">{t('home.market.cardDescription')}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-extrabold text-primary">{formatVND(plant.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="primary">{t('home.market.easyCare')}</Badge>
                      <Badge tone="neutral">{t('home.market.contactAdvice')}</Badge>
                    </div>
                    <Button to={`/plants/${plant.id}`} variant="secondary" size="sm" className="w-full">
                      {t('home.market.detailCta')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="bg-slate-950 py-14 text-white md:py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge tone="overlay" size="md" icon="verified">{t('home.trust.badge')}</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {t('home.trust.title')}
              </h2>
              <p className="text-base leading-7 text-slate-300">
                {t('home.trust.description')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: 'support_agent', titleKey: 'home.trust.prebuy.title', textKey: 'home.trust.prebuy.text' },
                { icon: 'fact_check', titleKey: 'home.trust.feedback.title', textKey: 'home.trust.feedback.text' },
                { icon: 'potted_plant', titleKey: 'home.trust.support.title', textKey: 'home.trust.support.text' },
              ].map((item) => (
                <Card key={item.titleKey} padding="feature" className="border-white/10 bg-white/5 shadow-none">
                  <span className="material-symbols-outlined text-3xl text-green-300" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 text-base font-extrabold text-white">{t(item.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{t(item.textKey)}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <Card radius="hero" padding="feature" className="overflow-hidden bg-white dark:bg-surface-dark">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <Badge tone="primary" size="md">{t('home.final.badge')}</Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                  {t('home.final.title')}
                </h2>
                <p className="mt-3 text-base leading-7 text-text-secondary dark:text-slate-300">
                  {t('home.final.description')}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button to="/plants" size="lg">{t('home.cta.marketplace')}</Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/app/ai-chat')}>{t('home.final.aiCta')}</Button>
              </div>
            </div>
          </Card>
        </section>

        <section data-motion="home-section" className="border-t border-[#E4EEE6] bg-surface-light py-14 dark:border-[#2A4532] dark:bg-surface-dark/40 bg-[radial-gradient(ellipse_at_top,rgba(76,175,80,0.06),transparent_60%)]">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
            <div className="mx-auto max-w-2xl text-center mb-10">
              <Badge tone="neutral" size="md" icon="analytics">{t('home.stats.badge')}</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                {t('home.stats.title')}
              </h2>
            </div>
            <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
              {[
                { valKey: 'home.stats.diagnoses.val', labelKey: 'home.stats.diagnoses.label', icon: 'psychology', iconClass: 'text-primary' },
                { valKey: 'home.stats.plants.val', labelKey: 'home.stats.plants.label', icon: 'potted_plant', iconClass: 'text-amber-500' },
                { valKey: 'home.stats.reminders.val', labelKey: 'home.stats.reminders.label', icon: 'notifications_active', iconClass: 'text-sky-500' },
                { valKey: 'home.stats.feedback.val', labelKey: 'home.stats.feedback.label', icon: 'verified', iconClass: 'text-emerald-500' },
              ].map((stat) => (
                <Card key={stat.valKey} padding="compact" className="text-center bg-white border border-[#E4EEE6] dark:border-[#2A4532] dark:bg-background-dark/60">
                  <span className={`material-symbols-outlined text-2xl ${stat.iconClass}`} aria-hidden="true">{stat.icon}</span>
                  <p className="mt-3 text-3xl font-extrabold tabular-nums text-primary md:text-4xl">{t(stat.valKey)}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-text-secondary dark:text-slate-400">{t(stat.labelKey)}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="border-t border-[#E4EEE6] bg-background-light py-14 dark:border-[#2A4532] dark:bg-background-dark md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
            <div className="mx-auto max-w-2xl text-center mb-10">
              <Badge tone="primary" size="md" icon="timeline">{t('home.roadmap.badge')}</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                {t('home.roadmap.title')}
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
                {t('home.roadmap.description')}
              </p>
            </div>
            <div className="relative border-l-2 border-primary/20 dark:border-primary/10 ml-4 md:ml-10 pl-6 md:pl-10 space-y-8">
              {[
                { titleKey: 'home.roadmap.step1.title', descKey: 'home.roadmap.step1.desc', icon: 'qr_code_2', inMvp: true },
                { titleKey: 'home.roadmap.step2.title', descKey: 'home.roadmap.step2.desc', icon: 'assignment_ind', inMvp: false },
                { titleKey: 'home.roadmap.step3.title', descKey: 'home.roadmap.step3.desc', icon: 'memory', inMvp: false },
                { titleKey: 'home.roadmap.step4.title', descKey: 'home.roadmap.step4.desc', icon: 'cloudy_snowing', inMvp: false },
                { titleKey: 'home.roadmap.step5.title', descKey: 'home.roadmap.step5.desc', icon: 'settings_input_antenna', inMvp: false },
              ].map((step, idx) => (
                <div key={step.titleKey} className="relative">
                  <div className={`absolute -left-[35px] md:-left-[51px] top-0 flex size-7 md:size-10 items-center justify-center rounded-full text-primary dark:bg-primary/20 border ${step.inMvp ? 'bg-primary/15 border-primary/50' : 'bg-primary/10 border-primary/25'}`}>
                    <span className="material-symbols-outlined text-sm md:text-lg" aria-hidden="true">{step.icon}</span>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 border border-[#E4EEE6] dark:border-[#2A4532] p-5 rounded-2xl max-w-3xl">
                    <h3 className="text-base md:text-lg font-extrabold text-text-main dark:text-white flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary dark:bg-primary/25 rounded-md">Phase 0{idx + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                        step.inMvp
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                      }`}>{step.inMvp ? t('home.roadmap.status.mvp') : t('home.roadmap.status.coming')}</span>
                      {t(step.titleKey)}
                    </h3>
                    <p className="mt-2 text-xs md:text-sm leading-6 text-text-secondary dark:text-slate-300 font-medium">{t(step.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#E4EEE6] bg-white py-10 dark:border-[#2A4532] dark:bg-surface-dark">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">potted_plant</span>
              <span className="text-xl font-extrabold tracking-tight text-text-main dark:text-white">DeskBoost</span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary dark:text-slate-400">
              {t('home.footer.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-text-secondary dark:text-slate-300">
            <Link to="/plants" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">{t('home.footer.marketplace')}</Link>
            <Link to="/app/ai-chat" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">{t('home.footer.aiCare')}</Link>
            <Link to="/login" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">{t('navbar.login')}</Link>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default Home;
