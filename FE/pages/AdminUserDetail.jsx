import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 min-h-screen font-['Manrope']">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-8 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <h1 className="text-lg font-bold">DeskBoost</h1>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <button onClick={() => navigate('/app/admin')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button onClick={() => navigate('/app/admin/users')} className="w-full flex items-center gap-3 px-3 py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm font-bold">Users</span>
            </button>
            <button onClick={() => navigate('/app/admin/plants')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">eco</span>
              <span className="text-sm font-medium">Plant Library</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center gap-4">
            <button onClick={() => navigate('/app/admin/users')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">User Details</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Viewing profile for User ID: {id}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <p className="font-medium">Alex Gardener</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <p className="font-medium">alex@example.com</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                    <p className="font-medium">Admin</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold mb-6">User Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4CAF50]">potted_plant</span>
                      <div>
                        <p className="text-sm font-bold">Added a new plant</p>
                        <p className="text-xs text-slate-500">Monstera Deliciosa</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4CAF50]">clinical_notes</span>
                      <div>
                        <p className="text-sm font-bold">Performed diagnosis</p>
                        <p className="text-xs text-slate-500">Snake Plant</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">1 day ago</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-slate-400">
                  AG
                </div>
                <h4 className="text-lg font-bold">Alex Gardener</h4>
                <p className="text-sm text-slate-500 mb-6">Joined Jan 2023</p>
                <button className="w-full bg-[#4CAF50] text-white py-2 rounded-lg font-bold text-sm mb-2">Edit Profile</button>
                <button className="w-full border border-red-200 text-red-600 py-2 rounded-lg font-bold text-sm">Suspend User</button>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserDetail;
