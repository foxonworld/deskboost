import { get, post, put, del, requestText } from "./api";

const typeLabels = {
  watering: "watering",
  fertilizing: "fertilizing",
  check_leaves: "check leaves",
};

const isDoneStatus = (status) =>
  ["done", "completed", "complete"].includes(String(status || "").toLowerCase());

const pad = (value) => String(value).padStart(2, "0");

const toLocalDateParts = (value) => {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return {
    dueDate: `${safeDate.getFullYear()}-${pad(safeDate.getMonth() + 1)}-${pad(safeDate.getDate())}`,
    time: `${pad(safeDate.getHours())}:${pad(safeDate.getMinutes())}`,
  };
};

const buildDueAt = (payload = {}) => {
  if (payload.dueAt) return payload.dueAt;
  const dueDate = payload.dueDate || new Date().toISOString().slice(0, 10);
  const time = payload.time || "08:00";
  return new Date(`${dueDate}T${time}:00`).toISOString();
};

export const getReminderTypeLabel = (type) =>
  typeLabels[type] || type || "watering";

export const normalizeReminder = (reminder = {}) => {
  const dueAt = reminder.dueAt || reminder.due_at || reminder.dueDate || reminder.due_date;
  const { dueDate, time } = toLocalDateParts(dueAt);
  const status = reminder.status || (reminder.completed || reminder.done ? "done" : "pending");
  const completed = isDoneStatus(status) || Boolean(reminder.completed || reminder.done);

  return {
    ...reminder,
    id: reminder.id,
    plantId: reminder.plantId || reminder.plant_id || reminder.plant?.id || "",
    plantName:
      reminder.plantName ||
      reminder.plant_name ||
      reminder.plant?.name ||
      reminder.plant?.nickname ||
      "My plant",
    plantEmoji: reminder.plantEmoji || reminder.plant_emoji || "",
    title: reminder.title || getReminderTypeLabel(reminder.careType || reminder.type),
    type: reminder.careType || reminder.care_type || reminder.type || "watering",
    careType: reminder.careType || reminder.care_type || reminder.type || "watering",
    frequency: reminder.repeatRule || reminder.repeat_rule || reminder.frequency || "daily",
    repeatRule: reminder.repeatRule || reminder.repeat_rule || reminder.frequency || "daily",
    notes: reminder.notes || "",
    dueAt: dueAt || new Date().toISOString(),
    dueDate,
    time,
    status,
    enabled: reminder.enabled !== false && !["disabled", "cancelled"].includes(String(status).toLowerCase()),
    completed,
    completedAt:
      reminder.completedAt ||
      reminder.completed_at ||
      reminder.doneAt ||
      (completed ? reminder.updatedAt || reminder.updated_at || null : null),
  };
};

const normalizeList = (data) => {
  const items = Array.isArray(data)
    ? data
    : data?.items || data?.data || data?.reminders || [];
  return items.map(normalizeReminder);
};

export const toReminderPayload = (payload = {}) => ({
  plantId: payload.plantId,
  title: payload.title || getReminderTypeLabel(payload.careType || payload.type),
  careType: payload.careType || payload.type || "watering",
  dueAt: buildDueAt(payload),
  repeatRule: payload.repeatRule || payload.frequency || "daily",
  notes: payload.notes || "",
});

export const getReminders = (params) =>
  get("/reminders", params).then(normalizeList);

export const createReminder = (payload) =>
  post("/reminders", toReminderPayload(payload)).then(normalizeReminder);

export const updateReminder = (id, payload) =>
  put(`/reminders/${id}`, toReminderPayload(payload)).then(normalizeReminder);

export const deleteReminder = (id) => del(`/reminders/${id}`);

export const markReminderDone = (id) =>
  put(`/reminders/${id}/done`, {}).then(normalizeReminder);

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
    title: normalized.title || `DeskBoost: ${label} - ${normalized.plantName}`,
    description: [
      normalized.notes,
      `DeskBoost care reminder. Type: ${label}. Frequency: ${normalized.frequency}.`,
    ]
      .filter(Boolean)
      .join("\n"),
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
    "PRODID:-//DeskBoost//Care Reminder//EN",
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
    googleCalendarUrls: generateCombinedGoogleCalendarUrls(exportableReminders),
    ics: generateCombinedIcsFile(exportableReminders),
    source: "frontend-generated-combined-export",
  };
};

export const getReminderCalendar = (id) =>
  get(`/reminders/${id}/calendar`).then((data) => ({
    ...data,
    googleCalendarUrl:
      data?.googleCalendarUrl ||
      data?.googleUrl ||
      data?.calendarUrl ||
      data?.url ||
      data?.link,
  }));

export const getReminderIcs = (id) =>
  requestText(`/reminders/${id}/calendar`, { params: { format: "ics" } });

// Backward-compatible aliases during MVP cleanup.
export const apiGetReminders = getReminders;
export const apiCreateReminder = createReminder;
export const apiUpdateReminder = updateReminder;
export const apiDeleteReminder = deleteReminder;
export const apiMarkReminderDone = markReminderDone;
