import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDiagnosisLogs = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F9F8] dark:bg-[#10221f] font-['Manrope'] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10221f] fixed h-full">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-8 bg-[#4CAF50] rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">DeskBoost</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button onClick={() => navigate('/app/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </button>
            <button onClick={() => navigate('/app/admin/diagnosis-logs')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#4CAF50]/10 text-[#4CAF50] rounded-xl transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariantSettings: "'FILL' 1" }}>description</span>
              <span className="font-medium">Diagnosis Logs</span>
            </button>
            <button onClick={() => navigate('/app/admin/users')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined">group</span>
              <span className="font-medium">Users</span>
            </button>
            <button onClick={() => navigate('/app/admin/plants')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined">eco</span>
              <span className="font-medium">Plants</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-medium">Analytics</span>
            </button>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2">
              <img alt="Admin profile" className="size-10 rounded-full border-2 border-[#4CAF50]/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMkaKTnAwX6tli9M1x5N0ZzfECUWpF0hmd9jE3y9-Zs30EXYiNy7reGcSOFysuRV2SkogrZj0xoN3g10ph7fIvll1RDMPnLrq7caLuC7T4dhjVVx5SrUCt9yxzPpsHZpAndrseRiTkGDsu5hgTWFWJybTL0vmMQnEjO03tQllbJBmejPJu5hRZM2o1EcWv4UjSOHhPFjqRMy4U0dODcgHfPom3xmeTHfLDVK4FBoOq3HWUuBOTyJjSbGqn5kQGB525a5-3EMWdWbk" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Alex Gardener</p>
                <p className="text-xs text-slate-500 truncate">Senior Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#10221f]/80 backdrop-blur-md sticky top-0 z-10 px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#4CAF50] text-sm" placeholder="Search by user or plant type..." type="text" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={() => navigate('/app/admin/settings')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Diagnosis Logs</h1>
                <p className="text-slate-500 mt-1">Review AI-generated plant health reports and system feedback.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Filter
                </button>
                <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#4CAF50]/90">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">Total Diagnoses (24h)</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-bold">1,284</span>
                  <span className="text-[#4CAF50] text-sm font-bold flex items-center mb-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    12%
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">AI Accuracy Rate</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-bold">94.2%</span>
                  <span className="text-[#4CAF50] text-sm font-bold flex items-center mb-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    0.5%
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">Flagged for Review</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-bold">18</span>
                  <span className="text-red-500 text-sm font-bold flex items-center mb-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Action needed
                  </span>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Plant Species</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Symptoms</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">AI Diagnosis</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { user: 'John Doe', initials: 'JD', species: 'Monstera Deliciosa', symptom: 'Yellowing leaves', symptomColor: 'amber', diagnosis: 'Overwatering', date: 'Oct 24, 2:15 PM' },
                      { user: 'Anna Smith', initials: 'AS', species: 'Snake Plant', symptom: 'Soft brown spots', symptomColor: 'orange', diagnosis: 'Root Rot', date: 'Oct 24, 11:40 AM' },
                      { user: 'Mark Kim', initials: 'MK', species: 'Fiddle Leaf Fig', symptom: 'Drooping leaves', symptomColor: 'slate', diagnosis: 'Low Humidity', date: 'Oct 24, 09:12 AM' },
                      { user: 'Lucy White', initials: 'LW', species: 'Spider Plant', symptom: 'White webbing', symptomColor: 'red', diagnosis: 'Spider Mites', date: 'Oct 23, 5:50 PM' },
                      { user: 'Tom Reed', initials: 'TR', species: 'Aloe Vera', symptom: 'Pale leaves', symptomColor: 'amber', diagnosis: 'Insufficient Light', date: 'Oct 23, 1:20 PM' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center font-bold text-[#4CAF50] text-xs">{row.initials}</div>
                            <span className="font-medium">{row.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{row.species}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${row.symptomColor}-100 text-${row.symptomColor}-800`}>
                            {row.symptom}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{row.diagnosis}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg transition-colors" title="View diagnosis detail">
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">Showing 1 to 5 of 1,284 results</p>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="px-3 py-1 rounded bg-[#4CAF50] text-white text-sm font-medium">1</button>
                  <button className="px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium">2</button>
                  <button className="px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium">3</button>
                  <button className="p-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Footer Copyright */}
            <footer className="text-center text-slate-400 text-xs pb-8">
              © 2024 DeskBoost AI Systems. All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDiagnosisLogs;
