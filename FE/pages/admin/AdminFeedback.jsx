import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  createAdminFeedback,
  deleteAdminFeedback,
  getAdminFeedback,
  getAdminMarketplacePlants,
  verifyAdminFeedback,
} from '../../services/adminApi';
import { uploadImage } from '../../services/uploadApi';
import { useI18n } from '../../i18n';

const emptyFeedbackForm = {
  customerAlias: '',
  rating: '5',
  comment: '',
  marketplaceItemId: '',
  purchaseChannel: 'zalo',
  publicImageUrls: '',
  evidenceImageUrls: '',
  evidenceNote: '',
  isVerified: true,
};

const parseUrls = (value) =>
  value
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

const formatDate = (value, t) => {
  if (!value) return t('admin.feedback.notSet');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const getChannelLabel = (t, value) => {
  const key = `admin.feedback.channel.${value || 'manual'}`;
  const label = t(key);
  return label === key ? value || t('admin.feedback.channel.manual') : label;
};

const AdminFeedback = () => {
  const { t } = useI18n();
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState('');
  const [uploading, setUploading] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => ({
    ...emptyFeedbackForm,
    customerAlias: t('admin.feedback.defaultCustomerAlias'),
  }));

  const loadMarketplaceItems = async () => {
    setMarketplaceLoading(true);
    try {
      const data = await getAdminMarketplacePlants({ limit: 100 });
      setMarketplaceItems(data?.items || []);
    } catch (err) {
      setMarketplaceItems([]);
      setError(err?.message || t('admin.feedback.error.loadMarketplace'));
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const loadFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const data = await getAdminFeedback();
      setFeedbackItems(data?.items || []);
    } catch (err) {
      setFeedbackItems([]);
      setError(err?.message || t('admin.feedback.loadError'));
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceItems();
    loadFeedback();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setError('');
    setNotice('');
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUploadImage = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(fieldName);
    setError('');
    setNotice('');
    try {
      const imageUrl = await uploadImage(file);
      setForm((current) => ({
        ...current,
        [fieldName]: [current[fieldName], imageUrl].filter(Boolean).join('\n'),
      }));
      setNotice(t('admin.feedback.notice.imageUploaded'));
    } catch (err) {
      setError(err?.message || t('admin.feedback.error.uploadFailed'));
    } finally {
      setUploading('');
      event.target.value = '';
    }
  };

  const handleCreateFeedback = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.marketplaceItemId) {
      setError(t('admin.feedback.validation.marketplaceRequired'));
      return;
    }
    if (!form.comment.trim()) {
      setError(t('admin.feedback.validation.commentRequired'));
      return;
    }

    setSaving(true);
    try {
      await createAdminFeedback({
        marketplaceItemId: form.marketplaceItemId,
        customerAlias: form.customerAlias.trim() || null,
        rating: Number(form.rating),
        comment: form.comment.trim(),
        purchaseChannel: form.purchaseChannel,
        publicImageUrls: parseUrls(form.publicImageUrls),
        evidenceImageUrls: parseUrls(form.evidenceImageUrls),
        evidenceNote: form.evidenceNote.trim() || null,
        isVerified: form.isVerified,
      });
      setForm((current) => ({
        ...current,
        comment: '',
        publicImageUrls: '',
        evidenceImageUrls: '',
        evidenceNote: '',
      }));
      setNotice(t('admin.feedback.notice.created'));
      await loadFeedback();
    } catch (err) {
      setError(err?.message || t('admin.feedback.error.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyFeedback = async (feedback) => {
    setActionId(feedback.id);
    setError('');
    setNotice('');
    try {
      const updated = await verifyAdminFeedback(feedback.id, { isVerified: !feedback.isVerified });
      setFeedbackItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setNotice(updated.isVerified ? t('admin.feedback.notice.verified') : t('admin.feedback.notice.unverified'));
    } catch (err) {
      setError(err?.message || t('admin.feedback.error.updateFailed'));
    } finally {
      setActionId('');
    }
  };

  const handleDeleteFeedback = async (feedback) => {
    if (!window.confirm(t('admin.feedback.confirm.delete'))) return;
    setActionId(feedback.id);
    setError('');
    setNotice('');
    try {
      await deleteAdminFeedback(feedback.id);
      setFeedbackItems((current) => current.filter((item) => item.id !== feedback.id));
      setNotice(t('admin.feedback.notice.deleted'));
    } catch (err) {
      setError(err?.message || t('admin.feedback.error.deleteFailed'));
    } finally {
      setActionId('');
    }
  };

  const getMarketplaceItem = (feedback) =>
    marketplaceItems.find((item) => item.id === feedback.marketplaceItemId);

  return (
    <AdminLayout>
      <section className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#111813]/70 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">{t('admin.feedback.badge')}</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{t('admin.feedback.title')}</h1>
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
          {t('admin.feedback.description')}
        </p>
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        {notice && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{notice}</p>}

        <form onSubmit={handleCreateFeedback} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.feedback.form.customerAlias')}
            <input name="customerAlias" value={form.customerAlias} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.feedback.form.marketplaceItem')}
            <select name="marketplaceItemId" value={form.marketplaceItemId} onChange={updateField} disabled={marketplaceLoading} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950">
              <option value="">{marketplaceLoading ? t('admin.feedback.loadingMarketplace') : t('admin.feedback.form.noMarketplaceSelected')}</option>
              {marketplaceItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.feedback.form.rating')}
            <select name="rating" value={form.rating} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200">
            {t('admin.feedback.form.channel')}
            <select name="purchaseChannel" value={form.purchaseChannel} onChange={updateField} required className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950">
              <option value="zalo">{t('admin.feedback.channel.zalo')}</option>
              <option value="facebook">{t('admin.feedback.channel.facebook')}</option>
              <option value="manual">{t('admin.feedback.channel.manual')}</option>
              <option value="other">{t('admin.feedback.channel.other')}</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.feedback.form.publicComment')}
            <textarea name="comment" value={form.comment} onChange={updateField} required rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder={t('admin.feedback.form.commentPlaceholder')} />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.feedback.form.publicImageUrls')}
            <textarea name="publicImageUrls" value={form.publicImageUrls} onChange={updateField} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder={t('admin.feedback.form.publicImagePlaceholder')} />
            <input type="file" accept="image/*" onChange={(event) => handleUploadImage(event, 'publicImageUrls')} disabled={uploading === 'publicImageUrls'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.feedback.form.evidenceImageUrls')}
            <textarea name="evidenceImageUrls" value={form.evidenceImageUrls} onChange={updateField} rows={2} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder={t('admin.feedback.form.evidenceImagePlaceholder')} />
            <input type="file" accept="image/*" onChange={(event) => handleUploadImage(event, 'evidenceImageUrls')} disabled={uploading === 'evidenceImageUrls'} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-[#4CAF50] file:px-3 file:py-2 file:text-xs file:font-black file:text-white focus:border-[#4CAF50] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="space-y-2 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('admin.feedback.form.evidenceNote')}
            <textarea name="evidenceNote" value={form.evidenceNote} onChange={updateField} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#4CAF50] dark:border-slate-700 dark:bg-slate-950" placeholder={t('admin.feedback.form.evidenceNotePlaceholder')} />
          </label>
          <label className="flex items-start gap-3 text-sm font-black text-slate-700 dark:text-slate-200 md:col-span-2">
            <input type="checkbox" name="isVerified" checked={form.isVerified} onChange={updateField} className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4CAF50]" />
            <span>
              <span className="block">{t('admin.feedback.form.createAsVerified')}</span>
              <span className="mt-1 block text-xs font-bold text-slate-400">{t('admin.feedback.form.createAsVerifiedHint')}</span>
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button type="submit" disabled={saving || Boolean(uploading)} className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#43A047] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? t('admin.feedback.form.saving') : t('admin.feedback.form.create')}
            </button>
            {uploading && <span className="text-xs font-black text-slate-400">{t('admin.feedback.form.uploadingImage')}</span>}
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('admin.feedback.listTitle')}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              {t('admin.feedback.listDescription')}
            </p>
          </div>
          <span className="w-fit rounded-full bg-[#4CAF50]/10 px-3 py-1 text-xs font-black text-[#4CAF50]">
            {t('admin.feedback.records', { count: feedbackItems.length })}
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {feedbackLoading ? (
            <p className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-400 dark:bg-slate-800">{t('admin.feedback.loading')}</p>
          ) : feedbackItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm font-bold text-slate-400 dark:border-slate-700">{t('admin.feedback.emptyTitle')}</p>
          ) : (
            feedbackItems.map((feedback) => {
              const item = getMarketplaceItem(feedback);
              return (
                <article key={feedback.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900 dark:text-white">{feedback.customerAlias || t('admin.feedback.customerFallback')}</p>
                      <p className="mt-1 text-xs font-bold text-yellow-500">{'★'.repeat(feedback.rating || 0)}{'☆'.repeat(Math.max(0, 5 - (feedback.rating || 0)))}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">{t('admin.feedback.channelLabel', { channel: getChannelLabel(t, feedback.purchaseChannel) })}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${feedback.isVerified ? 'bg-[#4CAF50]/10 text-[#4CAF50]' : 'bg-amber-100 text-amber-700'}`}>
                      {feedback.isVerified ? t('status.verified') : t('status.draft')}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{t('admin.feedback.form.marketplaceItem')}</p>
                    <div className="mt-2 flex gap-3">
                      {item?.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-xl object-cover" /> : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">{item?.name || t('admin.feedback.unknownItem')}</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">{item?.category || t('status.unknown')} · {item?.priceText || t('admin.feedback.noPrice')}</p>
                        {feedback.marketplaceItemId && <p className="mt-1 truncate text-[11px] font-bold text-slate-400">ID: {feedback.marketplaceItemId}</p>}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 rounded-2xl bg-white text-sm font-semibold leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {feedback.comment}
                  </p>

                  <div className="mt-4 grid gap-3 text-xs font-bold text-slate-500 sm:grid-cols-2 dark:text-slate-400">
                    <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/40">{t('admin.feedback.meta.created', { value: formatDate(feedback.createdAt, t) })}</p>
                    <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/40">{t('admin.feedback.meta.verified', { value: formatDate(feedback.verifiedAt, t) })}</p>
                    <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/40">{t('admin.feedback.meta.publicImages', { count: feedback.publicImageUrls?.length || 0 })}</p>
                    <p className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/40">{t('admin.feedback.meta.evidenceImages', { count: feedback.evidenceImageUrls?.length || 0 })}</p>
                  </div>

                  {feedback.publicImageUrls?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-black text-slate-500 dark:text-slate-400">{t('admin.feedback.form.publicImageUrls')}</p>
                      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                        {feedback.publicImageUrls.map((url) => (
                          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                            <img src={url} alt={t('admin.feedback.publicImageAlt')} className="h-20 w-20 rounded-xl object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {(feedback.evidenceImageUrls?.length > 0 || feedback.evidenceNote) && (
                    <details className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                      <summary className="cursor-pointer text-xs font-black text-slate-600 dark:text-slate-300">{t('admin.feedback.adminEvidence')}</summary>
                      {feedback.evidenceNote && <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{feedback.evidenceNote}</p>}
                      {feedback.evidenceImageUrls?.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                          {feedback.evidenceImageUrls.map((url) => (
                            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block shrink-0">
                              <img src={url} alt={t('admin.feedback.privateImageAlt')} className="h-20 w-20 rounded-xl object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </details>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleVerifyFeedback(feedback)} disabled={actionId === feedback.id} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300">
                      {feedback.isVerified ? t('admin.feedback.action.unverify') : t('admin.feedback.action.verify')}
                    </button>
                    {feedback.marketplaceItemId && (
                      <a href={`#/plants/${feedback.marketplaceItemId}`} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-[#4CAF50] hover:text-[#4CAF50] dark:border-slate-700 dark:text-slate-300">
                        {t('admin.feedback.action.viewPublicItem')}
                      </a>
                    )}
                    <button type="button" onClick={() => handleDeleteFeedback(feedback)} disabled={actionId === feedback.id} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-950/50 dark:text-red-300">
                      {t('common.delete')}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminFeedback;
