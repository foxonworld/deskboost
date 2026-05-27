import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';
import { getMyAiDialogs, sendPlantContextChatMessage } from '../services/aiApi';
import { EmptyState, Spinner, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';

gsap.registerPlugin(useGSAP);

const starterMessages = [
  {
    id: 'starter-1',
    from: 'assistant',
    text: 'Mình là DeskBoost AI — trợ lý chăm cây theo ngữ cảnh cây bạn chọn. Hãy chọn cây và hỏi về nước, ánh sáng, lá, đất hoặc dấu hiệu bất thường.',
  },
];

const promptSuggestions = [
  'Hôm nay cây này có cần tưới không?',
  'Lá hơi vàng thì nên kiểm tra gì trước?',
  'Vị trí bàn làm việc này có đủ sáng không?',
  'Lịch chăm sóc tuần này nên như thế nào?',
];

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

const AIChat = () => {
  const [selectedPlantId, setSelectedPlantId] = useState(MY_PLANTS[0]?.id || '');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(starterMessages);
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [fallbackNote, setFallbackNote] = useState('');
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-chat-entry"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.md);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion] });

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setError('');
      try {
        const data = await getMyAiDialogs({ limit: 5 });
        if (!active) return;
        if (data?.source === 'mock-fallback') {
          setFallbackNote('Đang dùng lịch sử AI mẫu trong khi backend chưa sẵn sàng.');
        }
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Chưa tải được lịch sử AI. Bạn vẫn có thể thử gửi câu hỏi mới.');
      } finally {
        if (active) setIsHistoryLoading(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  const selectedPlant = useMemo(
    () => MY_PLANTS.find((plant) => plant.id === selectedPlantId),
    [selectedPlantId]
  );
  const hasPlants = MY_PLANTS.length > 0;
  const canSend = Boolean(input.trim() && selectedPlant && !isSending);

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
      const history = messages.map((message) => ({
        role: message.from === 'user' ? 'user' : 'assistant',
        content: message.text,
      }));
      const result = await sendPlantContextChatMessage({
        plantId: selectedPlant.id,
        message: text,
        history,
        plantContext: normalizePlantContext(selectedPlant),
      });

      setMessages((current) => [
        ...current,
        {
          id: result?.dialogId || `assistant-${Date.now()}`,
          from: 'assistant',
          text: result?.reply || 'Chưa có phản hồi mẫu khả dụng. Hãy thử lại với câu hỏi chăm cây cụ thể hơn.',
        },
      ]);
      if (result?.source === 'mock-fallback') {
        setFallbackNote('Đang dùng phản hồi AI mẫu trong khi backend /ai/chat chưa sẵn sàng.');
      }
    } catch (err) {
      setError(err?.message || 'Tin nhắn chưa gửi được. Kiểm tra kết nối rồi thử lại.');
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          from: 'assistant',
          text: 'Mình chưa đọc được ngữ cảnh lúc này. Bạn có thể thử lại sau ít phút hoặc hỏi ngắn hơn về nước, sáng, lá hay đất.',
        },
      ]);
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
              <Badge tone="primary" icon="psychiatry">AI chăm cây theo ngữ cảnh</Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-text-main dark:text-white sm:text-4xl">
                Hỏi DeskBoost AI như một trợ lý chăm cây riêng cho bàn làm việc.
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300 sm:text-base">
                AI chỉ trả lời trong phạm vi chăm cây: nước, ánh sáng, đất, lá, thói quen chăm sóc và ghi chú của cây đang chọn.
              </p>
            </div>
            <div className="grid gap-2 text-xs font-bold text-text-secondary dark:text-slate-300 sm:min-w-72">
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">Không cần QR/Claim để dùng AI</span>
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">Không phải chatbot tổng quát</span>
            </div>
          </div>
          {fallbackNote && <StateNotice tone="warning" className="mt-5 text-xs">{fallbackNote}</StateNotice>}
          {error && <StateNotice tone="error" className="mt-5 text-xs">{error}</StateNotice>}
        </Card>

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <Card data-motion="ai-chat-entry" as="aside" radius="hero" padding="feature" className="h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-primary">Ngữ cảnh cây</p>
                <h2 className="mt-1 text-lg font-extrabold text-text-main dark:text-white">Chọn cây để AI đọc đúng bối cảnh</h2>
              </div>
              <Badge tone="success">Context</Badge>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
              Việc chọn cây chỉ giúp câu trả lời cụ thể hơn; AI vẫn là tính năng chăm cây mở, không khóa bằng claim.
            </p>

            <div className="mt-5 space-y-3">
              {!hasPlants ? (
                <EmptyState title="Chưa có cây để chọn" description="Bạn có thể thêm cây sau; AI không yêu cầu QR/Claim trong MVP." />
              ) : (
                MY_PLANTS.map((plant) => {
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
                        <span className="mt-1 block truncate text-[11px] font-semibold text-primary">{plant.status}</span>
                      </span>
                      {active && <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">check_circle</span>}
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          <section data-motion="ai-chat-entry" className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-[#E4EEE6] bg-white shadow-sm dark:border-[#2A4532] dark:bg-surface-dark">
            <div className="border-b border-[#E4EEE6] p-4 dark:border-[#2A4532] sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-secondary dark:text-slate-400">Đang tư vấn cho</p>
                  <h2 className="mt-1 truncate text-xl font-extrabold text-text-main dark:text-white">{selectedPlant?.nickname || 'Chọn một cây'}</h2>
                  <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                    {selectedPlant ? `${selectedPlant.species} · ${selectedPlant.status}. AI dùng hồ sơ cây, ánh sáng, nước và ghi chú hiện có.` : 'Chọn cây để gửi câu hỏi chăm sóc.'}
                  </p>
                </div>
                {selectedPlant && (
                  <div className="grid grid-cols-2 gap-2 text-xs sm:min-w-64">
                    <span className="rounded-2xl bg-primary/10 px-3 py-2 font-bold text-primary">Ánh sáng: {selectedPlant.light}</span>
                    <span className="rounded-2xl bg-primary/10 px-3 py-2 font-bold text-primary">Nước: {selectedPlant.water}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAFCF8] p-4 dark:bg-[#09130D] sm:p-5">
              {isHistoryLoading && (
                <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E4EEE6] bg-white px-5 py-4 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                  <Spinner />
                  Đang đọc lịch sử chăm cây...
                </div>
              )}
              {!isHistoryLoading && messages.length === 0 && (
                <EmptyState icon="forum" title="Bắt đầu bằng một câu hỏi chăm cây" description="Hỏi về tưới nước, ánh sáng, lá vàng, đất hoặc lịch chăm sóc. AI sẽ trả lời theo cây đang chọn." />
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

              {messages.map((message) => {
                const user = message.from === 'user';
                return (
                  <div key={message.id} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[94%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] sm:px-5 ${
                      user
                        ? 'rounded-br-lg bg-primary text-white'
                        : 'rounded-bl-lg border border-[#E4EEE6] bg-white text-text-main dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-100'
                    }`}
                    >
                      {!user && <p className="mb-1 text-[11px] font-extrabold text-primary">DeskBoost AI · plant-care only</p>}
                      <p className="font-semibold">{message.text}</p>
                    </div>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-3 rounded-3xl rounded-bl-lg border border-[#E4EEE6] bg-white px-5 py-3 text-sm font-bold text-text-secondary shadow-sm dark:border-[#2A4532] dark:bg-white/5 dark:text-slate-300">
                    <Spinner />
                    Đang đọc ngữ cảnh cây và soạn gợi ý...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#E4EEE6] bg-white p-3 dark:border-[#2A4532] dark:bg-surface-dark sm:p-5">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-2 dark:border-[#2A4532] dark:bg-white/5 sm:flex-row sm:items-center">
                <label className="sr-only" htmlFor="ai-care-question">Câu hỏi chăm cây</label>
                <input
                  id="ai-care-question"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={!selectedPlant || isSending}
                  placeholder={selectedPlant ? `Hỏi về ${selectedPlant.nickname}: nước, sáng, lá, đất...` : 'Chọn cây trước khi gửi câu hỏi chăm sóc...'}
                  className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-text-main outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-400"
                />
                <Button type="submit" disabled={!canSend} loading={isSending} className="w-full sm:w-auto">
                  {isSending ? 'Đang gửi' : 'Gửi câu hỏi'}
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
