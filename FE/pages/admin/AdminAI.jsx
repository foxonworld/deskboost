import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminAiConfigStatus,
  getAdminAiDialog,
  getAdminAiDialogs,
} from '../../services/adminApi';
import { useI18n } from '../../i18n';

const getUserLabel = (dialog, t) =>
  dialog?.userEmail || dialog?.userName || t('admin.ai.unknownUser');

const getContextLabel = (dialog, t) =>
  dialog?.plantId ? t('admin.ai.plantChat', { plant: dialog.plantName || t('admin.ai.unknownPlant') }) : t('admin.ai.generalChat');

const formatDateTime = (value, t) => {
  if (!value) return t('admin.ai.unknownTime');
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
  const { t } = useI18n();

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
          setError(err?.message || t('admin.ai.error.load'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [t]);

  const openDialogDetail = async (dialogId) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const data = await getAdminAiDialog(dialogId);
      setSelectedDialog(data);
    } catch (err) {
      setSelectedDialog(null);
      setDetailError(err?.message || t('admin.ai.error.detail'));
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.ai.badge')}</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('admin.ai.title')}</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              {t('admin.ai.description')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {t('admin.ai.provider')}: {loading ? t('admin.loadingLower') : status?.provider || t('admin.unknown')}
            </span>
            <span className={`rounded-full px-3 py-2 text-xs font-black ${status?.configured ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
              {t('admin.ai.configured')}: {loading ? t('admin.loadingLower') : status?.configured ? t('admin.yes') : t('admin.no')}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {t('admin.ai.mode')}: {loading ? t('admin.loadingLower') : status?.mode || status?.source || 'backend'}
            </span>
          </div>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{t('admin.ai.backendUnavailable')}</p>}

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('admin.ai.dialogHistory')}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-900 dark:text-white">{t('admin.ai.recentConversations')}</h2>
                </div>
                <p className="text-xs font-bold text-slate-400">{t('admin.ai.dialogCount', { count: dialogs.length })}</p>
              </div>
              <div className="mt-3 space-y-3">
                {loading ? (
                  <p className="text-sm font-bold text-slate-400">{t('admin.ai.loadingDialogs')}</p>
                ) : error ? (
                  <p className="text-sm font-bold text-slate-400">{t('admin.ai.emptyBackend')}</p>
                ) : dialogs.length === 0 ? (
                  <p className="text-sm font-bold text-slate-400">{t('admin.ai.empty')}</p>
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
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{getUserLabel(dialog, t)}</p>
                          {dialog.userId && <p className="mt-1 truncate text-[11px] font-semibold text-slate-400">{dialog.userId}</p>}
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${dialog.plantId ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {getContextLabel(dialog, t)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">{dialog.title || dialog.plantName || t('admin.ai.untitledDialog')}</p>
                          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{dialog.lastMessage || t('admin.ai.noPreview')}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 lg:text-right">{formatDateTime(dialog.updatedAt || dialog.createdAt, t)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('admin.ai.dialogDetail')}</p>
              {detailLoading ? (
                <p className="mt-3 text-sm font-bold text-slate-400">{t('admin.ai.detailLoading')}</p>
              ) : detailError ? (
                <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{detailError}</p>
              ) : !selectedDialog ? (
                <p className="mt-3 text-sm font-bold text-slate-400">{t('admin.ai.selectDialog')}</p>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedDialog.title || selectedDialog.plantName || t('admin.ai.untitledDialog')}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t('admin.ai.user')}: {getUserLabel(selectedDialog, t)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{t('admin.ai.context')}: {getContextLabel(selectedDialog, t)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{t('admin.users.created')}: {formatDateTime(selectedDialog.createdAt, t)}</p>
                  </div>
                  <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
                    {(selectedDialog.messages || []).length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.ai.noMessages')}</p>
                    ) : (
                      selectedDialog.messages.map((message, index) => (
                        <div key={message.id || `${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[88%] rounded-2xl p-4 ${message.role === 'user' ? 'rounded-br-md bg-[#4CAF50] text-white' : 'rounded-bl-md bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                            <p className={`text-[11px] font-black uppercase tracking-widest ${message.role === 'user' ? 'text-white/80' : 'text-[#4CAF50]'}`}>{message.role || t('admin.ai.message')}</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6">{message.content || t('admin.ai.emptyMessage')}</p>
                            {message.createdAt && <p className={`mt-2 text-[11px] font-semibold ${message.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>{formatDateTime(message.createdAt, t)}</p>}
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
