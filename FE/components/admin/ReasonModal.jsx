import React, { useState } from 'react';
import Button from '../Button';
import { useI18n } from '../../i18n/I18nContext';

const ReasonModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  targetSummary,
  effectSummary,
  confirmLabel,
  loading,
  error
}) => {
  const [reason, setReason] = useState('');
  const { t } = useI18n();
  const isValid = reason.trim().length >= 10 && reason.trim().length <= 500;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(reason);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900 sm:p-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{title}</h2>
        
        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">{t("admin.reasonModal.targetLabel")}</p>
          <div className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            {targetSummary}
          </div>
        </div>

        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {effectSummary}
        </p>

        <div className="mt-6">
          <label htmlFor="reason" className="block text-sm font-black text-slate-700 dark:text-slate-200">
            {t("admin.reasonModal.reasonLabel")} <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:bg-amber-950 dark:text-amber-400">{t("admin.reasonModal.auditedBadge")}</span>
          </label>
          <textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            placeholder={t("admin.reasonModal.reasonPlaceholder")}
          />
          <p className="mt-2 text-xs font-bold text-slate-400">
            {t("admin.reasonModal.reasonHint", { count: reason.trim().length })}
          </p>
        </div>

        <div className="mt-8 flex gap-3 sm:flex-row flex-col-reverse">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant={confirmLabel.toLowerCase().includes('disable') || confirmLabel.toLowerCase().includes('suppress') ? 'destructive' : 'primary'}
            onClick={handleConfirm}
            disabled={!isValid || loading}
            loading={loading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
