import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { claimMyPlant, getClaimPreview } from '../services/plantApi';
import { StateNotice } from '../components/UiState';
import { useI18n } from '../i18n';

const AddPlantUser = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [claimPreview, setClaimPreview] = useState(null);
  const [claimNickname, setClaimNickname] = useState('');
  const [claimLocation, setClaimLocation] = useState('');
  const [isPreviewingClaim, setIsPreviewingClaim] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { t } = useI18n();

  const handlePreviewClaim = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setClaimPreview(null);
    const code = claimCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a plant claim code.');
      return;
    }
    setIsPreviewingClaim(true);
    try {
      const data = await getClaimPreview(code);
      setClaimPreview(data);
      const itemName = data?.marketplaceItem?.name || '';
      if (itemName && !claimNickname) setClaimNickname(itemName);
      setSuccess('Code is valid. Confirm to add this plant to your account.');
    } catch (err) {
      setError(err?.message || 'Could not preview this claim code.');
    } finally {
      setIsPreviewingClaim(false);
    }
  };

  const handleClaimPlant = async () => {
    setError('');
    setSuccess('');
    const code = claimCode.trim().toUpperCase();
    if (!code || !claimPreview?.valid) {
      setError('Please preview a valid claim code first.');
      return;
    }
    setIsClaiming(true);
    try {
      await claimMyPlant({
        code,
        nickname: claimNickname.trim() || undefined,
        location: claimLocation.trim() || undefined,
      });
      setSuccess('Plant claimed successfully.');
      setTimeout(() => navigate('/app/my-plants'), 700);
    } catch (err) {
      setError(err?.message || 'Could not claim this plant.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('addPlant.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('addPlant.description')}</p>
        </div>

        <section className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="material-symbols-outlined text-6xl text-[#4CAF50]" aria-hidden="true">vpn_key</span>
          <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">Add by plant code</h2>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-slate-500 dark:text-slate-400">
            Enter the code provided after purchase. DeskBoost will preview the plant before adding it to your account.
          </p>
          {error && <div className="mt-5"><StateNotice tone="error">{error}</StateNotice></div>}
          {success && <div className="mt-5"><StateNotice tone="success">{success}</StateNotice></div>}
          <form onSubmit={handlePreviewClaim} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input value={claimCode} onChange={(event) => setClaimCode(event.target.value.toUpperCase())} placeholder="DB-ABCD-1234" className="h-14 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-slate-800 dark:bg-slate-800 dark:text-white" />
            <button type="submit" disabled={isPreviewingClaim || isClaiming} className="h-14 rounded-2xl bg-[#4CAF50] px-6 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isPreviewingClaim ? 'Checking...' : 'Preview'}
            </button>
          </form>
          {claimPreview?.valid && claimPreview.marketplaceItem && (
            <div className="mt-6 grid gap-5 rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40 md:grid-cols-[160px_1fr]">
              {claimPreview.marketplaceItem.imageUrl ? (
                <img src={claimPreview.marketplaceItem.imageUrl} alt={claimPreview.marketplaceItem.name} className="h-40 w-full rounded-2xl object-cover" />
              ) : (
                <div className="grid h-40 place-items-center rounded-2xl bg-white text-[#4CAF50] dark:bg-slate-900">
                  <span className="material-symbols-outlined text-6xl">potted_plant</span>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#4CAF50]">Claim preview</p>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{claimPreview.marketplaceItem.name}</h3>
                  <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">{claimPreview.marketplaceItem.description || 'No description.'}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={claimNickname} onChange={(event) => setClaimNickname(event.target.value)} placeholder="Nickname" className="h-12 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-slate-800 dark:bg-slate-900" />
                  <input value={claimLocation} onChange={(event) => setClaimLocation(event.target.value)} placeholder="Location" className="h-12 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-slate-800 dark:bg-slate-900" />
                </div>
                <button type="button" onClick={handleClaimPlant} disabled={isClaiming || isPreviewingClaim} className="h-12 rounded-2xl bg-[#4CAF50] px-5 text-xs font-black uppercase tracking-widest text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                  {isClaiming ? 'Claiming...' : 'Confirm claim'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </UserLayout>
  );
};

export default AddPlantUser;
