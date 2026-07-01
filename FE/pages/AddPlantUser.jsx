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
      setError(t('addPlant.claim.error.codeRequired'));
      return;
    }
    setIsPreviewingClaim(true);
    try {
      const data = await getClaimPreview(code);
      setClaimPreview(data);
      const itemName = data?.marketplaceItem?.name || '';
      if (itemName && !claimNickname) setClaimNickname(itemName);
      setSuccess(t('addPlant.claim.previewSuccess'));
    } catch (err) {
      setError(err?.message || t('addPlant.claim.error.previewFailed'));
    } finally {
      setIsPreviewingClaim(false);
    }
  };

  const handleClaimPlant = async () => {
    setError('');
    setSuccess('');
    const code = claimCode.trim().toUpperCase();
    if (!code || !claimPreview?.valid) {
      setError(t('addPlant.claim.error.validPreviewRequired'));
      return;
    }
    setIsClaiming(true);
    try {
      await claimMyPlant({
        code,
        nickname: claimNickname.trim() || undefined,
        location: claimLocation.trim() || undefined,
      });
      setSuccess(t('addPlant.claim.success'));
      setTimeout(() => navigate('/app/my-plants'), 700);
    } catch (err) {
      setError(err?.message || t('addPlant.claim.error.claimFailed'));
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/60 dark:bg-[#111813]/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 mb-6">
            <span className="material-symbols-outlined text-3xl text-[#4CAF50]" aria-hidden="true">vpn_key</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('addPlant.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium text-sm sm:text-base">{t('addPlant.description')}</p>
        </div>

        <section className="rounded-[32px] bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#4CAF50]/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('addPlant.claim.title')}</h2>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              {t('addPlant.claim.description')}
            </p>
            
            {error && <div className="mt-6"><StateNotice tone="error">{error}</StateNotice></div>}
            {success && <div className="mt-6"><StateNotice tone="success">{success}</StateNotice></div>}
            
            <form onSubmit={handlePreviewClaim} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <input 
                value={claimCode} 
                onChange={(event) => setClaimCode(event.target.value.toUpperCase())} 
                placeholder="DB-ABCD-1234" 
                className="h-14 rounded-2xl border border-white/60 bg-white/50 px-5 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:bg-[#1A231C]" 
              />
              <button 
                type="submit" 
                disabled={isPreviewingClaim || isClaiming} 
                className="h-14 rounded-2xl bg-[#4CAF50] px-8 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60 disabled:hover:scale-100"
              >
                {isPreviewingClaim ? t('addPlant.claim.loadingPreview') : t('addPlant.claim.preview')}
              </button>
            </form>

            {claimPreview?.valid && claimPreview.marketplaceItem && (
              <div className="mt-8 grid gap-6 rounded-[28px] border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30 md:grid-cols-[180px_1fr]">
                {claimPreview.marketplaceItem.imageUrl ? (
                  <img src={claimPreview.marketplaceItem.imageUrl} alt={claimPreview.marketplaceItem.name} className="h-48 w-full rounded-[20px] object-cover shadow-sm" />
                ) : (
                  <div className="grid h-48 w-full place-items-center rounded-[20px] bg-white/50 text-[#4CAF50] dark:bg-black/40">
                    <span className="material-symbols-outlined text-6xl opacity-50">potted_plant</span>
                  </div>
                )}
                
                <div className="flex flex-col justify-center space-y-5">
                  <div>
                    <p className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#4CAF50]">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {t('addPlant.claim.previewTitle')}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{claimPreview.marketplaceItem.name}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">{claimPreview.marketplaceItem.description || t('addPlant.claim.noDescription')}</p>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input 
                      value={claimNickname} 
                      onChange={(event) => setClaimNickname(event.target.value)} 
                      placeholder={t('addPlant.claim.nicknamePlaceholder')} 
                      className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 px-4 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/40 dark:text-white dark:focus:bg-[#1A231C]" 
                    />
                    <input 
                      value={claimLocation} 
                      onChange={(event) => setClaimLocation(event.target.value)} 
                      placeholder={t('addPlant.claim.locationPlaceholder')} 
                      className="h-12 w-full rounded-2xl border border-white/60 bg-white/60 px-4 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#4CAF50]/10 dark:border-white/10 dark:bg-black/40 dark:text-white dark:focus:bg-[#1A231C]" 
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={handleClaimPlant} 
                    disabled={isClaiming || isPreviewingClaim} 
                    className="h-14 w-full rounded-2xl bg-slate-900 px-6 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-slate-900 dark:shadow-white/10 sm:w-auto sm:self-start"
                  >
                    {isClaiming ? t('addPlant.claim.claiming') : t('addPlant.claim.confirm')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default AddPlantUser;
