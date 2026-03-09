import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminManageUserPlants = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F9F8] dark:bg-[#10221f] font-['Manrope'] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-[#4CAF50] cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-8 flex items-center justify-center bg-[#4CAF50]/10 rounded-lg">
                  <span className="material-symbols-outlined text-[#4CAF50]">potted_plant</span>
                </div>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">DeskBoost Admin</h2>
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <button onClick={() => navigate('/app/admin')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] dark:hover:text-[#4CAF50] text-sm font-medium leading-normal">Dashboard</button>
                <button onClick={() => navigate('/app/admin/users')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] dark:hover:text-[#4CAF50] text-sm font-medium leading-normal">Users</button>
                <button onClick={() => navigate('/app/admin/plants')} className="text-[#4CAF50] text-sm font-bold leading-normal border-b-2 border-[#4CAF50] pb-1">Plants</button>
                <button onClick={() => navigate('/app/admin/settings')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] dark:hover:text-[#4CAF50] text-sm font-medium leading-normal">Settings</button>
              </nav>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <label className="flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-800 focus:ring-0 h-full placeholder:text-slate-400 px-4 rounded-r-xl text-sm font-normal" placeholder="Search plants or users..." />
                </div>
              </label>
              <div className="flex items-center gap-2">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#4CAF50]/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsIrN8fp6EED-fIdy1M-zSsG81_IZdtrTRlwr8gAEtIF8nAKRwYVCpa2RlxUkrNB3Mcg3hIeUqG7m3x1_veOPhY3wm6ng3oMqvqdWddxMnL-vkz-2KAw8Kp0K_hWiPCB0KLXUSBdsAX7Pip2W8PXiIpqqvPQteZZ4t0iG9OcAhTUpe34tFs_V5_R8WM98duyOh4_hZ9V5AfDO_6HQkmNdeXVWd9HWUbMTJKOUNw2JUXblICXTcCzwGuV5SF2VbpMkK9OYU8VpdDTY")' }}></div>
              </div>
            </div>
          </header>

          <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-6">
              <div className="flex flex-wrap justify-between items-end gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Manage User Plants</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Track, monitor, and manage all plant assets across the DeskBoost community.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                    <span>Filter</span>
                  </button>
                  <button onClick={() => navigate('/app/admin/plants/add')} className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 bg-[#4CAF50] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span>Add New Plant</span>
                  </button>
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8 overflow-x-auto">
                  <button className="flex flex-col items-center justify-center border-b-2 border-[#4CAF50] text-[#4CAF50] pb-3 pt-4 whitespace-nowrap">
                    <p className="text-sm font-bold leading-normal">All Plants (248)</p>
                  </button>
                  <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 pb-3 pt-4 whitespace-nowrap">
                    <p className="text-sm font-bold leading-normal">Requires Attention (12)</p>
                  </button>
                  <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 pb-3 pt-4 whitespace-nowrap">
                    <p className="text-sm font-bold leading-normal">Recently Added</p>
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">User Name</th>
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Plant Name</th>
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Health Status</th>
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Last Watered</th>
                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { user: 'Alice Johnson', initials: 'AJ', plant: 'Fiddle Leaf Fig', loc: 'Office A-12', status: 'Healthy', statusColor: 'emerald', date: '2023-10-24' },
                        { user: 'Bob Smith', initials: 'BS', plant: 'Snake Plant', loc: 'Main Lobby', status: 'Thirsty', statusColor: 'amber', date: '2023-10-20' },
                        { user: 'Charlie Davis', initials: 'CD', plant: 'Monstera', loc: 'Breakroom', status: 'Checkup', statusColor: 'blue', date: '2023-10-25' },
                        { user: 'Diana Prince', initials: 'DP', plant: 'Golden Pothos', loc: 'Office B-04', status: 'Healthy', statusColor: 'emerald', date: '2023-10-26' },
                        { user: 'Ethan Miller', initials: 'EM', plant: 'Spider Plant', loc: 'Desk 42', status: 'Healthy', statusColor: 'emerald', date: '2023-10-27' },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{item.initials}</div>
                              <span className="text-slate-900 dark:text-slate-100 font-medium">{item.user}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-slate-600 dark:text-slate-400">{item.plant}</td>
                          <td className="px-6 py-5 text-slate-600 dark:text-slate-400">{item.loc}</td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${item.statusColor}-100 text-${item.statusColor}-800 dark:bg-${item.statusColor}-900/30 dark:text-${item.statusColor}-400`}>
                              <span className={`w-1.5 h-1.5 rounded-full bg-${item.statusColor}-500 mr-1.5`}></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-slate-600 dark:text-slate-400">{item.date}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 text-slate-400 hover:text-[#4CAF50] transition-colors" title="View plant profile">
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Remove plant">
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Showing 1-5 of 248 plants</p>
                <div className="flex items-center gap-1">
                  <button className="flex size-9 items-center justify-center text-slate-400 hover:text-[#4CAF50] transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="text-sm font-bold flex size-9 items-center justify-center text-white rounded-lg bg-[#4CAF50]">1</button>
                  <button className="text-sm font-medium flex size-9 items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">2</button>
                  <button className="text-sm font-medium flex size-9 items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">3</button>
                  <span className="text-slate-400 px-2">...</span>
                  <button className="text-sm font-medium flex size-9 items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">50</button>
                  <button className="flex size-9 items-center justify-center text-slate-400 hover:text-[#4CAF50] transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
          <footer className="mt-auto py-8 px-10 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-600 text-xs">
            © 2023 DeskBoost System Admin. All plants are happy.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminManageUserPlants;
