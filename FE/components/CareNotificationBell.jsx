import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCare } from '../context/CareContext';
import { useI18n } from '../i18n';

const urgencyConfig = {
  overdue: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500', labelKey: 'careBell.urgency.overdue' },
  today: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500', labelKey: 'careBell.urgency.today' },
  upcoming: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-400', labelKey: 'careBell.urgency.upcoming' },
};

const notifTypeConfig = {
  promo: { icon: 'local_offer', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  care_tip: { icon: 'eco', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  announcement: { icon: 'campaign', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

const timeAgo = (isoString, t) => {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('careBell.timeAgo.justNow');
  if (mins < 60) return t('careBell.timeAgo.minutesAgo', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('careBell.timeAgo.hoursAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return t('careBell.timeAgo.daysAgo', { count: days });
};

const CareNotificationBell = () => {
  const { t } = useI18n();
  const {
    pendingTasks, upcomingTasks, doneTasks, doneTodayCount, todayTotalCount, urgentCount, loading, error, notificationOpen, setNotificationOpen, markDone, undoDone,
    adminNotifs, unreadAdminCount, notifsLoading, markAdminRead, markAllAdminRead,
  } = useCare();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!notificationOpen) return;
    const handler = (event) => {
      if (
        panelRef.current && !panelRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notificationOpen, setNotificationOpen]);

  const totalPending = pendingTasks.length;
  const totalBadge = urgentCount + unreadAdminCount;

  const handleMarkDone = async (taskId) => {
    try {
      await markDone(taskId);
    } catch {
      // CareContext owns error state
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setNotificationOpen((open) => !open)}
        className={`relative flex items-center justify-center size-10 rounded-xl transition-all border ${
          notificationOpen
            ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-[#4CAF50]/40 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5'
        }`}
        title={t('careBell.title')}
      >
        <span className={`material-symbols-outlined text-lg transition-all ${(urgentCount > 0 || unreadAdminCount > 0) ? 'animate-[wiggle_2s_ease-in-out_infinite]' : ''}`}>
          {(urgentCount > 0 || unreadAdminCount > 0) ? 'notifications_active' : 'notifications'}
        </span>
        {totalBadge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
            {totalBadge > 9 ? '9+' : totalBadge}
          </span>
        )}
      </button>

      {notificationOpen && (
        <div
          ref={panelRef}
          className="fixed left-4 right-4 top-[72px] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-[200] overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease' }}
        >
          {/* ── Header ── */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">{t('careBell.title')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalPending > 0 ? t('careBell.pending', { count: totalPending }) : t('careBell.allDone')}
              </p>
            </div>
            <Link
              to="/app/settings"
              onClick={() => setNotificationOpen(false)}
              className="text-xs font-bold text-[#4CAF50] hover:underline"
            >
              {t('careBell.viewAll')}
            </Link>
          </div>

          <div className="max-h-[calc(100vh-180px)] sm:max-h-[440px] overflow-y-auto">

            {/* ── Section: Thông báo từ DeskBoost ── */}
            {(adminNotifs.length > 0 || notifsLoading) && (
              <div className="px-3 pt-3">
                <div className="flex items-center justify-between px-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#4CAF50]" style={{ fontSize: '14px' }}>campaign</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('careBell.adminSection')}</span>
                    {unreadAdminCount > 0 && (
                      <span className="min-w-[16px] h-[16px] px-1 bg-[#4CAF50] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {unreadAdminCount}
                      </span>
                    )}
                  </div>
                  {unreadAdminCount > 0 && (
                    <button
                      onClick={markAllAdminRead}
                      className="text-[10px] font-bold text-[#4CAF50] hover:underline"
                    >
                      {t('careBell.markAllRead')}
                    </button>
                  )}
                </div>

                {notifsLoading ? (
                  <div className="flex items-center gap-2 p-3 text-xs text-slate-400">
                    <span className="material-symbols-outlined text-[#4CAF50] animate-spin" style={{ fontSize: '14px' }}>progress_activity</span>
                    {t('careBell.loadingAdmin')}
                  </div>
                ) : (
                  <div className="space-y-1.5 pb-2">
                    {adminNotifs.slice(0, 5).map((notif) => {
                      const cfg = notifTypeConfig[notif.type] || notifTypeConfig.announcement;
                      return (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => !notif.isRead && markAdminRead(notif.id)}
                          className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                            notif.isRead
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-70'
                              : `${cfg.bg} border-transparent`
                          }`}
                        >
                          <div className={`flex-shrink-0 size-8 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm`}>
                            <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontSize: '16px' }}>{cfg.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-bold truncate ${notif.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4CAF50] mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{timeAgo(notif.createdAt, t)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Divider trước care tasks */}
                <div className="flex items-center gap-2 mt-1 mb-2 px-1">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('careBell.careSection')}</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            )}

            {/* ── Section: Nhắc nhở chăm cây ── */}
            {loading && (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-[#4CAF50] animate-spin mb-3">progress_activity</span>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t('careBell.loading')}</p>
              </div>
            )}

            {!loading && error && (
              <div className="m-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600 dark:border-red-900/40 dark:bg-red-900/20">
                {error}
              </div>
            )}

            {!loading && totalPending === 0 && upcomingTasks.length === 0 && doneTasks.length === 0 && !error && adminNotifs.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{t('careBell.empty')}</p>
              </div>
            )}

            {!loading && totalPending === 0 && upcomingTasks.length === 0 && doneTasks.length === 0 && !error && adminNotifs.length > 0 && (
              <div className="px-5 py-3 text-center">
                <p className="text-xs font-bold text-slate-400">{t('careBell.allDone')}</p>
              </div>
            )}

            {!loading && pendingTasks.length > 0 && (
              <div className="p-3 space-y-2">
                {pendingTasks.map((task) => {
                  const cfg = urgencyConfig[task.urgency] || urgencyConfig.upcoming;
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${cfg.bg} border-transparent`}
                    >
                      <div className="flex-shrink-0 size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-lg">
                        {task.plantEmoji || '🌿'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{task.plantName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`material-symbols-outlined text-xs ${cfg.color}`} style={{ fontSize: '13px' }}>
                            {task.taskIcon}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{task.taskLabel} · {task.dueTime}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                          <span className={`text-[10px] font-bold ${cfg.color}`}>{t(cfg.labelKey)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#4CAF50] text-white text-[11px] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#4CAF50]/30"
                          title={t('careBell.confirmDone')}
                        >
                          <span className="material-symbols-outlined text-xs" style={{ fontSize: '13px' }}>check</span>
                          {t('careBell.doneTodayButton')}
                        </button>
                        <Link
                          to={task.plantPath}
                          onClick={() => setNotificationOpen(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl hover:border-[#4CAF50]/40 hover:text-[#4CAF50] transition-all"
                          title={t('careBell.viewProfile')}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                          {t('careBell.profile')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && upcomingTasks.length > 0 && (
              <div className="px-3 pb-3">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('careBell.upcomingSection')}</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="space-y-1.5">
                  {upcomingTasks.slice(0, 3).map((task) => {
                    const cfg = urgencyConfig.upcoming;
                    return (
                      <div key={task.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${cfg.bg} border-transparent opacity-90`}>
                        <div className="flex-shrink-0 size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-lg">
                          {task.plantEmoji || '🌿'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{task.plantName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`material-symbols-outlined text-xs ${cfg.color}`} style={{ fontSize: '13px' }}>
                              {task.taskIcon}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{task.taskLabel} · {task.dueTime}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                            <span className={`text-[10px] font-bold ${cfg.color}`}>{t(cfg.labelKey)}</span>
                          </div>
                        </div>
                        <Link
                          to={task.plantPath}
                          onClick={() => setNotificationOpen(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl hover:border-[#4CAF50]/40 hover:text-[#4CAF50] transition-all"
                          title={t('careBell.viewProfile')}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                          {t('careBell.profile')}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!loading && doneTasks.length > 0 && (
              <div className="px-3 pb-3">
                {(pendingTasks.length > 0 || upcomingTasks.length > 0) && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('careBell.doneSection')}</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  </div>
                )}
                <div className="space-y-1.5">
                  {doneTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 opacity-70">
                      <div className="flex-shrink-0 size-8 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center text-base">
                        {task.plantEmoji || '🌿'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-through truncate">{task.plantName}</p>
                        <p className="text-[10px] text-slate-400">{task.taskLabel} · {task.doneAt ? t('careBell.doneAt', { time: task.doneAt }) : t('careBell.completed')}</p>
                      </div>
                      <span className="size-5 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '12px' }}>check</span>
                      </span>
                      <button
                        onClick={() => undoDone(task.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                        title={t('careBell.undo')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>undo</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-[10px] text-slate-400 font-medium">
              {t('careBell.footer', { done: doneTodayCount, total: todayTotalCount })}
            </p>
            <Link
              to="/app/settings"
              onClick={() => setNotificationOpen(false)}
              className="text-[11px] font-bold text-[#4CAF50] flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>settings</span>
              {t('careBell.manage')}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-12deg); }
          20% { transform: rotate(12deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(8deg); }
          50% { transform: rotate(0deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CareNotificationBell;
