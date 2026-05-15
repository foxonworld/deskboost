import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAdminAiConfigStatus, getAdminAiDialogs } from '../../services/adminApi';

const AdminAI = () => {
  const [status, setStatus] = useState(null);
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        if (active) setError(err?.message || 'Could not load AI admin status.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">AI</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">AI chat status</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          Plant-context AI operations only. Admin can view provider config/status, never edit raw API keys.
        </p>
        {status?.source === 'mock-fallback' && <p className="mt-4 text-xs font-bold text-amber-600">Mock fallback active.</p>}
        {error && <p className="mt-4 text-sm font-bold text-red-500">{error}</p>}

        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Config/status</p>
            {loading ? (
              <p className="mt-3 text-sm font-bold text-slate-400">Loading AI status...</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                <p>Provider: {status?.provider || 'unknown'}</p>
                <p>Configured: {status?.configured ? 'yes' : 'no'}</p>
                <p>Mode: {status?.mode || status?.source || 'backend'}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Dialog history</p>
            <div className="mt-3 space-y-3">
              {loading ? (
                <p className="text-sm font-bold text-slate-400">Loading dialogs...</p>
              ) : dialogs.length === 0 ? (
                <p className="text-sm font-bold text-slate-400">No AI dialogs found.</p>
              ) : (
                dialogs.map((dialog) => (
                  <div key={dialog.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{dialog.plantName}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{dialog.userName} · {dialog.lastMessage}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminAI;
