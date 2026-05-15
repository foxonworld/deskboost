import { get, post, put, del } from "./api";

const USE_MOCK_REMINDERS = import.meta.env.VITE_USE_MOCK_REMINDERS !== "false";
const STORAGE_KEY = "deskboost_reminders_mvp";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();

const typeLabels = {
  watering: "watering",
  fertilizing: "fertilizing",
  check_leaves: "check leaves",
};

const defaultReminders = [
  {
    id: "rem_mock_001",
    plantId: "plant_monstera",
    plantName: "Monstera Deliciosa",
    plantEmoji: "🌿",
    type: "watering",
    frequency: "daily",
    time: "07:00",
    enabled: true,
    dueDate: new Date().toISOString().slice(0, 10),
    completed: false,
    completedAt: null,
    source: "mock-fallback",
  },
  {
    id: "rem_mock_002",
    plantId: "plant_rose",
    plantName: "Hoa hồng",
    plantEmoji: "🌹",
    type: "fertilizing",
    frequency: "weekly",
    time: "08:00",
    enabled: true,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    completed: false,
    completedAt: null,
    source: "mock-fallback",
  },
  {
    id: "rem_mock_003",
    plantId: "plant_pothos",
    plantName: "Pothos",
    plantEmoji: "🍃",
    type: "check_leaves",
    frequency: "weekly",
    time: "18:00",
    enabled: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    completed: false,
    completedAt: null,
    source: "mock-fallback",
  },
];

const loadMockReminders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultReminders;
  } catch {
    return defaultReminders;
  }
};

const saveMockReminders = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
};

const withMockFallback = async (requestFn, fallbackFn) => {
  if (USE_MOCK_REMINDERS) {
    await delay();
    return fallbackFn();
  }

  try {
    return await requestFn();
  } catch {
    await delay();
    return fallbackFn();
  }
};

export const getReminderTypeLabel = (type) =>
  typeLabels[type] || type || "watering";

export const normalizeReminder = (reminder = {}) => ({
  id: reminder.id || `rem_mock_${Date.now()}`,
  plantId:
    reminder.plantId || reminder.plant_id || reminder.plantName || "plant_mock",
  plantName: reminder.plantName || reminder.plant_name || "My plant",
  plantEmoji: reminder.plantEmoji || reminder.plant_emoji || "🌿",
  type:
    reminder.type ||
    reminder.reminderType ||
    reminder.reminder_type ||
    "watering",
  frequency: reminder.frequency || "daily",
  time:
    reminder.time || reminder.reminderTime || reminder.reminder_time || "08:00",
  enabled: reminder.enabled !== false,
  dueDate:
    reminder.dueDate ||
    reminder.due_date ||
    new Date().toISOString().slice(0, 10),
  completed: Boolean(reminder.completed || reminder.done),
  completedAt:
    reminder.completedAt || reminder.completed_at || reminder.doneAt || null,
  source: reminder.source,
});

const normalizeList = (data) => {
  const items = Array.isArray(data)
    ? data
    : data?.items || data?.reminders || [];
  return items.map(normalizeReminder);
};

export const getReminders = (params) =>
  withMockFallback(
    () => get("/reminders", params).then(normalizeList),
    () => loadMockReminders().map(normalizeReminder),
  );

export const createReminder = (payload) =>
  withMockFallback(
    () => post("/reminders", payload).then(normalizeReminder),
    () => {
      const items = loadMockReminders();
      const reminder = normalizeReminder({
        ...payload,
        id: `rem_mock_${Date.now()}`,
        completed: false,
        completedAt: null,
        source: "mock-fallback",
      });
      saveMockReminders([reminder, ...items]);
      return reminder;
    },
  );

export const updateReminder = (id, payload) =>
  withMockFallback(
    () => put(`/reminders/${id}`, payload).then(normalizeReminder),
    () => {
      const items = loadMockReminders();
      const next = items.map((item) =>
        item.id === id ? normalizeReminder({ ...item, ...payload }) : item,
      );
      saveMockReminders(next);
      return normalizeReminder(next.find((item) => item.id === id));
    },
  );

export const deleteReminder = (id) =>
  withMockFallback(
    () => del(`/reminders/${id}`),
    () => {
      saveMockReminders(loadMockReminders().filter((item) => item.id !== id));
      return { ok: true, id, source: "mock-fallback" };
    },
  );

export const markReminderDone = (id) =>
  withMockFallback(
    () => post(`/reminders/${id}/done`, {}).then(normalizeReminder),
    () => {
      const completedAt = now();
      const next = loadMockReminders().map((item) =>
        item.id === id ? { ...item, completed: true, completedAt } : item,
      );
      saveMockReminders(next);
      return normalizeReminder(next.find((item) => item.id === id));
    },
  );

const parseReminderDate = (reminder) => {
  const normalized = normalizeReminder(reminder);
  const [hour = "08", minute = "00"] = normalized.time.split(":");
  const date = new Date(
    `${normalized.dueDate}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`,
  );
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const toCalendarDate = (date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const getCalendarEvent = (reminder) => {
  const normalized = normalizeReminder(reminder);
  const start = parseReminderDate(normalized);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const label = getReminderTypeLabel(normalized.type);

  return {
    id: normalized.id,
    title: `DeskBoost: ${label} - ${normalized.plantName}`,
    description: `DeskBoost in-app care reminder. Type: ${label}. Frequency: ${normalized.frequency}. This is an add-to-calendar/export event only.`,
    start,
    end,
  };
};

export const getExportableReminders = (reminders = []) =>
  reminders
    .map(normalizeReminder)
    .filter((item) => item.enabled && !item.completed);

const buildCalendar = (events) => {
  const escapeText = (value) =>
    String(value)
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DeskBoost//Care Reminder MVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.id}@deskboost.local`,
      `DTSTAMP:${toCalendarDate(new Date())}`,
      `DTSTART:${toCalendarDate(event.start)}`,
      `DTEND:${toCalendarDate(event.end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");
};

export const generateGoogleCalendarUrl = (reminder) => {
  const event = getCalendarEvent(reminder);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    dates: `${toCalendarDate(event.start)}/${toCalendarDate(event.end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateIcsFile = (reminder) =>
  buildCalendar([getCalendarEvent(reminder)]);

export const generateCombinedIcsFile = (reminders = []) =>
  buildCalendar(getExportableReminders(reminders).map(getCalendarEvent));

export const generateCombinedGoogleCalendarUrls = (reminders = []) =>
  getExportableReminders(reminders).map((reminder) => ({
    id: reminder.id,
    url: generateGoogleCalendarUrl(reminder),
  }));

export const generateCombinedCalendarExport = (reminders = []) => {
  const exportableReminders = getExportableReminders(reminders);
  return {
    reminders: exportableReminders,
    googleCalendarUrls: exportableReminders.map((reminder) => ({
      id: reminder.id,
      url: generateGoogleCalendarUrl(reminder),
    })),
    ics: buildCalendar(exportableReminders.map(getCalendarEvent)),
    source: "frontend-generated",
  };
};

export const getReminderCalendar = (idOrReminder) =>
  withMockFallback(
    () =>
      typeof idOrReminder === "string"
        ? get(`/reminders/${idOrReminder}/calendar`)
        : Promise.resolve(idOrReminder),
    () => ({
      googleCalendarUrl: generateGoogleCalendarUrl(idOrReminder),
      ics: generateIcsFile(idOrReminder),
      source: "frontend-generated",
    }),
  );

// Backward-compatible aliases during MVP cleanup.
export const apiGetReminders = getReminders;
export const apiCreateReminder = createReminder;
export const apiUpdateReminder = updateReminder;
export const apiDeleteReminder = deleteReminder;
export const apiMarkReminderDone = markReminderDone;
