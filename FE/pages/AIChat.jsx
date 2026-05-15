import React, { useEffect, useMemo, useState } from 'react';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';
import { getMyAiDialogs, sendPlantContextChatMessage } from '../services/aiApi';

const starterMessages = [
  {
    id: 'starter-1',
    from: 'assistant',
    text: 'Chọn một cây để AI dùng đúng ngữ cảnh chăm sóc. Backend chưa sẵn sàng nên service tự dùng mock fallback.',
  },
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

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      setError('');
      try {
        const data = await getMyAiDialogs({ limit: 5 });
        if (!active) return;
        if (data?.source === 'mock-fallback') {
          setFallbackNote('Using mock AI history until backend endpoints are ready.');
        }
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Could not load AI dialog history.');
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
          text: result?.reply || 'Mock fallback reply unavailable.',
        },
      ]);
      if (result?.source === 'mock-fallback') {
        setFallbackNote('Using mock AI reply until backend /ai/chat is available.');
      }
    } catch (err) {
      setError(err?.message || 'Could not send AI chat message.');
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          from: 'assistant',
          text: 'AI service unavailable. Please try again later.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <UserLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 sm:p-6 md:p-8">
        <div className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">AI Chat MVP</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Plant care chat</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            Select one saved plant first. AI answers stay scoped to that plant's care profile, notes, and status.
          </p>
          {fallbackNote && (
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              {fallbackNote}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 px-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Choose plant</h2>
              <span className="rounded-full bg-[#4CAF50]/10 px-3 py-1 text-[11px] font-black text-[#4CAF50]">Context</span>
            </div>
            <p className="mt-2 px-1 text-xs font-semibold leading-5 text-slate-400">
              Selected plant → chat context. No general-purpose chatbot.
            </p>

            <div className="mt-4 space-y-3">
              {!hasPlants ? (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-5 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-300">potted_plant</span>
                  <p className="mt-2 text-sm font-black text-slate-700 dark:text-slate-200">No saved plants yet</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">Add a plant before using AI care chat.</p>
                </div>
              ) : (
                MY_PLANTS.map((plant) => {
                  const active = plant.id === selectedPlantId;
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedPlantId(plant.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        active
                          ? 'border-[#4CAF50] bg-[#4CAF50]/10 shadow-sm'
                          : 'border-slate-100 hover:border-[#4CAF50]/40 dark:border-slate-800'
                      }`}
                    >
                      <img src={plant.image} alt={plant.nickname} className="h-12 w-12 rounded-2xl object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-slate-900 dark:text-white">{plant.nickname}</span>
                        <span className="block truncate text-xs font-bold text-slate-400">{plant.species}</span>
                      </span>
                      {active && <span className="material-symbols-outlined text-lg text-[#4CAF50]">check_circle</span>}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="flex min-h-[520px] flex-col rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-100 dark:border-slate-800 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chat context</p>
              <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{selectedPlant?.nickname || 'Select a plant'}</h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {selectedPlant ? `AI will use ${selectedPlant.species}, status: ${selectedPlant.status}.` : 'Plant context required before sending.'}
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              {isHistoryLoading && (
                <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm font-bold text-slate-400 dark:bg-slate-800">
                  Loading dialog history...
                </div>
              )}
              {!isHistoryLoading && messages.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm font-bold text-slate-400 dark:border-slate-700">
                  No messages yet. Select a plant and ask a care question.
                </div>
              )}
              {messages.map((message) => {
                const user = message.from === 'user';
                return (
                  <div key={message.id} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] sm:max-w-[80%] rounded-3xl px-5 py-3 text-sm font-semibold leading-6 ${
                      user ? 'bg-[#4CAF50] text-white' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-3xl bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400 dark:bg-slate-800">
                    AI is preparing plant-specific advice...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 p-4 sm:p-5">
              <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 sm:flex-row">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={!selectedPlant || isSending}
                  placeholder={selectedPlant ? `Ask about watering, light, or health for ${selectedPlant.nickname}...` : 'Select a plant before asking a care question...'}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-400 sm:py-0"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4CAF50] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSending && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                  {isSending ? 'Sending' : 'Send'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIChat;
