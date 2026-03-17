import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCare } from '../context/CareContext';

const urgencyConfig = {
  overdue: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500', label: 'Trễ hạn' },
  today: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-500', label: 'Hôm nay' },
  upcoming: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-400', label: 'Sắp tới' },
};

const CareNotificationBell = () => {
  const { pendingTasks, doneTasks, urgentCount, notificationOpen, setNotificationOpen, markDone, undoDone } = useCare();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!notificationOpen) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notificationOpen, setNotificationOpen]);

  const totalPending = pendingTasks.length;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setNotificationOpen(o => !o)}
        className={`relative flex items-center justify-center size-10 rounded-xl transition-all border ${
          notificationOpen
            ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-[#4CAF50]/40 hover:text-[#4CAF50] hover:bg-[#4CAF50]/5'
        }`}
        title="Lịch chăm sóc cây"
      >
        <span className={`material-symbols-outlined text-lg transition-all ${urgentCount > 0 ? 'animate-[wiggle_2s_ease-in-out_infinite]' : ''}`}>
          {urgentCount > 0 ? 'notifications_active' : 'notifications'}
        </span>
        {totalPending > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
            {totalPending > 9 ? '9+' : totalPending}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {notificationOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-3 w-[360px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-[200] overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease' }}
        >
          {/* Panel Header */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Lịch chăm sóc cây</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalPending > 0 ? `${totalPending} tác vụ chờ xử lý` : 'Tất cả đã hoàn thành! 🎉'}
              </p>
            </div>
            <Link
              to="/app/settings"
              onClick={() => setNotificationOpen(false)}
              className="text-xs font-bold text-[#4CAF50] hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Task List */}
          <div className="max-h-[380px] overflow-y-auto">
            {totalPending === 0 && doneTasks.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🌿</div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Không có tác vụ nào</p>
              </div>
            )}

            {/* Pending tasks */}
            {pendingTasks.length > 0 && (
              <div className="p-3 space-y-2">
                {pendingTasks.map(task => {
                  const cfg = urgencyConfig[task.urgency];
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${cfg.bg} border-transparent`}
                    >
                      {/* Plant emoji + icon */}
                      <div className="flex-shrink-0 size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-lg">
                        {task.plantEmoji}
                      </div>

                      {/* Info */}
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
                          <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        {/* Quick confirm */}
                        <button
                          onClick={() => markDone(task.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#4CAF50] text-white text-[11px] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#4CAF50]/30"
                          title="Xác nhận đã hoàn thành"
                        >
                          <span className="material-symbols-outlined text-xs" style={{ fontSize: '13px' }}>check</span>
                          Xong
                        </button>
                        {/* Go to profile */}
                        <Link
                          to={task.plantPath}
                          onClick={() => setNotificationOpen(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl hover:border-[#4CAF50]/40 hover:text-[#4CAF50] transition-all"
                          title="Xem hồ sơ cây"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>open_in_new</span>
                          Hồ sơ
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Done tasks (collapsed) */}
            {doneTasks.length > 0 && (
              <div className="px-3 pb-3">
                {pendingTasks.length > 0 && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã xong</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  </div>
                )}
                <div className="space-y-1.5">
                  {doneTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 opacity-70">
                      <div className="flex-shrink-0 size-8 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center text-base">
                        {task.plantEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-through truncate">{task.plantName}</p>
                        <p className="text-[10px] text-slate-400">{task.taskLabel} · {task.doneAt ? `Đã xong ${task.doneAt}` : 'Hoàn thành'}</p>
                      </div>
                      <span className="size-5 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '12px' }}>check</span>
                      </span>
                      <button
                        onClick={() => undoDone(task.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                        title="Hoàn tác"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>undo</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-[10px] text-slate-400 font-medium">
              ✅ {doneTasks.length}/{doneTasks.length + pendingTasks.length} hoàn thành hôm nay
            </p>
            <Link
              to="/app/settings"
              onClick={() => setNotificationOpen(false)}
              className="text-[11px] font-bold text-[#4CAF50] flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>settings</span>
              Quản lý lịch
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
