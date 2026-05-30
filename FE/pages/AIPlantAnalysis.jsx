import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UserLayout from '../components/UserLayout';
import { diagnosePlant } from '../services/aiApi';
import { Spinner, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';
import { useI18n } from '../i18n';

gsap.registerPlugin(useGSAP);

const captureTipKeys = ['aiAnalysis.tip.clear', 'aiAnalysis.tip.light', 'aiAnalysis.tip.soil'];
const defaultRecommendationKeys = ['aiAnalysis.defaultRec.moisture', 'aiAnalysis.defaultRec.light', 'aiAnalysis.defaultRec.leaves'];

const AIPlantAnalysis = () => {
  const { t } = useI18n();
  const captureTips = captureTipKeys.map((key) => t(key));
  const defaultRecommendations = defaultRecommendationKeys.map((key) => t(key));
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-analysis-page"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.md);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion] });

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-analysis-state"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.sm);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion, Boolean(selectedImage), isAnalyzing, Boolean(result)] });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const loadImageFile = (file) => {
    setError('');
    setResult(null);
    if (!file?.type?.startsWith('image/')) {
      setError(t('aiAnalysis.errorInvalidFile'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('aiAnalysis.errorFileSize'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.onerror = () => setError(t('aiAnalysis.errorReadFile'));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    loadImageFile(e.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError(t('aiAnalysis.errorNoImage'));
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      const diagnosis = await diagnosePlant({
        imageBase64: selectedImage,
        question: 'Diagnose this plant image and keep advice plant-care only.',
      });
      setResult(diagnosis);
    } catch (err) {
      setError(err?.message || t('aiAnalysis.errorAnalyze'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError('');
  };

  return (
    <UserLayout>
      <div ref={rootRef} className="mx-auto max-w-6xl space-y-6 p-4 pb-24 sm:p-6 md:p-8">
        <Card data-motion="ai-analysis-page" radius="hero" padding="feature" className="overflow-hidden bg-gradient-to-br from-white via-[#F7FBF5] to-[#EEF7EC] dark:from-surface-dark dark:via-[#102116] dark:to-[#0B1510]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="primary" icon="health_and_safety">{t('aiAnalysis.badge')}</Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-text-main dark:text-white sm:text-4xl">
                {t('aiAnalysis.title')}
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300 sm:text-base">
                {t('aiAnalysis.description')}
              </p>
            </div>
            <div className="grid gap-2 text-xs font-bold text-text-secondary dark:text-slate-300 sm:min-w-72">
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">{t('aiAnalysis.signal.file')}</span>
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">{t('aiAnalysis.signal.scope')}</span>
            </div>
          </div>
        </Card>

        {error && <StateNotice tone="error">{error}</StateNotice>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            <Card data-motion="ai-analysis-state" padding="none" radius="hero" className="overflow-hidden">
              <div
                className={`relative min-h-[360px] border-2 p-4 text-center transition-all duration-300 sm:min-h-[430px] sm:p-6 ${
                  dragActive
                    ? 'border-solid border-primary bg-primary/5 scale-[1.01]'
                    : 'border-dashed border-slate-300 dark:border-slate-700 bg-transparent'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedImage ? (
                  <div className="grid h-full min-h-[330px] gap-4 lg:grid-cols-[1fr_260px]">
                    <div className="relative overflow-hidden rounded-3xl bg-[#0B1510]">
                      <img src={selectedImage} alt={t('aiAnalysis.selectedImageAlt')} className="h-full min-h-[330px] w-full object-cover" />
                      {isAnalyzing && !reducedMotion && (
                        <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_rgba(76,175,80,0.8)] animate-scan-once" />
                      )}
                      <button
                        type="button"
                        aria-label={t('aiAnalysis.removeImageAria')}
                        onClick={handleRemoveImage}
                        className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                      </button>
                    </div>
                    <div className="flex flex-col justify-between rounded-3xl border border-[#E4EEE6] bg-[#FAFCF8] p-5 text-left dark:border-[#2A4532] dark:bg-white/5">
                      <div>
                        <Badge tone="success" icon="image">{t('aiAnalysis.previewBadge')}</Badge>
                        <h2 className="mt-4 text-xl font-extrabold text-text-main dark:text-white">{t('aiAnalysis.previewTitle')}</h2>
                        <p className="mt-2 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                          {t('aiAnalysis.previewDescription')}
                        </p>
                      </div>
                      <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing} loading={isAnalyzing} className="mt-5 w-full">
                        {isAnalyzing ? t('aiAnalysis.analyzingButton') : t('aiAnalysis.analyzeButton')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl bg-[#FAFCF8] px-5 py-10 dark:bg-white/5">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-4xl" aria-hidden="true">add_photo_alternate</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-extrabold text-text-main dark:text-white">{t('aiAnalysis.uploadTitle')}</h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                      {t('aiAnalysis.uploadDescription')}
                    </p>
                    <label className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark focus-within:ring-4 focus-within:ring-primary/25">
                      {t('aiAnalysis.chooseImage')}
                      <input type="file" className="sr-only" onChange={(e) => loadImageFile(e.target.files?.[0])} accept="image/*" />
                    </label>
                    <p className="mt-4 text-xs font-bold text-text-secondary dark:text-slate-400">{t('aiAnalysis.fileHint')}</p>
                  </div>
                )}
              </div>
            </Card>

            {selectedImage && !isAnalyzing && !result && (
              <StateNotice tone="info" className="text-sm">
                {t('aiAnalysis.readyNotice')}
              </StateNotice>
            )}

            {isAnalyzing && (
              <Card data-motion="ai-analysis-state" radius="hero" padding="feature" className="border-primary/20 bg-primary/5 dark:bg-primary/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm dark:bg-white/10">
                    <Spinner />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-text-main dark:text-white">{t('aiAnalysis.analyzingTitle')}</h2>
                    <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                      {t('aiAnalysis.analyzingDescription')}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {result && (
              <Card data-motion="ai-analysis-state" radius="hero" padding="feature" className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge tone="success" icon="check_circle">{t('aiAnalysis.resultBadge')}</Badge>
                    <h2 className="mt-3 text-2xl font-extrabold text-text-main dark:text-white">{t('aiAnalysis.resultTitle')}</h2>
                  </div>
                  {result.source && <Badge tone="warning">Source: {result.source}</Badge>}
                </div>
                <p className="text-base font-medium leading-7 text-text-secondary dark:text-slate-300">
                  {result.summary || t('aiAnalysis.summaryFallback')}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(result.recommendations || defaultRecommendations).map((item, idx) => (
                    <div key={item} className="rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-4 dark:border-[#2A4532] dark:bg-white/5">
                      <p className="text-xs font-extrabold text-primary">{t('aiAnalysis.stepLabel', { step: idx + 1 })}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-text-main dark:text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card radius="hero" padding="feature">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">verified</span>
                <h3 className="text-lg font-extrabold text-text-main dark:text-white">{t('aiAnalysis.tipsTitle')}</h3>
              </div>
              <div className="mt-5 space-y-4">
                {captureTips.map((desc, index) => (
                  <div key={desc} className="flex gap-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                    <span className="mt-0.5 font-extrabold text-primary">0{index + 1}</span>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card radius="hero" padding="feature" className="bg-gradient-to-br from-[#F0FDF4] to-[#E8F5E9] dark:from-primary/10 dark:to-[#2E7D32]/10">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-base" aria-hidden="true">lightbulb</span>
                <span className="text-sm font-extrabold">{t('aiAnalysis.readingHintTitle')}</span>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                {t('aiAnalysis.readingHint')}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIPlantAnalysis;
