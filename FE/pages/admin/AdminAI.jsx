import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminAiConfigStatus,
  getAdminAiDialog,
  getAdminAiDialogs,
} from '../../services/adminApi';

const getUserLabel = (dialog) =>
  dialog?.userEmail || dialog?.userName || 'Unknown user';

const getContextLabel = (dialog) =>
  dialog?.plantId ? `Plant chat - ${dialog.plantName || 'Unknown plant'}` : 'General chat';

const formatDateTime = (value) => {
  if (!value) return 'Unknown time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const AdminAI = () => {
  const [status, setStatus] = useState(null);
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDialog, setSelectedDialog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [statusData, dialogData] = await Promise.all([
          getAdminAiConfigStatus(),
          getAdminAiDialogs({ limit: 10 }),
        ]);
        if (!active) return;
        setStatus(statusData);
        setDialogs(dialogData?.items || []);
      } catch (err) {
        if (active) {
          setStatus(null);
          setDialogs([]);
          setError(err?.message || 'Could not load AI admin status.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const openDialogDetail = async (dialogId) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const data = await getAdminAiDialog(dialogId);
      setSelectedDialog(data);
    } catch (err) {
      setSelectedDialog(null);
      setDetailError(err?.message || 'Could not load AI dialog detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">AI</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">AI chat status</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              Plant-context AI operations only. Admin can view provider config/status, never edit raw API keys.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Provider: {loading ? 'loading' : status?.provider || 'unknown'}
            </span>
            <span className={`rounded-full px-3 py-2 text-xs font-black ${status?.configured ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
              Configured: {loading ? 'loading' : status?.configured ? 'yes' : 'no'}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Mode: {loading ? 'loading' : status?.mode || status?.source || 'backend'}
            </span>
          </div>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Admin AI data unavailable. Backend endpoints required: GET /api/admin/ai-config/status and GET /api/admin/ai-dialogs.</p>}

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Dialog history</p>
                  <h2 className="mt-1 text-lg font-black text-slate-900 dark:text-white">Recent AI conversations</h2>
                </div>
                <p className="text-xs font-bold text-slate-400">{dialogs.length} dialogs</p>
              </div>
              <div className="mt-3 space-y-3">
                {loading ? (
                  <p className="text-sm font-bold text-slate-400">Loading dialogs...</p>
                ) : error ? (
                  <p className="text-sm font-bold text-slate-400">AI dialogs could not be loaded from the real backend. No mock AI logs are shown.</p>
                ) : dialogs.length === 0 ? (
                  <p className="text-sm font-bold text-slate-400">No AI dialogs found yet. Plant-context chat history will appear here.</p>
                ) : (
                  dialogs.map((dialog) => (
                    <button
                      key={dialog.id}
                      type="button"
                      onClick={() => openDialogDetail(dialog.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition hover:border-[#4CAF50]/40 hover:bg-[#4CAF50]/5 focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/20 dark:hover:bg-[#4CAF50]/10 ${
                        selectedDialog?.id === dialog.id
                          ? 'border-[#4CAF50]/50 bg-[#4CAF50]/10 dark:bg-[#4CAF50]/10'
                          : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800'
                      }`}
                    >
                      <div className="grid gap-3 lg:grid-cols-[180px_160px_minmax(0,1fr)_130px] lg:items-center">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{getUserLabel(dialog)}</p>
                          {dialog.userId && <p className="mt-1 truncate text-[11px] font-semibold text-slate-400">{dialog.userId}</p>}
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${dialog.plantId ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {getContextLabel(dialog)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{dialog.title || dialog.plantName || 'Untitled dialog'}</p>
                          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{dialog.lastMessage || 'No preview'}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 lg:text-right">{formatDateTime(dialog.updatedAt || dialog.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Dialog detail</p>
              {detailLoading ? (
                <p className="mt-3 text-sm font-bold text-slate-400">Loading dialog detail...</p>
              ) : detailError ? (
                <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{detailError}</p>
              ) : !selectedDialog ? (
                <p className="mt-3 text-sm font-bold text-slate-400">Select a dialog to inspect messages from the real backend.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedDialog.title || selectedDialog.plantName || 'Untitled dialog'}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">User: {getUserLabel(selectedDialog)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Context: {getContextLabel(selectedDialog)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">Created: {formatDateTime(selectedDialog.createdAt)}</p>
                  </div>
                  <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                    {(selectedDialog.messages || []).length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-bold text-slate-400 dark:border-slate-700">No messages returned by backend detail endpoint.</p>
                    ) : (
                      selectedDialog.messages.map((message, index) => (
                        <div key={message.id || `${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[88%] rounded-2xl p-4 ${message.role === 'user' ? 'rounded-br-md bg-[#4CAF50] text-white' : 'rounded-bl-md bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                            <p className={`text-[11px] font-black uppercase tracking-widest ${message.role === 'user' ? 'text-white/80' : 'text-[#4CAF50]'}`}>{message.role || 'message'}</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6">{message.content || 'Empty message'}</p>
                            {message.createdAt && <p className={`mt-2 text-[11px] font-semibold ${message.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>{formatDateTime(message.createdAt)}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </aside>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminAI;
