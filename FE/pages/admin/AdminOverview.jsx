import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  getAdminSummary,
  getAdminUsers,
  getAdminAiDialogs,
  getAdminMarketplacePlants,
  getAdminAiConfigStatus,
} from '../../services/adminApi';
import { useI18n } from '../../i18n';

/* ─── helpers ─────────────────────────────────────────────── */
const formatDate = (str) => {
  if (!str) return null;
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(str));
  } catch {
    return str;
  }
};

const relativeTime = (str) => {
  if (!str) return null;
  try {
    const diff = Date.now() - new Date(str).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'vừa xong';
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
  } catch {
    return str;
  }
};

/* ─── sub-components ────────────────────────────────────────── */

const MetricCard = ({ icon, label, value, note, accent, loading }) => (
  <article
    className="relative overflow-hidden rounded-[24px] border bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md dark:bg-[#111813]/70"
    style={{ borderColor: loading ? '#e2e8f0' : `${accent}22` }}
  >
    {/* accent strip */}
    <div
      className="absolute left-0 top-0 h-1 w-full rounded-t-2xl"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between gap-3 pt-2">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
        style={{ background: accent }}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </span>
      {loading ? (
        <div className="h-7 w-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      ) : (
        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value ?? '—'}
        </span>
      )}
    </div>
    {loading ? (
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    ) : (
      <>
        <p className="mt-3 text-sm font-black text-slate-700 dark:text-slate-200">{label}</p>
        {note && <p className="mt-1 text-xs font-medium leading-5 text-slate-400">{note}</p>}
      </>
    )}
  </article>
);

const QuickLink = ({ to, icon, label, hint, color }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2 rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[#4CAF50]/30 hover:shadow-md dark:border-white/10 dark:bg-[#111813]/70"
  >
    <span
      className="flex h-10 w-10 items-center justify-center rounded-xl"
      style={{ background: `${color}18`, color }}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </span>
    <div className="min-w-0 w-full">
      <p className="truncate text-xs font-black text-slate-800 dark:text-white">{label}</p>
      {hint && <p className="truncate text-[10px] font-medium text-slate-400">{hint}</p>}
    </div>
  </Link>
);

const SectionHeader = ({ title, actionTo, actionLabel }) => (
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {title}
    </h2>
    {actionTo && (
      <Link
        to={actionTo}
        className="text-xs font-black text-[#4CAF50] transition hover:underline"
      >
        {actionLabel} →
      </Link>
    )}
  </div>
);

const UserRow = ({ user }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-500 dark:bg-slate-800">
      {(user.name || user.email || '?').slice(0, 1).toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-black text-slate-800 dark:text-white">
        {user.name || user.email || 'Người dùng chưa đặt tên'}
      </p>
      <p className="truncate text-xs text-slate-400">{user.email}</p>
    </div>
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
        user.status === 'active'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : user.status === 'banned'
          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
      }`}
    >
      {user.status || 'active'}
    </span>
  </div>
);

const DialogRow = ({ dialog }) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
      <span className="material-symbols-outlined text-base text-violet-600 dark:text-violet-400">
        smart_toy
      </span>
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-black text-slate-800 dark:text-white">
        {dialog.userName || dialog.userEmail || 'Người dùng chưa rõ'}
      </p>
      <p className="truncate text-xs text-slate-400">
        {dialog.title || dialog.lastMessage || 'Hội thoại AI'}
      </p>
    </div>
    <span className="shrink-0 text-[11px] font-medium text-slate-400">
      {relativeTime(dialog.updatedAt || dialog.createdAt)}
    </span>
  </div>
);

const MarketplaceRow = ({ plant }) => (
  <div className="flex items-center gap-3 py-2.5">
    {plant.imageUrl ? (
      <img
        src={plant.imageUrl}
        alt={plant.name}
        className="h-9 w-9 shrink-0 rounded-xl object-cover"
      />
    ) : (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4CAF50]/10">
        <span className="material-symbols-outlined text-base text-[#4CAF50]">potted_plant</span>
      </span>
    )}
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-black text-slate-800 dark:text-white">
        {plant.name || 'Sản phẩm'}
      </p>
      <p className="truncate text-xs text-slate-400">{plant.priceText || plant.category || ''}</p>
    </div>
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
        plant.status === 'active'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
      }`}
    >
      {plant.status || 'active'}
    </span>
  </div>
);

/* ─── main component ──────────────────────────────────────── */

const METRICS = [
  {
    key: 'users',
    icon: 'group',
    label: 'Người dùng',
    note: 'Tài khoản đã đăng ký trên hệ thống',
    accent: '#3b82f6',
  },
  {
    key: 'userPlants',
    icon: 'potted_plant',
    label: 'Cây của user',
    note: 'Cây đang theo dõi chăm sóc',
    accent: '#4CAF50',
  },
  {
    key: 'marketplacePlants',
    icon: 'storefront',
    label: 'Tin marketplace',
    note: 'Tin đăng liên hệ contact-only',
    accent: '#f59e0b',
  },
  {
    key: 'aiDialogs',
    icon: 'smart_toy',
    label: 'Hội thoại AI',
    note: 'Lịch sử chat theo ngữ cảnh cây',
    accent: '#8b5cf6',
  },
];

const QUICK_LINKS = [
  { to: '/admin/users', icon: 'group', label: 'Người dùng', hint: 'Tài khoản & trạng thái', color: '#3b82f6' },
  { to: '/admin/plants', icon: 'potted_plant', label: 'Cây của user', hint: 'Theo dõi chăm sóc', color: '#4CAF50' },
  { to: '/admin/plant-inventory', icon: 'inventory_2', label: 'Kho cây', hint: 'Quản lý mã claim', color: '#10b981' },
  { to: '/admin/marketplace', icon: 'storefront', label: 'Marketplace', hint: 'Tin đăng liên hệ', color: '#f59e0b' },
  { to: '/admin/feedback', icon: 'rate_review', label: 'Feedback', hint: 'Đánh giá xác minh', color: '#ec4899' },
  { to: '/admin/ai', icon: 'smart_toy', label: 'AI Chat', hint: 'Hội thoại & cấu hình', color: '#8b5cf6' },
  { to: '/admin/notifications', icon: 'campaign', label: 'Thông báo', hint: 'Gửi thông báo user', color: '#ef4444' },
];

const AdminOverview = () => {
  const { t } = useI18n();

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  const [recentUsers, setRecentUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [recentDialogs, setRecentDialogs] = useState([]);
  const [dialogsLoading, setDialogsLoading] = useState(true);

  const [recentListings, setRecentListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [aiStatus, setAiStatus] = useState(null);
  const [aiStatusLoading, setAiStatusLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError('');

    // Load all in parallel — each section handles its own error
    const [summaryResult, usersResult, dialogsResult, listingsResult, aiResult] =
      await Promise.allSettled([
        getAdminSummary(),
        getAdminUsers({ limit: 5 }),
        getAdminAiDialogs({ limit: 5 }),
        getAdminMarketplacePlants({ limit: 5 }),
        getAdminAiConfigStatus(),
      ]);

    // summary
    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      setSummaryError(summaryResult.reason?.message || 'Không tải được tổng quan.');
    }
    setSummaryLoading(false);

    // users
    if (usersResult.status === 'fulfilled') {
      setRecentUsers(usersResult.value?.items?.slice(0, 5) || []);
    }
    setUsersLoading(false);

    // ai dialogs
    if (dialogsResult.status === 'fulfilled') {
      setRecentDialogs(dialogsResult.value?.items?.slice(0, 5) || []);
    }
    setDialogsLoading(false);

    // marketplace
    if (listingsResult.status === 'fulfilled') {
      setRecentListings(listingsResult.value?.items?.slice(0, 5) || []);
    }
    setListingsLoading(false);

    // ai status
    if (aiResult.status === 'fulfilled') {
      setAiStatus(aiResult.value);
    }
    setAiStatusLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* ── Header / Hero ────────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-sm dark:border-white/10 dark:bg-[#111813]/70 sm:p-8">
          {/* decorative gradient blob */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #4CAF50, transparent 70%)' }}
          />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4CAF50]">
              Tổng quan hệ thống
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              {greeting}, Admin 👋
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {formatDate(now.toISOString())} —{' '}
              {summaryError ? (
                <span className="text-amber-500">
                  Backend chưa phản hồi. Một số dữ liệu có thể chưa hiển thị.
                </span>
              ) : (
                'Dữ liệu thật từ backend DeskBoost.'
              )}
            </p>

            {/* AI system badge */}
            {!aiStatusLoading && aiStatus && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                <span
                  className={`h-2 w-2 rounded-full ${
                    aiStatus.configured ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                />
                <span className="text-xs font-black text-slate-600 dark:text-slate-300">
                  AI {aiStatus.provider || 'Provider'}:{' '}
                  {aiStatus.configured ? 'Đã cấu hình ✓' : 'Chưa cấu hình'}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── KPI Metrics ─────────────────────────────── */}
        <section>
          <SectionHeader title="Số liệu tổng quan" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((m) => (
              <MetricCard
                key={m.key}
                icon={m.icon}
                label={m.label}
                note={m.note}
                accent={m.accent}
                value={summary ? summary[m.key] : undefined}
                loading={summaryLoading}
              />
            ))}
          </div>
          {summaryError && !summaryLoading && (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              ⚠ {summaryError} — Endpoint cần thiết:{' '}
              <code className="font-mono text-xs">GET /api/admin/summary</code>
            </p>
          )}
        </section>

        {/* ── Quick Navigation ─────────────────────────── */}
        <section>
          <SectionHeader title="Điều hướng nhanh" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {QUICK_LINKS.map((link) => (
              <QuickLink key={link.to} {...link} />
            ))}
          </div>
        </section>

        {/* ── Recent Activity Grid ──────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Recent Users */}
          <section className="rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111813]/70">
            <SectionHeader
              title="Người dùng gần đây"
              actionTo="/admin/users"
              actionLabel="Xem tất cả"
            />
            {usersLoading ? (
              <div className="space-y-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="py-6 text-center text-xs font-bold text-slate-400">
                Chưa có người dùng
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </div>
            )}
          </section>

          {/* Recent AI Dialogs */}
          <section className="rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111813]/70">
            <SectionHeader
              title="Hội thoại AI gần đây"
              actionTo="/admin/ai"
              actionLabel="Xem tất cả"
            />
            {dialogsLoading ? (
              <div className="space-y-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-xl bg-violet-100 dark:bg-violet-900/30" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentDialogs.length === 0 ? (
              <p className="py-6 text-center text-xs font-bold text-slate-400">
                Chưa có hội thoại AI
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentDialogs.map((dialog) => (
                  <DialogRow key={dialog.id} dialog={dialog} />
                ))}
              </div>
            )}
          </section>

          {/* Recent Marketplace */}
          <section className="rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111813]/70">
            <SectionHeader
              title="Marketplace gần đây"
              actionTo="/admin/marketplace"
              actionLabel="Xem tất cả"
            />
            {listingsLoading ? (
              <div className="space-y-2.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentListings.length === 0 ? (
              <p className="py-6 text-center text-xs font-bold text-slate-400">
                Chưa có tin đăng
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentListings.map((plant) => (
                  <MarketplaceRow key={plant.id} plant={plant} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── System Health ─────────────────────────────── */}
        <section className="rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#111813]/70">
          <SectionHeader title="Trạng thái hệ thống" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* API Backend */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  !summaryError ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
              <div>
                <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                  Backend API
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {summaryLoading
                    ? 'Đang kiểm tra...'
                    : !summaryError
                    ? 'Hoạt động bình thường'
                    : 'Chưa kết nối được'}
                </p>
              </div>
            </div>

            {/* AI Provider */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  aiStatusLoading
                    ? 'bg-slate-300'
                    : aiStatus?.configured
                    ? 'bg-emerald-500'
                    : 'bg-amber-400'
                }`}
              />
              <div>
                <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                  AI Provider
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {aiStatusLoading
                    ? 'Đang kiểm tra...'
                    : aiStatus?.configured
                    ? `${aiStatus.provider || 'Provider'} — Sẵn sàng`
                    : 'Chưa cấu hình API key'}
                </p>
              </div>
            </div>

            {/* Marketplace Scope */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400" />
              <div>
                <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                  Marketplace
                </p>
                <p className="text-[11px] font-medium text-slate-400">Contact-only · MVP scope</p>
              </div>
            </div>

            {/* QR/Claim */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
              <div>
                <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                  QR / Claim
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  Tính năng tương lai · Chưa bật
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
