import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getReminderTypeLabel, getReminders, markReminderDone } from '../services/reminderApi';

const CareContext = createContext(null);

const taskIconMap = {
  watering: 'water_drop',
  fertilizing: 'eco',
  check_leaves: 'psychiatry',
};

const todayKey = () => new Date().toISOString().slice(0, 10);

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
  urgency: toUrgency(reminder),
  plantPath: reminder.plantId ? `/app/my-plants/${reminder.plantId}` : '/app/my-plants',
  done: reminder.completed,
  doneAt: toDoneTime(reminder.completedAt),
});

export const CareProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const refreshTasks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

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

  const pendingTasks = tasks.filter((task) => !task.done);
  const doneTasks = tasks.filter((task) => task.done);
  const urgentCount = pendingTasks.filter((task) => task.urgency === 'overdue' || task.urgency === 'today').length;

  return (
    <CareContext.Provider value={{
      tasks,
      pendingTasks,
      doneTasks,
      urgentCount,
      loading,
      error,
      notificationOpen,
      setNotificationOpen,
      markDone,
      undoDone,
      resetAll,
      refreshTasks,
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
