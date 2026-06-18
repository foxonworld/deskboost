import { get } from "./api";

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.Items || []);
const normalizePagination = (data = {}) => {
  const pagination = data.pagination || data.Pagination || {};
  return {
    page: Number(firstValue(pagination.page, pagination.Page, 1)),
    limit: Number(firstValue(pagination.limit, pagination.Limit, 20)),
    total: Number(firstValue(pagination.total, pagination.Total, 0)),
    totalPages: Number(firstValue(pagination.totalPages, pagination.TotalPages, 0)),
  };
};

export const normalizeReminderOpsSummary = (summary = {}) => ({
  totalReminders: Number(firstValue(summary.totalReminders, summary.TotalReminders, 0)),
  activeReminders: Number(firstValue(summary.activeReminders, summary.ActiveReminders, 0)),
  dueToday: Number(firstValue(summary.dueToday, summary.DueToday, 0)),
  overdue: Number(firstValue(summary.overdue, summary.Overdue, 0)),
  disabled: Number(firstValue(summary.disabled, summary.Disabled, 0)),
  watering: Number(firstValue(summary.watering, summary.Watering, 0)),
  fertilizing: Number(firstValue(summary.fertilizing, summary.Fertilizing, 0)),
  other: Number(firstValue(summary.other, summary.Other, 0)),
  pendingEmailLoadNext24h: Number(firstValue(summary.pendingEmailLoadNext24h, summary.PendingEmailLoadNext24h, 0)),
  criticalUsers: Number(firstValue(summary.criticalUsers, summary.CriticalUsers, 0)),
});

export const normalizeReminderOpsRow = (row = {}) => ({
  id: firstValue(row.id, row.Id),
  userId: firstValue(row.userId, row.UserId),
  userName: firstValue(row.userName, row.UserName),
  userEmail: firstValue(row.userEmail, row.UserEmail),
  plantId: firstValue(row.plantId, row.PlantId),
  plantName: firstValue(row.plantName, row.PlantName),
  title: firstValue(row.title, row.Title),
  careType: firstValue(row.careType, row.CareType),
  dueAt: firstValue(row.dueAt, row.DueAt),
  repeatRule: firstValue(row.repeatRule, row.RepeatRule),
  status: firstValue(row.status, row.Status),
  isActive: Boolean(firstValue(row.isActive, row.IsActive, false)),
  lastDoneAt: firstValue(row.lastDoneAt, row.LastDoneAt),
  lastEmailStatus: firstValue(row.lastEmailStatus, row.LastEmailStatus),
  lastEmailSentAt: firstValue(row.lastEmailSentAt, row.LastEmailSentAt),
  emailSendCount: Number(firstValue(row.emailSendCount, row.EmailSendCount, 0)),
  riskLevel: firstValue(row.riskLevel, row.RiskLevel),
});

export const normalizeEmailOpsSummary = (summary = {}) => ({
  sentToday: Number(firstValue(summary.sentToday, summary.SentToday, 0)),
  failedToday: Number(firstValue(summary.failedToday, summary.FailedToday, 0)),
  pending: Number(firstValue(summary.pending, summary.Pending, 0)),
  skippedToday: Number(firstValue(summary.skippedToday, summary.SkippedToday, 0)),
  successRate: Number(firstValue(summary.successRate, summary.SuccessRate, 0)),
  dailyQuotaLimit: Number(firstValue(summary.dailyQuotaLimit, summary.DailyQuotaLimit, 300)),
  dailyQuotaUsed: Number(firstValue(summary.dailyQuotaUsed, summary.DailyQuotaUsed, 0)),
  dailyQuotaPercent: Number(firstValue(summary.dailyQuotaPercent, summary.DailyQuotaPercent, 0)),
  topErrorCode: firstValue(summary.topErrorCode, summary.TopErrorCode),
});

export const normalizeEmailOpsLog = (row = {}) => ({
  id: firstValue(row.id, row.Id),
  recipientUserId: firstValue(row.recipientUserId, row.RecipientUserId),
  recipientEmail: firstValue(row.recipientEmail, row.RecipientEmail),
  userName: firstValue(row.userName, row.UserName),
  category: firstValue(row.category, row.Category),
  subject: firstValue(row.subject, row.Subject),
  status: firstValue(row.status, row.Status),
  provider: firstValue(row.provider, row.Provider),
  sentAt: firstValue(row.sentAt, row.SentAt),
  createdAt: firstValue(row.createdAt, row.CreatedAt),
  errorCode: firstValue(row.errorCode, row.ErrorCode),
  errorMessage: firstValue(row.errorMessage, row.ErrorMessage),
  relatedEntityType: firstValue(row.relatedEntityType, row.RelatedEntityType),
  relatedEntityId: firstValue(row.relatedEntityId, row.RelatedEntityId),
});

export const getReminderOpsSummary = () =>
  get("/admin/reminder-operations/summary").then(normalizeReminderOpsSummary);

export const getAdminReminders = (params) =>
  get("/admin/reminder-operations/reminders", params).then((data) => ({
    items: normalizeItems(data).map(normalizeReminderOpsRow),
    pagination: normalizePagination(data),
  }));

export const getEmailOpsSummary = () =>
  get("/admin/email-operations/summary").then(normalizeEmailOpsSummary);

export const getEmailLogs = (params) =>
  get("/admin/email-operations/logs", params).then((data) => ({
    items: normalizeItems(data).map(normalizeEmailOpsLog),
    pagination: normalizePagination(data),
  }));
