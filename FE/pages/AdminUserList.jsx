import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminUserList = () => {
  const navigate = useNavigate();

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
            <button onClick={() => navigate('/app/admin/user-plants')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">yard</span>
              <span className="text-sm font-medium">User Plants</span>
            </button>
            <button onClick={() => navigate('/app/admin/diagnosis-logs')} className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined">clinical_notes</span>
              <span className="text-sm font-medium">Diagnosis Logs</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">User Management</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage system users and their access levels.</p>
            </div>
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              Add User
            </button>
          </header>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { id: 1, name: 'Alex Gardener', email: 'alex@example.com', role: 'Admin', status: 'Active', date: '2023-01-15' },
                  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', date: '2023-05-20' },
                  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive', date: '2023-08-10' },
                ].map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => navigate(`/app/admin/users/${user.id}`)} className="text-[#4CAF50] hover:underline font-bold text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserList;
