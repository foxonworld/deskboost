import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --------------------
//  Default task data
// --------------------
const DEFAULT_TASKS = [
  {
    id: 1,
    plantName: 'Monstera Deliciosa',
    plantEmoji: '🌿',
    taskType: 'watering',
    taskLabel: 'Tưới nước',
    taskIcon: 'water_drop',
    dueTime: 'Hôm nay, 07:00',
    urgency: 'overdue', // 'overdue' | 'today' | 'upcoming'
    plantPath: '/app/my-plants',
    done: false,
    doneAt: null,
  },
  {
    id: 2,
    plantName: 'Cây xương rồng',
    plantEmoji: '🌵',
    taskType: 'watering',
    taskLabel: 'Tưới nước',
    taskIcon: 'water_drop',
    dueTime: 'Hôm nay, 09:00',
    urgency: 'today',
    plantPath: '/app/my-plants',
    done: false,
    doneAt: null,
  },
  {
    id: 3,
    plantName: 'Pothos',
    plantEmoji: '🍃',
    taskType: 'misting',
    taskLabel: 'Phun sương',
    taskIcon: 'opacity',
    dueTime: 'Hôm nay, 14:00',
    urgency: 'today',
    plantPath: '/app/my-plants',
    done: false,
    doneAt: null,
  },
  {
    id: 4,
    plantName: 'Hoa hồng',
    plantEmoji: '🌹',
    taskType: 'fertilizing',
    taskLabel: 'Bón phân',
    taskIcon: 'eco',
    dueTime: 'Ngày mai, 08:00',
    urgency: 'upcoming',
    plantPath: '/app/my-plants',
    done: false,
    doneAt: null,
  },
  {
    id: 5,
    plantName: 'Snake Plant',
    plantEmoji: '🌱',
    taskType: 'watering',
    taskLabel: 'Tưới nước',
    taskIcon: 'water_drop',
    dueTime: 'Ngày mai, 10:00',
    urgency: 'upcoming',
    plantPath: '/app/my-plants',
    done: false,
    doneAt: null,
  },
];

// --------------------
//  Context
// --------------------
const CareContext = createContext(null);

const STORAGE_KEY = 'deskboost_care_tasks';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults in case new tasks were added
      return DEFAULT_TASKS.map(def => {
        const saved_task = parsed.find(t => t.id === def.id);
        return saved_task ? { ...def, done: saved_task.done, doneAt: saved_task.doneAt } : def;
      });
    }
  } catch {}
  return DEFAULT_TASKS;
};

export const CareProvider = ({ children }) => {
  const [tasks, setTasks] = useState(loadFromStorage);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Mark task as done (quick confirm)
  const markDone = useCallback((taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, done: true, doneAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
          : t
      )
    );
  }, []);

  // Undo done
  const undoDone = useCallback((taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, done: false, doneAt: null } : t
      )
    );
  }, []);

  // Reset all (for dev/testing)
  const resetAll = useCallback(() => {
    const reset = DEFAULT_TASKS.map(t => ({ ...t, done: false, doneAt: null }));
    setTasks(reset);
  }, []);

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);
  const urgentCount = pendingTasks.filter(t => t.urgency === 'overdue' || t.urgency === 'today').length;

  return (
    <CareContext.Provider value={{
      tasks,
      pendingTasks,
      doneTasks,
      urgentCount,
      notificationOpen,
      setNotificationOpen,
      markDone,
      undoDone,
      resetAll,
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
