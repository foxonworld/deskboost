import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { EmptyState, LoadingState, StateNotice } from '../components/UiState';
import { useCare } from '../context/CareContext';
import { useI18n } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { getMyPlants } from '../services/plantApi';

const normalizeItems = (res) => (Array.isArray(res) ? res : res?.items || res?.data || []);

const Dashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { pendingTasks, loading: tasksLoading, error: tasksError, markDone } = useCare();
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [plantsError, setPlantsError] = useState('');
  const [markingTaskId, setMarkingTaskId] = useState(null);

  useEffect(() => {
    let alive = true;
    const loadPlants = async () => {
      setPlantsLoading(true);
      setPlantsError('');
      try {
        const res = await getMyPlants();
        if (alive) setPlants(normalizeItems(res));
      } catch (err) {
        if (alive) {
          setPlants([]);
          setPlantsError(err?.message || 'Could not load plants from backend.');
        }
      } finally {
        if (alive) setPlantsLoading(false);
      }
    };

    loadPlants();
    return () => { alive = false; };
  }, []);

  const todayTasks = useMemo(
    () => pendingTasks.filter((task) => task.urgency === 'overdue' || task.urgency === 'today'),
    [pendingTasks],
  );

  const nextTasks = todayTasks.slice(0, 3);
  const isLoading = plantsLoading || tasksLoading;

  const handleMarkDone = async (taskId) => {
    setMarkingTaskId(taskId);
    try {
      await markDone(taskId);
    } finally {
      setMarkingTaskId(null);
    }
  };

  const glassCardClass = "bg-white/80 dark:bg-[#111813]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]";

  return (
    <UserLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">
              {t('dashboard.greeting', { name: user?.name || 'Sarah' })}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">{t('dashboard.subtitle')}</p>
          </div>
          <div className="relative w-full md:w-72 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">search</span>
            <input type="text" placeholder={t('dashboard.search')} className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm outline-none transition-all font-semibold placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 ${glassCardClass}`} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-[2rem] flex flex-col gap-1 hover:-translate-y-1 transition-transform duration-300 ${glassCardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{t('dashboard.totalPlants')}</span>
              <span className="material-symbols-outlined text-[#4CAF50] bg-[#4CAF50]/10 p-3 rounded-2xl shadow-sm">potted_plant</span>
            </div>
            <p className="text-5xl font-black dark:text-white text-slate-900 tracking-tight">{plantsLoading ? '...' : plants.length}</p>
            <p className="text-xs text-[#4CAF50] font-bold mt-2">Dữ liệu từ backend</p>
          </div>
          <div className={`p-6 rounded-[2rem] flex flex-col gap-1 hover:-translate-y-1 transition-transform duration-300 ${glassCardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Nhắc hôm nay</span>
              <span className="material-symbols-outlined text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-3 rounded-2xl shadow-sm">local_fire_department</span>
            </div>
            <p className="text-5xl font-black dark:text-white text-slate-900 tracking-tight">{tasksLoading ? '...' : todayTasks.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-wider">Từ reminders thật</p>
          </div>
          <div className={`p-6 rounded-[2rem] flex flex-col gap-1 hover:-translate-y-1 transition-transform duration-300 ${glassCardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Backend</span>
              <span className="material-symbols-outlined text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-3 rounded-2xl shadow-sm">auto_awesome</span>
            </div>
            <p className="text-5xl font-black dark:text-white text-slate-900 tracking-tight">{tasksLoading || plantsLoading ? '...' : tasksError || plantsError ? 'Check' : 'Live'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-wider">Không dùng mock</p>
          </div>
        </div>

        {(plantsError || tasksError) && (
          <StateNotice tone="warning">{plantsError || tasksError}</StateNotice>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">{t('dashboard.protocol')}</h2>
              <button className="text-xs font-black text-[#4CAF50] hover:text-[#388E3C] uppercase tracking-widest transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> {t('dashboard.calendar')}</button>
            </div>
            {isLoading ? (
              <LoadingState message={t('common.loading')} />
            ) : nextTasks.length === 0 ? (
              <EmptyState title="Không có nhắc hôm nay" description="Backend reminders chưa trả về việc quá hạn hoặc cần làm hôm nay." icon="check_circle" />
            ) : (
              <div className="space-y-4">
                {nextTasks.map((task) => (
                <div key={task.id} className={`flex items-center gap-5 p-5 rounded-[2rem] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer group ${glassCardClass}`}>
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" disabled={markingTaskId === task.id} onChange={() => handleMarkDone(task.id)} className="w-6 h-6 rounded-xl border-slate-200 dark:border-slate-700 text-[#4CAF50] focus:ring-[#4CAF50] cursor-pointer bg-slate-50 dark:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" />
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#4CAF50] transition-colors text-lg">{task.taskLabel}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{task.plantName} &bull; {task.dueTime}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-400 group-hover:bg-[#4CAF50] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#4CAF50]/30 rounded-2xl transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">{task.taskIcon}</span>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black px-2 dark:text-white text-slate-900 tracking-tight">{t('dashboard.quickActions')}</h2>
            <Link to="/app/ai-analysis" className="relative overflow-hidden w-full bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white p-8 rounded-[2rem] shadow-xl shadow-[#4CAF50]/20 font-black text-xl flex flex-col items-center justify-center gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              <span className="material-symbols-outlined text-5xl drop-shadow-md">photo_camera</span>
              <span className="drop-shadow-sm">{t('dashboard.aiScan')}</span>
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/app/my-plants" className={`p-6 rounded-[2rem] text-center flex flex-col items-center gap-4 hover:-translate-y-1 hover:border-[#4CAF50]/30 transition-all duration-300 group ${glassCardClass}`}>
                <div className="p-4 bg-[#F0FDF4] dark:bg-[#4CAF50]/10 rounded-2xl text-[#2E7D32] dark:text-[#A5D6A7] group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-3xl">psychiatry</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('dashboard.jungle')}</span>
              </Link>
              <Link to="/app/settings" className={`p-6 rounded-[2rem] text-center flex flex-col items-center gap-4 hover:-translate-y-1 transition-all duration-300 group ${glassCardClass}`}>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-3xl">settings</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('dashboard.setup')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
