import { get, post, put, del } from "./api";

export const getReminders = () => get("/reminders");
export const createReminder = (payload) => post("/reminders", payload);
export const updateReminder = (id, payload) => put(`/reminders/${id}`, payload);
export const deleteReminder = (id) => del(`/reminders/${id}`);

// Backward-compatible aliases during MVP cleanup.
export const apiGetReminders = getReminders;
export const apiCreateReminder = createReminder;
export const apiUpdateReminder = updateReminder;
export const apiDeleteReminder = deleteReminder;
