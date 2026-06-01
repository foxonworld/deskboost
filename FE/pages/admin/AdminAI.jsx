import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminAiConfigStatus,
  getAdminAiDialog,
  getAdminAiDialogs,
} from '../../services/adminApi';

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
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">AI</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">AI chat status</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Plant-context AI operations only. Admin can view provider config/status, never edit raw API keys.
        </p>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">Admin AI data unavailable. Backend endpoints required: GET /api/admin/ai-config/status and GET /api/admin/ai-dialogs.</p>}

        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Config/status</p>
            {loading ? (
              <p className="mt-3 text-sm font-bold text-slate-400">Loading provider status (view-only)...</p>
            ) : error ? (
              <p className="mt-3 text-sm font-bold text-slate-400">Provider status could not be loaded from the real backend.</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                <p>Provider: {status?.provider || 'unknown'}</p>
                <p>Configured: {status?.configured ? 'yes' : 'no'}</p>
                <p>Mode: {status?.mode || status?.source || 'backend'}</p>
                <p className="text-xs text-slate-400">API keys stay backend-only. No editing UI.</p>
              </div>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
            <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Dialog history</p>
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
                      className="w-full rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-[#4CAF50]/10 focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/20 dark:bg-slate-800"
                    >
                      <p className="text-sm font-black text-slate-900 dark:text-white">{dialog.plantName || dialog.title || 'Untitled dialog'}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{dialog.userName || 'Unknown user'} - {dialog.lastMessage || 'No preview'}</p>
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
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedDialog.plantName || selectedDialog.title || 'Untitled dialog'}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">Created: {selectedDialog.createdAt || 'Unknown'}</p>
                  </div>
                  <div className="space-y-3">
                    {(selectedDialog.messages || []).length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-bold text-slate-400 dark:border-slate-700">No messages returned by backend detail endpoint.</p>
                    ) : (
                      selectedDialog.messages.map((message, index) => (
                        <div key={message.id || `${message.role}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                          <p className="text-[11px] font-black uppercase tracking-widest text-[#4CAF50]">{message.role || 'message'}</p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{message.content || 'Empty message'}</p>
                          {message.createdAt && <p className="mt-2 text-[11px] font-semibold text-slate-400">{message.createdAt}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminAI;
