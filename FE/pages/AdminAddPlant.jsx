import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddPlant = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F7F9F8] dark:bg-[#10221f] font-['Manrope'] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header Navigation */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-8 flex items-center justify-center bg-[#4CAF50] rounded-lg text-white">
                  <span className="material-symbols-outlined">potted_plant</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">DeskBoost Admin</h2>
              </div>
              <div className="hidden md:flex items-center gap-9">
                <button onClick={() => navigate('/app/admin')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] text-sm font-medium transition-colors">Dashboard</button>
                <button onClick={() => navigate('/app/admin/plants')} className="text-[#4CAF50] text-sm font-bold border-b-2 border-[#4CAF50]">Plants</button>
                <button onClick={() => navigate('/app/admin/users')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] text-sm font-medium transition-colors">Users</button>
                <button onClick={() => navigate('/app/admin/settings')} className="text-slate-600 dark:text-slate-400 hover:text-[#4CAF50] text-sm font-medium transition-colors">Settings</button>
              </div>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
              <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 h-full placeholder:text-slate-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal" placeholder="Search library..." />
                </div>
              </label>
              <button className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#4CAF50]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBD0UuWGwXqrHJny8Q5APJ5aEEadQ-txeGHy7TwNQR62xu75rgsLqmqfDyPKT15nby5WRxy3KR8co0XByw-sOX34gasPn9UjxemIgZ0Hg5uTzPl3lGvz8Y2iYI55UhfmiyhA51cz8z79PViJnCbVWUCFvAucz4icNmzXLpSglMedbFDP39gk6qt2MId84ohRe4f9cNzKc5uP8Y-UT0wawDBuNyeb2vkavdLOr49L7FUds4ylld85qi1BcGmbmwFtU-o1_JKpRydkhM")' }}></div>
            </div>
          </header>

          <main className="flex flex-1 justify-center py-6 md:py-10">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] px-4 md:px-10 flex-1">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/app/admin/plants')} className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-[#4CAF50]">Plant Library</button>
                <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                <span className="text-slate-900 dark:text-white text-sm font-bold">Add New Plant</span>
              </div>

              {/* Page Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Add Plant Species</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure the growth parameters and care guidelines for a new plant.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/app/admin/plants')} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                  <button onClick={() => navigate('/app/admin/plants')} className="px-6 py-2.5 rounded-xl bg-[#4CAF50] text-white font-bold text-sm hover:bg-[#4CAF50]/90 transition-colors shadow-lg shadow-[#4CAF50]/20">Save Plant</button>
                </div>
              </div>

              {/* Form Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Section: Basic Info */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4CAF50]">info</span>
                      General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Plant Common Name</label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm" placeholder="e.g. Fiddle Leaf Fig" type="text" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Scientific Name</label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm italic" placeholder="e.g. Ficus lyrata" type="text" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Brief Description</label>
                        <textarea className="form-input rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm" placeholder="Describe the plant's appearance and origin..." rows={3}></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Section: Care Requirements */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4CAF50]">water_drop</span>
                      Care Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Light Requirement</label>
                        <select className="form-select rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm">
                          <option value="">Select exposure...</option>
                          <option>Full Sun</option>
                          <option>Bright Indirect</option>
                          <option>Partial Shade</option>
                          <option>Low Light</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Watering Frequency</label>
                        <select className="form-select rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm">
                          <option value="">Select frequency...</option>
                          <option>Daily</option>
                          <option>Every 2-3 days</option>
                          <option>Weekly</option>
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Humidity Level</label>
                        <div className="flex items-center gap-3">
                          <input className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]" type="range" />
                          <span className="text-xs font-bold text-slate-500">60%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Care Tips & Troubleshooting</label>
                        <textarea className="form-input rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-[#4CAF50] focus:ring-[#4CAF50] w-full p-3 text-sm" placeholder="Mention common issues like leaf browning, pests, or fertilizer needs..." rows={4}></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Media Upload */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex-1">
                    <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4CAF50]">image</span>
                      Plant Media
                    </h3>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-[#4CAF50] transition-colors group cursor-pointer">
                      <div className="size-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center text-[#4CAF50] mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Click to upload image</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 text-center">PNG, JPG or WEBP up to 5MB (1:1 aspect ratio recommended)</p>
                      <input className="hidden" type="file" />
                    </div>
                    <div className="mt-6">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preview</p>
                      <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 overflow-hidden">
                        <span className="material-symbols-outlined text-6xl opacity-20">filter_vintage</span>
                      </div>
                    </div>
                  </div>

                  {/* Visibility Card */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-bold text-sm">Publish Immediately</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Available in library once saved</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4CAF50]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action Buttons Mobile */}
              <div className="flex md:hidden gap-3 mt-8 pb-10">
                <button onClick={() => navigate('/app/admin/plants')} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm">Cancel</button>
                <button onClick={() => navigate('/app/admin/plants')} className="flex-2 px-8 py-3 rounded-xl bg-[#4CAF50] text-white font-bold text-sm">Save Plant</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminAddPlant;
