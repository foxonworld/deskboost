import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getReminderTypeLabel, getReminders, markReminderDone } from '../services/reminderApi';
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationApi';
import { useAuth } from '../hooks/useAuth';

const CareContext = createContext(null);

const taskIconMap = {
  watering: 'water_drop',
  fertilizing: 'eco',
  check_leaves: 'psychiatry',
};

const toDateKey = (date = new Date()) => {
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayKey = () => toDateKey();

const toUrgency = (reminder) => {
  if (reminder.dueDate < todayKey()) return 'overdue';
  if (reminder.dueDate === todayKey()) return 'today';
  return 'upcoming';
};

const toDoneTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const reminderToTask = (reminder) => ({
  id: reminder.id,
  plantName: reminder.plantName,
  plantEmoji: reminder.plantEmoji,
  taskType: reminder.type,
  taskLabel: reminder.title || getReminderTypeLabel(reminder.type),
  taskIcon: taskIconMap[reminder.type] || 'notifications_active',
  dueTime: `${reminder.dueDate}, ${reminder.time}`,
  dueDate: reminder.dueDate,
  urgency: toUrgency(reminder),
  plantPath: reminder.plantId ? `/app/my-plants/${reminder.plantId}` : '/app/my-plants',
  done: reminder.completed,
  doneAt: toDoneTime(reminder.completedAt),
  doneDate: reminder.completedAt ? toDateKey(new Date(reminder.completedAt)) : null,
});

export const CareProvider = ({ children }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // ── Admin notifications state ────────────────────────────────────────────────
  const [adminNotifs, setAdminNotifs] = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);

  const refreshTasks = useCallback(async () => {
    if (isBootstrapping) return;
    if (!isAuthenticated) {
      setTasks([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const reminders = await getReminders();
      setTasks(reminders.map(reminderToTask));
    } catch (err) {
      setTasks([]);
      setError(err?.message || 'Could not load care reminders.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isBootstrapping]);

  const refreshAdminNotifs = useCallback(async () => {
    if (isBootstrapping || !isAuthenticated) {
      setAdminNotifs([]);
      return;
    }
    setNotifsLoading(true);
    try {
      const items = await getUserNotifications();
      setAdminNotifs(items);
    } catch {
      setAdminNotifs([]);
    } finally {
      setNotifsLoading(false);
    }
  }, [isAuthenticated, isBootstrapping]);

  useEffect(() => {
    Promise.allSettled([refreshTasks(), refreshAdminNotifs()]);
  }, [refreshTasks, refreshAdminNotifs]);

  const markDone = useCallback(async (taskId) => {
    const updated = await markReminderDone(taskId);
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? reminderToTask(updated) : task)),
    );
  }, []);

  const undoDone = useCallback(() => {
    setError('Completed reminders cannot be undone from the notification bell yet.');
  }, []);

  const resetAll = useCallback(() => {
    refreshTasks();
  }, [refreshTasks]);

  const markAdminRead = useCallback(async (id) => {
    await markNotificationRead(id);
    setAdminNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAdminRead = useCallback(async () => {
    const ids = adminNotifs.filter((n) => !n.isRead).map((n) => n.id);
    if (ids.length === 0) return;
    await markAllNotificationsRead(ids);
    setAdminNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [adminNotifs]);

  const pendingTasks = tasks.filter((task) => !task.done && (task.urgency === 'overdue' || task.urgency === 'today'));
  const upcomingTasks = tasks.filter((task) => !task.done && task.urgency === 'upcoming');
  const doneTasks = tasks.filter((task) => task.done);
  const doneTodayCount = tasks.filter((task) => task.doneDate === todayKey()).length;
  const todayTotalCount = doneTodayCount + pendingTasks.filter((task) => task.urgency === 'today' || task.urgency === 'overdue').length;
  const urgentCount = pendingTasks.length;
  const unreadAdminCount = adminNotifs.filter((n) => !n.isRead).length;

  return (
    <CareContext.Provider value={{
      tasks,
      pendingTasks,
      upcomingTasks,
      doneTasks,
      doneTodayCount,
      todayTotalCount,
      urgentCount,
      loading,
      error,
      notificationOpen,
      setNotificationOpen,
      markDone,
      undoDone,
      resetAll,
      refreshTasks,
      adminNotifs,
      unreadAdminCount,
      notifsLoading,
      markAdminRead,
      markAllAdminRead,
      refreshAdminNotifs,
    }}>
      {children}
    </CareContext.Provider>
  );
};

export const useCare = () => {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error('useCare must be used within CareProvider');
  return ctx;
};
