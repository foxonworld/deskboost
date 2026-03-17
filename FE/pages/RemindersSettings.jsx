import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { useCare } from '../context/CareContext';

const urgencyConfig = {
  overdue: {
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-100 dark:border-red-800/30',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    label: 'Trễ hạn',
  },
  today: {
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-100 dark:border-amber-800/30',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    label: 'Hôm nay',
  },
  upcoming: {
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/30',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    label: 'Sắp tới',
  },
};

const taskTypeConfig = {
  watering: { icon: 'water_drop', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  misting: { icon: 'opacity', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  fertilizing: { icon: 'eco', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
};

// Animated check-mark confirmation overlay
const DoneOverlay = ({ task, onUndo }) => (
  <div className="absolute inset-0 rounded-3xl bg-[#4CAF50]/10 dark:bg-[#4CAF50]/20 border border-[#4CAF50]/20 flex items-center justify-between px-6 z-10 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="size-10 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg shadow-[#4CAF50]/30">
        <span className="material-symbols-outlined text-white">check</span>
      </div>
      <div>
        <p className="font-black text-[#4CAF50] text-sm">Đã hoàn thành!</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Xong lúc {task.doneAt}</p>
      </div>
    </div>
    <button
      onClick={onUndo}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:scale-105"
    >
      <span className="material-symbols-outlined text-sm">undo</span>
      Hoàn tác
    </button>
  </div>
);

const RemindersSettings = () => {
  const { tasks, pendingTasks, doneTasks, urgentCount, markDone, undoDone, resetAll } = useCare();
  const [notifSettings, setNotifSettings] = useState({
    watering: true,
    fertilizing: false,
    mist: true,
    care_tips: true,
    marketing: false,
  });
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'done'
  const [savedFeedback, setSavedFeedback] = useState(false);

  const toggleNotif = (key) => setNotifSettings(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'pending') return !t.done;
    if (activeFilter === 'done') return t.done;
    return true;
  });

  const overdueCount = tasks.filter(t => !t.done && t.urgency === 'overdue').length;
  const todayCount = tasks.filter(t => !t.done && t.urgency === 'today').length;
  const upcomingCount = tasks.filter(t => !t.done && t.urgency === 'upcoming').length;

  return (
    <UserLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-16">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Lịch chăm sóc cây</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              Theo dõi và xác nhận tác vụ chăm sóc hàng ngày của bạn.
            </p>
          </div>
          {urgentCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-500">{urgentCount} cần chăm sóc</span>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Trễ hạn', value: overdueCount, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800' },
            { label: 'Hôm nay', value: todayCount, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' },
            { label: 'Sắp tới', value: upcomingCount, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
            { label: 'Hoàn thành', value: doneTasks.length, color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]/5', border: 'border-[#4CAF50]/15' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 ${stat.bg} border ${stat.border} rounded-2xl flex flex-col gap-1`}>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tiến độ hôm nay</span>
            <span className="text-sm font-black text-[#4CAF50]">
              {doneTasks.length}/{tasks.length} hoàn thành
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4CAF50] to-[#81C784] rounded-full transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (doneTasks.length / tasks.length) * 100 : 0}%` }}
            />
          </div>
          {doneTasks.length === tasks.length && tasks.length > 0 && (
            <p className="text-xs text-[#4CAF50] font-bold mt-2 text-center">🎉 Tuyệt vời! Tất cả cây đã được chăm sóc hôm nay!</p>
          )}
        </div>

        {/* Task List */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Section header + filters */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4CAF50]">event_available</span>
              Danh sách tác vụ
            </h2>

            {/* Filter tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 gap-0.5">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'pending', label: 'Chờ xử lý' },
                { key: 'done', label: 'Đã xong' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === f.key
                      ? 'bg-white dark:bg-slate-700 text-[#4CAF50] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {f.label}
                  {f.key === 'pending' && pendingTasks.length > 0 && (
                    <span className="ml-1 px-1 bg-red-500 text-white text-[9px] rounded-full">{pendingTasks.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-5xl mb-3">🌿</div>
                <p className="font-bold text-slate-500">Không có tác vụ nào</p>
              </div>
            )}

            {filteredTasks.map(task => {
              const cfg = urgencyConfig[task.urgency];
              const typeCfg = taskTypeConfig[task.taskType] || taskTypeConfig.watering;

              return (
                <div key={task.id} className="relative">
                  {/* Done overlay */}
                  {task.done && (
                    <DoneOverlay task={task} onUndo={() => undoDone(task.id)} />
                  )}

                  <div className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                    task.done
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-40'
                      : `${cfg.bg} ${cfg.border} border hover:shadow-md`
                  }`}>

                    {/* Big Check Button */}
                    <button
                      onClick={() => task.done ? undoDone(task.id) : markDone(task.id)}
                      className={`flex-shrink-0 size-12 rounded-2xl border-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                        task.done
                          ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/30'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 hover:border-[#4CAF50] hover:text-[#4CAF50]'
                      }`}
                      title={task.done ? 'Hoàn tác' : 'Đánh dấu hoàn thành'}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {task.done ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>

                    {/* Plant Emoji */}
                    <div className={`flex-shrink-0 size-12 ${typeCfg.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                      {task.plantEmoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-black text-slate-800 dark:text-white text-sm ${task.done ? 'line-through' : ''}`}>
                          {task.plantName}
                        </h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className={`flex items-center gap-1 ${typeCfg.color}`}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{typeCfg.icon}</span>
                          <span className="text-xs font-bold">{task.taskLabel}</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-xs text-slate-500 font-medium">{task.dueTime}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!task.done && (
                        <>
                          {/* Quick confirm */}
                          <button
                            onClick={() => markDone(task.id)}
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#4CAF50] text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-105 active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">water_drop</span>
                            Đã tưới!
                          </button>
                          {/* Go to profile */}
                          <Link
                            to={task.plantPath}
                            className="flex items-center justify-center size-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-[#4CAF50] hover:border-[#4CAF50]/40 transition-all"
                            title="Xem hồ sơ cây"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Schedule Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-base font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-[#4CAF50]">notifications_active</span>
              Cài đặt thông báo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Chọn loại nhắc nhở bạn muốn nhận</p>
          </div>
          <div className="p-6 space-y-6">
            {[
              { id: 'watering', name: 'Nhắc nhở tưới nước', desc: 'Thông báo khi đến giờ tưới cây theo lịch.', icon: 'water_drop', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
              { id: 'fertilizing', name: 'Lịch bón phân', desc: 'Nhắc bổ sung dinh dưỡng 2 tuần / 1 tháng một lần.', icon: 'eco', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
              { id: 'mist', name: 'Phun sương & độ ẩm', desc: 'Nhắc nhở hàng ngày để giữ ẩm cho cây nhiệt đới.', icon: 'opacity', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
              { id: 'care_tips', name: 'Mẹo chăm sóc từ AI', desc: 'Nhận gợi ý chăm sóc được cá nhân hóa từ AI.', icon: 'auto_awesome', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className={`size-11 ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotif(item.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifSettings[item.id] ? 'bg-[#4CAF50]' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifSettings[item.id] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={resetAll}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reset tất cả tác vụ
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Hủy
            </button>
            <button
              onClick={handleSave}
              className={`px-8 py-3 rounded-xl font-black text-sm shadow-lg transition-all ${
                savedFeedback
                  ? 'bg-green-500 text-white shadow-green-200 scale-95'
                  : 'bg-[#4CAF50] text-white shadow-[#4CAF50]/20 hover:scale-105 active:scale-95'
              }`}
            >
              {savedFeedback ? '✓ Đã lưu!' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default RemindersSettings;
