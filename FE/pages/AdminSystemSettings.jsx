import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSystemSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] text-slate-900 dark:text-slate-100 antialiased font-['Manrope'] min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-10 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">potted_plant</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">DeskBoost</h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 mt-4">
            <button onClick={() => navigate('/app/admin')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button onClick={() => navigate('/app/admin/users')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">group</span>
              <span className="text-sm font-medium">Users</span>
            </button>
            <button onClick={() => navigate('/app/admin/plants')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">eco</span>
              <span className="text-sm font-medium">Plant Library</span>
            </button>
            <button onClick={() => navigate('/app/admin/user-plants')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">yard</span>
              <span className="text-sm font-medium">User Plants</span>
            </button>
            <button onClick={() => navigate('/app/admin/diagnosis-logs')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">clinical_notes</span>
              <span className="text-sm font-medium">Diagnosis Logs</span>
            </button>
            <button onClick={() => navigate('/app/admin/content')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">description</span>
              <span className="text-sm font-medium">Content Management</span>
            </button>
            <button onClick={() => navigate('/app/admin/settings')} className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg transition-colors text-left">
              <span className="material-symbols-outlined shrink-0">settings</span>
              <span className="text-sm font-bold">System Settings</span>
            </button>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2">
              <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy0GzhWDJHZapmYkBvFSO2b4y_IDpfnWtR2dGuQU5cJ7Iso5_6l3CW6G0e2EVxPMYQ4hwk_QGGjrvCh9QDXDnk_yUJj1e139Rrw0_Jfs3iHR_IF0XDbyhcmmFFh7H6Meat9Remf6GnOkqyopNsNI4-Dstuo_SDjHZlvwMyjgRNbZ1f2ZA09PK8JxSlIX8uF833OqQ8b8MxZKekIXgtmS1IlsX8Z9v4PRNwlClnnEXqiFHfAYFo_99qvgSE5GsEryigsK18-VGN0tY')" }}></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Alex Rivard</p>
                <p className="text-xs text-slate-500 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <header className="mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">System Settings</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your global application preferences, security integrations, and system-wide configurations.</p>
            </header>

            <div className="space-y-8">
              {/* Email Notification Settings */}
              <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4CAF50]">mail</span>
                    Email Notification Settings
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">New User Registration</p>
                      <p className="text-xs text-slate-500">Receive an alert every time a new account is created.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daily Care Reminders</p>
                      <p className="text-xs text-slate-500">Automated morning emails for plant watering schedules.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">System Alerts</p>
                      <p className="text-xs text-slate-500">Critical server notifications and API downtime warnings.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* AI API Configuration */}
              <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4CAF50]">smart_toy</span>
                    AI API Configuration
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">OpenAI API Key</label>
                    <div className="relative">
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2.5 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all" type="password" defaultValue="sk-proj-************************************" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Model Selection</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2.5 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all">
                      <option>GPT-4o (Recommended)</option>
                      <option>GPT-4 Turbo</option>
                      <option>Gemini Pro 1.5</option>
                      <option>Claude 3.5 Sonnet</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google AI Studio API Key</label>
                    <div className="relative">
                      <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2.5 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all" placeholder="Enter Gemini API key" type="password" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* System Parameters */}
              <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4CAF50]">tune</span>
                    System Parameters
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Redirect all users to a technical maintenance page.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Global Care Reminder Frequency</label>
                      <div className="flex items-center gap-2">
                        <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2.5 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all" type="number" defaultValue="24" />
                        <span className="text-sm text-slate-500 font-medium">Hours</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Default Currency</label>
                      <select className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2.5 focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Action */}
            <footer className="mt-12 flex items-center justify-end border-t border-slate-200 dark:border-slate-800 pt-8 gap-4 mb-20">
              <button className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Reset to Defaults
              </button>
              <button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-[#4CAF50]/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">save</span>
                Save Settings
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
