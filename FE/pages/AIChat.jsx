import React, { useMemo, useState } from 'react';
import UserLayout from '../components/UserLayout';
import { MY_PLANTS } from '../data/mockData';

const starterMessages = [
  {
    id: 'mock-1',
    from: 'assistant',
    text: 'AI Chat skeleton đang dùng mock fallback. Chọn cây rồi nhập câu hỏi chăm sóc cơ bản.',
  },
];

const AIChat = () => {
  const [selectedPlantId, setSelectedPlantId] = useState(MY_PLANTS[0]?.id || '');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(starterMessages);

  const selectedPlant = useMemo(
    () => MY_PLANTS.find((plant) => plant.id === selectedPlantId),
    [selectedPlantId]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, from: 'user', text },
      {
        id: `mock-${Date.now()}`,
        from: 'assistant',
        text: `Mock fallback: Phase 2 sẽ gửi câu hỏi về ${selectedPlant?.nickname || 'cây đã chọn'} tới backend AI API.`,
      },
    ]);
    setInput('');
  };

  return (
    <UserLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">
        <div className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">AI Chat MVP</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Plant care chat</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            Phase 1 skeleton only. Select one of your plants, preview a chat panel, and use mock fallback until backend APIs exist.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="px-2 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Your plants</h2>
            <div className="mt-4 space-y-3">
              {MY_PLANTS.map((plant) => {
                const active = plant.id === selectedPlantId;
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setSelectedPlantId(plant.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      active
                        ? 'border-[#4CAF50] bg-[#4CAF50]/10'
                        : 'border-slate-100 hover:border-[#4CAF50]/40 dark:border-slate-800'
                    }`}
                  >
                    <img src={plant.image} alt={plant.nickname} className="h-12 w-12 rounded-2xl object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-slate-900 dark:text-white">{plant.nickname}</span>
                      <span className="block truncate text-xs font-bold text-slate-400">{plant.species}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex min-h-[560px] flex-col rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-100 dark:border-slate-800 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Chat context</p>
              <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{selectedPlant?.nickname || 'Select a plant'}</h2>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((message) => {
                const user = message.from === 'user';
                return (
                  <div key={message.id} className={`flex ${user ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-3xl px-5 py-3 text-sm font-semibold leading-6 ${
                      user ? 'bg-[#4CAF50] text-white' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 p-5">
              <div className="flex gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about watering, light, or plant health..."
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
                <button type="submit" className="rounded-xl bg-[#4CAF50] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:scale-[1.02]">
                  Send
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
