import { get, post, put, del } from './api';

/**
 * Care reminder API
 * TODO: connect to backend when ready
 */

export const apiGetReminders    = ()        => get('/reminders');
export const apiCreateReminder  = (data)    => post('/reminders', data);
export const apiUpdateReminder  = (id, d)   => put(`/reminders/${id}`, d);
export const apiDeleteReminder  = (id)      => del(`/reminders/${id}`);
