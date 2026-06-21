import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';

const renderInstallStep = (text) => {
  const parts = String(text).split(/<strong>(.*?)<\/strong>/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <React.Fragment key={index}>{part}</React.Fragment>
  );
};

const AppDownloadButton = ({ variant = 'hero' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const menuRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIOSClick = () => {
    setShowIOSModal(true);
    setIsOpen(false);
  };

  const isHeader = variant === 'header';

  return (
    <>
      <div className={`relative z-50 ${isHeader ? 'inline-block' : 'w-full sm:w-auto'}`} ref={menuRef}>
        {isHeader ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 sm:w-auto items-center justify-center sm:px-3 gap-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-sm"
            aria-label={t('app.download')}
          >
            <span className="material-symbols-outlined text-xl">smartphone</span>
            <span className="hidden sm:inline-block text-sm font-bold">App</span>
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-[15px] font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(76,175,80,0.25)] transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(76,175,80,0.35)] dark:shadow-[0_8px_20px_rgba(76,175,80,0.15)]"
          >
            <span className="material-symbols-outlined text-[22px]">download</span>
            <span>{t('app.download')}</span>
          </button>
        )}

        {isOpen && (
          <div className={`absolute z-50 mt-2 w-48 rounded-xl border border-[#E4EEE6] bg-white p-2 shadow-xl dark:border-[#2A4532] dark:bg-surface-dark ${isHeader ? 'right-0' : 'left-0 sm:left-0 top-full'}`}>
            <div className="flex flex-col gap-1">
              <a
                href="https://github.com/foxonworld/deskboost/releases/download/v1.0.0/DeskBoost.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-main hover:bg-primary/10 hover:text-primary dark:text-white dark:hover:bg-primary/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">android</span>
                {t('app.download.android')}
              </a>
              <button
                onClick={handleIOSClick}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-left text-text-main hover:bg-primary/10 hover:text-primary dark:text-white dark:hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">apple</span>
                {t('app.download.ios')}
              </button>
            </div>
          </div>
        )}
      </div>

      {showIOSModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-surface-dark border border-[#E4EEE6] dark:border-[#2A4532]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-text-main dark:text-white">{t('app.download.ios.install')}</h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-text-secondary hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary dark:text-slate-300">
              {t('app.download.ios.desc')}
            </p>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="mb-2 text-sm font-bold text-text-main dark:text-white">{t('app.download.ios.howTo')}</p>
              <ol className="list-decimal space-y-2 pl-4 text-sm text-text-secondary dark:text-slate-300">
                <li>{renderInstallStep(t('app.download.ios.step1'))}</li>
                <li>{renderInstallStep(t('app.download.ios.step2'))}</li>
                <li>{renderInstallStep(t('app.download.ios.step3'))}</li>
                <li>{renderInstallStep(t('app.download.ios.step4'))}</li>
              </ol>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              {t('app.download.ios.gotIt')}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AppDownloadButton;
