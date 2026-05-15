import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F7F9F8] dark:bg-[#10221f] px-4">
    <div className="w-full max-w-md rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-900/20 text-red-500">
        <span className="material-symbols-outlined text-4xl">lock</span>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">Forbidden</p>
      <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Admin only</h1>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
        Tài khoản hiện tại không có quyền truy cập khu vực quản trị DeskBoost.
      </p>
      <Link to="/app/dashboard" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#4CAF50] px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-[#4CAF50]/20 transition hover:scale-[1.02]">
        Về Dashboard
      </Link>
    </div>
  </div>
);

export default Forbidden;
