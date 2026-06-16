import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link, useLocation } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { getAiQuota, getMyAiDialog, getMyAiDialogs, sendPlantContextChatMessage } from '../services/aiApi';
import { getMyPlants } from '../services/plantApi';
import { EmptyState, Spinner, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';
import { useI18n } from '../i18n';

gsap.registerPlugin(useGSAP);

const DIAGNOSIS_CONTEXT_STORAGE_KEY = 'deskboost.aiDiagnosisContext';

const promptSuggestionKeys = [
  'aiChat.prompt.water',
  'aiChat.prompt.yellowLeaves',
  'aiChat.prompt.light',
  'aiChat.prompt.schedule',
];

const plantDisplayValueKeys = {
  thriving: 'aiChat.status.thriving',
  'needs-water': 'aiChat.status.needsWater',
  recovering: 'aiChat.status.recovering',
  critical: 'aiChat.status.critical',
  'Ánh sáng thấp': 'aiChat.value.lowLight',
  'Ánh sáng gián tiếp': 'aiChat.value.indirectLight',
  'Bóng mát một phần': 'aiChat.value.partialShade',
  'Mỗi 1–2 tuần': 'aiChat.value.everyOneTwoWeeks',
  'Mỗi 3–4 tuần': 'aiChat.value.everyThreeFourWeeks',
  'Hàng tuần': 'aiChat.value.weekly',
};

const normalizePlantContext = (plant) => ({
  id: plant.id,
  nickname: plant.nickname,
  name: plant.name,
  species: plant.species,
  status: plant.status,
  light: plant.light,
  water: plant.water,
  notes: plant.notes,
});

const splitInlineMarkdown = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`} className="font-extrabold text-text-main dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });

const normalizeAiText = (text = '') => text
  .replace(/\s+(\d+\.\s+\*\*)/g, '\n$1')
  .replace(/\s+(\*\s+\*\*)/g, '\n$1')
  .replace(/\s+(\*\s+)/g, '\n$1')
  .trim();

const AIFormattedText = ({ text }) => {
  const lines = normalizeAiText(text).split('\n').map((line) => line.trim()).filter(Boolean);

  return (
    <div className="space-y-3 font-medium leading-7">
      {lines.map((line, index) => {
        const numbered = line.match(/^(\d+)\.\s+(.*)$/);
        const bullet = line.match(/^\*\s+(.*)$/);

        if (numbered) {
          return (
            <div key={`${line}-${index}`} className="flex gap-3">
              <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">{numbered[1]}</span>
              <p className="min-w-0 flex-1">{splitInlineMarkdown(numbered[2])}</p>
            </div>
          );
        }

        if (bullet) {
          return (
            <div key={`${line}-${index}`} className="flex gap-3 pl-2">
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="min-w-0 flex-1">{splitInlineMarkdown(bullet[1])}</p>
            </div>
          );
        }

        return <p key={`${line}-${index}`}>{splitInlineMarkdown(line)}</p>;
      })}
    </div>
  );
};

const TypedText = ({ text, onComplete, speed = 15 }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState(reducedMotion ? text : '');

  useEffect(() => {
    if (reducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 3;
      if (currentLength >= text.length) {
        setDisplayText(text);
        clearInterval(interval);
        if (onComplete) onComplete();
      } else {
        setDisplayText(text.slice(0, currentLength));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, reducedMotion]);

  return <AIFormattedText text={displayText} />;
};

const AIChat = () => {
  const { t } = useI18n();
  const location = useLocation();
  const routePlantId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return location.state?.selectedPlantId || params.get('plantId') || '';
  }, [location.search, location.state]);
  const starterMessages = useMemo(() => [
    {
      id: 'starter-1',
      from: 'assistant',
      text: t('aiChat.description'),
    },
  ], [t]);
  const promptSuggestions = useMemo(
    () => promptSuggestionKeys.map((key) => t(key)),
    [t]
  );
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const [dialogHistory, setDialogHistory] = useState([]);
  const [quota, setQuota] = useState(null);
  const [diagnosisContext, setDiagnosisContext] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isPlantsLoading, setIsPlantsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [error, setError] = useState('');
  const [fallbackNote, setFallbackNote] = useState('');
  const rootRef = useRef(null);
  const messageListRef = useRef(null);
  const chatHeaderRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const getPlantDisplayValue = (value) => {
    if (!value) return '';
    const key = plantDisplayValueKeys[value];
    return key ? t(key) : value;
  };

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-chat-entry"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.md);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion] });

  useGSAP(() => {
    if (!messageListRef.current) return;

    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });

    const bubbles = messageListRef.current.querySelectorAll('.chat-bubble');
    if (!bubbles.length) return;
    const lastBubble = bubbles[bubbles.length - 1];

    if (lastBubble.getAttribute('data-new') === 'true') {
      lastBubble.removeAttribute('data-new');
      if (!reducedMotion) {
        gsap.fromTo(lastBubble,
          { scale: 0.96, opacity: 0, y: 8 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.5)' }
        );
      }
    }
  }, { scope: messageListRef, dependencies: [messages.length, reducedMotion] });

  useGSAP(() => {
    if (!chatHeaderRef.current || reducedMotion) return;

    gsap.fromTo(chatHeaderRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, { scope: chatHeaderRef, dependencies: [selectedPlantId, reducedMotion] });

  useEffect(() => {
    let active = true;

    const loadPlants = async () => {
      setIsPlantsLoading(true);
      try {
        const data = await getMyPlants();
        if (!active) return;
        const items = data?.items || [];
        setPlants(items);
        setSelectedPlantId((current) => {
          if (current) return current;
          return items.some((plant) => plant.id === routePlantId) ? routePlantId : '';
        });
      } catch (err) {
        if (!active) return;
        setPlants([]);
        setError(err?.message || t('aiChat.historyError'));
      } finally {
        if (active) setIsPlantsLoading(false);
      }
    };

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const data = await getMyAiDialogs({ limit: 5 });
        if (!active) return;
        setDialogHistory(data?.items || []);
        if (data?.source === 'mock-fallback') {
          setFallbackNote(t('aiChat.historyFallback'));
        }
      } catch (err) {
        if (!active) return;
        setError(err?.message || t('aiChat.historyError'));
      } finally {
        if (active) setIsHistoryLoading(false);
      }
    };

    const loadQuota = async () => {
      try {
        const data = await getAiQuota();
        if (active) setQuota(data);
      } catch {
        if (active) setQuota(null);
      }
    };

    setError('');
    loadPlants();
    loadHistory();
    loadQuota();
    return () => {
      active = false;
    };
  }, [t, routePlantId]);

  useEffect(() => {
    const stateContext = location.state?.aiDiagnosisContext;
    let storedContext = null;

    if (!stateContext) {
      try {
        storedContext = JSON.parse(sessionStorage.getItem(DIAGNOSIS_CONTEXT_STORAGE_KEY) || 'null');
      } catch {
        storedContext = null;
      }
    }

    const nextContext = stateContext || storedContext;
    if (!nextContext) return;

    setDiagnosisContext(nextContext);
    if (nextContext.plantId) setSelectedPlantId(nextContext.plantId);
    setMessages((current) => {
      if (current.some((message) => message.id === 'diagnosis-context')) return current;
      return [
        ...current,
        {
          id: 'diagnosis-context',
          from: 'assistant',
          text: t('aiChat.diagnosisContextMessage', {
            summary: nextContext.summary || t('aiAnalysis.summaryFallback'),
          }),
        },
      ];
    });
  }, [location.state, t]);

  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.id === selectedPlantId),
    [plants, selectedPlantId]
  );
  const hasPlants = plants.length > 0;
  const chatQuota = quota?.chat;
  const chatRemaining = typeof chatQuota?.remaining === 'number' ? chatQuota.remaining : null;
  const chatLimit = typeof chatQuota?.limit === 'number' ? chatQuota.limit : 5;
  const isChatQuotaExhausted = chatRemaining !== null && chatRemaining <= 0;
  const canSend = Boolean(input.trim() && !isSending && !isChatQuotaExhausted);

  const refreshQuota = async () => {
    try {
      setQuota(await getAiQuota());
    } catch {
      setQuota(null);
    }
  };

  const handleOpenDialog = async (dialogId) => {
    setIsDialogLoading(true);
    setError('');
    try {
      const dialog = await getMyAiDialog(dialogId);
      const nextMessages = (dialog?.messages || []).map((message) => ({
        id: message.id,
        from: message.role === 'user' ? 'user' : 'assistant',
        text: message.content,
      }));
      setMessages(nextMessages.length ? nextMessages : starterMessages);
      if (dialog?.plantId) setSelectedPlantId(dialog.plantId);
    } catch (err) {
      setError(err?.message || t('aiChat.historyError'));
    } finally {
      setIsDialogLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!canSend || !text) return;

    const userMessage = { id: `user-${Date.now()}`, from: 'user', text };
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const history = messages
        .filter((message) => message.id !== 'starter-1')
        .map((message) => ({
          role: message.from === 'user' ? 'user' : 'assistant',
          content: message.text,
        }));
      const shouldUseLocalDiagnosisContext = diagnosisContext && !diagnosisContext.diagnosisId;
      const diagnosisHistory = shouldUseLocalDiagnosisContext
        ? [{
            role: 'assistant',
            content: t('aiChat.diagnosisHistoryContext', {
              summary: diagnosisContext.summary || t('aiAnalysis.summaryFallback'),
              recommendations: (diagnosisContext.recommendations || []).join('; ') || t('aiChat.noDiagnosisRecommendations'),
            }),
          }]
        : [];
      const result = await sendPlantContextChatMessage({
        plantId: selectedPlant?.id,
        message: text,
        history: [...diagnosisHistory, ...history],
        plantContext: selectedPlant ? normalizePlantContext(selectedPlant) : undefined,
        diagnosisResultId: diagnosisContext?.diagnosisId,
      });

      const assistantMessage = {
        id: result?.dialogId || `assistant-${Date.now()}`,
        from: 'assistant',
        text: result?.reply || t('aiChat.replyFallback'),
      };
      setMessages((current) => [...current, assistantMessage]);
      setTypingMessageId(assistantMessage.id);

      if (result?.source === 'mock-fallback') {
        setFallbackNote(t('aiChat.replyFallbackNote'));
      }
      if (diagnosisContext) {
        sessionStorage.removeItem(DIAGNOSIS_CONTEXT_STORAGE_KEY);
        setDiagnosisContext(null);
      }
      await refreshQuota();
    } catch (err) {
      if (err?.status === 429) {
        setError(err?.message || t('aiChat.quotaExhausted'));
        setQuota((current) => current ? {
          ...current,
          hasVerifiedPlant: err?.details?.hasVerifiedPlant ?? current.hasVerifiedPlant,
          chat: {
            ...(current.chat || {}),
            limit: err?.details?.limit ?? current.chat?.limit,
            used: err?.details?.used ?? current.chat?.used,
            remaining: err?.details?.remaining ?? 0,
          },
        } : current);
      } else {
        setError(err?.message || t('aiChat.sendError'));
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <UserLayout>
      <div ref={rootRef} className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 pb-24 sm:p-6 md:p-8">
        <Card data-motion="ai-chat-entry" radius="hero" padding="feature" className="overflow-hidden bg-gradient-to-br from-white via-[#F7FBF5] to-[#EEF7EC] dark:from-surface-dark dark:via-[#102116] dark:to-[#0B1510]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="primary" icon="psychiatry">{t('aiChat.badge')}</Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-text-main dark:text-white sm:text-4xl">
                {t('aiChat.title')}
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300 sm:text-base">
                {t('aiChat.description')}
              </p>
            </div>
            <div className="grid gap-2 text-xs font-bold text-text-secondary dark:text-slate-300 sm:min-w-72">
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">{t('aiChat.signal.noClaim')}</span>
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">{t('aiChat.signal.notGeneral')}</span>
            </div>
          </div>
          {fallbackNote && <StateNotice tone="warning" className="mt-5 text-xs">{fallbackNote}</StateNotice>}
          <StateNotice tone="info" className="mt-5 text-xs">
            {chatRemaining === null
              ? t('aiChat.quotaFallback')
              : t('aiChat.quotaStatus', { remaining: chatRemaining, limit: chatLimit })}
          </StateNotice>
          <StateNotice tone="info" className="mt-3 text-xs">
            Chat messages and plant context may be processed by Gemini/Google and hosting providers. <Link to="/privacy" className="font-bold text-primary hover:underline">Privacy Policy</Link>
          </StateNotice>
          {error && <StateNotice tone="error" className="mt-5 text-xs">{error}</StateNotice>}
        </Card>

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <Card data-motion="ai-chat-entry" as="aside" radius="hero" padding="feature" className="h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-primary">{t('aiChat.contextEyebrow')}</p>
                <h2 className="mt-1 text-lg font-extrabold text-text-main dark:text-white">{t('aiChat.contextTitle')}</h2>
              </div>
              <Badge tone="success">{t('aiChat.contextBadge')}</Badge>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
              {t('aiChat.contextDescription')}
            </p>

            <div className="mt-5 space-y-3">
              {isPlantsLoading ? (
                <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E4EEE6] bg-white px-4 py-3 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                  <Spinner />
                  Loading your plants...
                </div>
              ) : !hasPlants ? (
                <EmptyState title={t('aiChat.noPlantsTitle')} description={t('aiChat.noPlantsDescription')} />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedPlantId('')}
                    aria-pressed={!selectedPlantId}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                      !selectedPlantId
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-[#E4EEE6] bg-white hover:border-primary/40 dark:border-[#2A4532] dark:bg-white/5'
                    }`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined" aria-hidden="true">psychiatry</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-text-main dark:text-white">{t('aiChat.generalModeTitle')}</span>
                      <span className="block truncate text-xs font-bold text-text-secondary dark:text-slate-400">{t('aiChat.generalModeDescription')}</span>
                    </span>
                    {!selectedPlantId && <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">check_circle</span>}
                  </button>
                  {plants.map((plant) => {
                  const active = plant.id === selectedPlantId;
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedPlantId(plant.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                        active
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-[#E4EEE6] bg-white hover:border-primary/40 dark:border-[#2A4532] dark:bg-white/5'
                      }`}
                    >
                      <img src={plant.image} alt={plant.nickname} className="h-14 w-14 rounded-2xl object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-text-main dark:text-white">{plant.nickname}</span>
                        <span className="block truncate text-xs font-bold text-text-secondary dark:text-slate-400">{plant.species}</span>
                        <span className="mt-1 block truncate text-[11px] font-semibold text-primary">{getPlantDisplayValue(plant.status)}</span>
                      </span>
                      {active && <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">check_circle</span>}
                    </button>
                  );
                  })}
                </>
              )}
            </div>

            <div className="mt-6 border-t border-[#E4EEE6] pt-5 dark:border-[#2A4532]">
              <p className="text-xs font-bold text-primary">Recent dialogs</p>
              <div className="mt-3 space-y-2">
                {isHistoryLoading ? (
                  <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{t('aiChat.historyLoading')}</p>
                ) : dialogHistory.length === 0 ? (
                  <p className="text-xs font-bold text-text-secondary dark:text-slate-400">No saved AI dialogs yet.</p>
                ) : (
                  dialogHistory.map((dialog) => (
                    <button
                      key={dialog.id}
                      type="button"
                      onClick={() => handleOpenDialog(dialog.id)}
                      disabled={isDialogLoading}
                      className="w-full rounded-2xl border border-[#E4EEE6] bg-white/70 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#2A4532] dark:bg-white/5"
                    >
                      <p className="truncate text-xs font-extrabold text-text-main dark:text-white">{dialog.plantName || dialog.title || 'AI dialog'}</p>
                      <p className="mt-1 truncate text-[11px] font-semibold text-text-secondary dark:text-slate-400">{dialog.lastMessage || 'No preview'}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Card>

          <section data-motion="ai-chat-entry" className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-[#E4EEE6] bg-white shadow-sm dark:border-[#2A4532] dark:bg-surface-dark">
            <div ref={chatHeaderRef} className="border-b border-[#E4EEE6] p-4 dark:border-[#2A4532] sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-secondary dark:text-slate-400">{t('aiChat.consultingFor')}</p>
                  <h2 className="mt-1 truncate text-xl font-extrabold text-text-main dark:text-white">{selectedPlant?.nickname || t('aiChat.generalModeTitle')}</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                    {selectedPlant ? t('aiChat.selectedPlantContext', { species: selectedPlant.species, status: getPlantDisplayValue(selectedPlant.status) }) : t('aiChat.generalModePrompt')}
                  </p>
                </div>
                {selectedPlant && (
                  <div className="grid grid-cols-2 gap-2 text-xs sm:min-w-64">
                    <span className="rounded-2xl bg-primary/10 px-3 py-2 font-bold text-primary">{t('aiChat.lightLabel')}: {getPlantDisplayValue(selectedPlant.light)}</span>
                    <span className="rounded-2xl bg-primary/10 px-3 py-2 font-bold text-primary">{t('aiChat.waterLabel')}: {getPlantDisplayValue(selectedPlant.water)}</span>
                  </div>
                )}
              </div>
            </div>

            <div ref={messageListRef} className="flex-1 space-y-4 overflow-y-auto bg-[#FAFCF8] p-4 dark:bg-[#09130D] sm:p-5">
              {isHistoryLoading && (
                <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E4EEE6] bg-white px-5 py-4 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                  <Spinner />
                  {t('aiChat.historyLoading')}
                </div>
              )}
              {isDialogLoading && (
                <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E4EEE6] bg-white px-5 py-4 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                  <Spinner />
                  Loading dialog...
                </div>
              )}
              {!isHistoryLoading && messages.length === 0 && (
                <EmptyState icon="forum" title={t('aiChat.emptyTitle')} description={t('aiChat.emptyDescription')} />
              )}

              {!isHistoryLoading && messages.length <= 1 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {promptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="rounded-2xl border border-[#E4EEE6] bg-white px-4 py-3 text-left text-sm font-bold text-text-main transition hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-[#2A4532] dark:bg-white/5 dark:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((message, index) => {
                const user = message.from === 'user';
                const isTyping = message.id === typingMessageId;
                const isNew = index > 0 && index === messages.length - 1;

                return (
                  <div key={message.id} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`chat-bubble max-w-[94%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] sm:px-5 ${
                        user
                          ? 'rounded-br-lg bg-primary text-white'
                          : 'rounded-bl-lg border border-[#E4EEE6] bg-white text-text-main dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-100'
                      }`}
                      data-new={isNew ? 'true' : 'false'}
                    >
                      {!user && <p className="mb-1 text-[11px] font-extrabold text-primary">{t('aiChat.assistantLabel')}</p>}
                      {isTyping ? (
                        <TypedText
                          text={message.id === 'starter-1' ? t('aiChat.description') : message.text}
                          onComplete={() => setTypingMessageId(null)}
                        />
                      ) : (
                        user ? (
                          <p className="font-semibold leading-6">{message.text}</p>
                        ) : (
                          <AIFormattedText text={message.id === 'starter-1' ? t('aiChat.description') : message.text} />
                        )
                      )}
                    </div>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-3 rounded-3xl rounded-bl-lg border border-[#E4EEE6] bg-white px-5 py-3 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                    <Spinner />
                    {t('aiChat.thinking')}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#E4EEE6] bg-white p-3 dark:border-[#2A4532] dark:bg-surface-dark sm:p-5">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-2 dark:border-[#2A4532] dark:bg-white/5 sm:flex-row sm:items-center">
                <label className="sr-only" htmlFor="ai-care-question">{t('aiChat.inputLabel')}</label>
                <input
                  id="ai-care-question"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isSending || isChatQuotaExhausted}
                  placeholder={selectedPlant ? t('aiChat.placeholderWithPlant', { plant: selectedPlant.nickname }) : t('aiChat.placeholderNoPlant')}
                  className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-text-main outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-400"
                />
                <Button type="submit" disabled={!canSend} loading={isSending} className="w-full sm:w-auto">
                  {isSending ? t('aiChat.sending') : t('aiChat.sendButton')}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIChat;
