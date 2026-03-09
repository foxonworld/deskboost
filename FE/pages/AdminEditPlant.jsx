import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditPlant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] font-['Manrope'] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-40 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100 cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-8 flex items-center justify-center bg-[#2beecd] rounded-lg">
                  <span className="material-symbols-outlined text-[#10221f] text-xl">potted_plant</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">DeskBoost Admin</h2>
              </div>
              <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-slate-500 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-xl">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-800 focus:ring-0 h-full placeholder:text-slate-500 px-4 rounded-r-xl text-sm font-normal" placeholder="Search plants..." />
                </div>
              </label>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8">
              <nav className="hidden lg:flex items-center gap-8">
                <button onClick={() => navigate('/app/admin')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Dashboard</button>
                <button onClick={() => navigate('/app/admin/plants')} className="text-[#2beecd] text-sm font-semibold">Plants</button>
                <button onClick={() => navigate('/app/admin/users')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Users</button>
                <button onClick={() => navigate('/app/admin/settings')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Settings</button>
              </nav>
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#2beecd]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7JtxsPGerkVJEWFIcYbaDOOPRqrvX8hsgBFt_Xjz3tskekbohH7SE00ayJpaTVWFC4Oyau30yYoKRcQ9LmY4b6a0gTMhn2C5futAiWhgSEhnwyJlYCP9VG8dndrV1iHLWx43rMU3fZ-CK_6p18yUWgQcPQbM_8HVhFWLSN2qpH8VnsQaUWcmCyiGEF3jrqBbMZ00-jyLjI9nPn0pRCbdFttZm8osxL7Zo4zNtPO72BGCIxoMF-I9ufMtdFzenySUDALrqdoBZbPg")' }}></div>
              </div>
            </div>
          </header>

          <main className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] px-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button onClick={() => navigate('/app/admin')} className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-[#2beecd]">Dashboard</button>
                <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                <button onClick={() => navigate('/app/admin/plants')} className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-[#2beecd]">Plants</button>
                <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Edit Plant</span>
              </div>

              <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-2">
                  <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-extrabold tracking-tight">Edit Monstera Deliciosa</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base">Modify species properties and maintenance guidelines for the office directory.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center justify-center rounded-xl h-11 px-6 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined mr-2 text-lg">visibility</span>
                    Preview
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#2beecd]">info</span>
                      General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Common Name</label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full h-12 text-sm" type="text" defaultValue="Monstera Deliciosa" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Scientific Name</label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full h-12 text-sm italic" type="text" defaultValue="Monstera deliciosa Liebm." />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Short Description</label>
                        <textarea className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full text-sm" rows={3} defaultValue="The Swiss cheese plant is a species of flowering plant native to tropical forests of southern Mexico, south to Panama." />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#2beecd]">eco</span>
                      Care Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">wb_sunny</span> Light Requirement
                        </label>
                        <select className="form-select rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full h-12 text-sm">
                          <option>Bright Indirect Light</option>
                          <option>Direct Sunlight</option>
                          <option>Medium Light</option>
                          <option>Low Light</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">water_drop</span> Water Frequency
                        </label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full h-12 text-sm" type="text" defaultValue="Every 1-2 weeks" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">humidity_mid</span> Humidity Level
                        </label>
                        <input className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full h-12 text-sm" type="text" defaultValue="High (above 60%)" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Detailed Care Instructions</label>
                        <textarea className="form-input rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-[#2beecd] focus:ring-[#2beecd] w-full text-sm" rows={5} defaultValue="Water your Monstera when the top 2-3 inches of soil feel dry. They love to climb, so providing a moss pole will help them grow larger leaves with more fenestrations. Avoid direct hot afternoon sun which can scorch the leaves." />
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#2beecd]">image</span>
                      Plant Image
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkDYf3lIh84YXVCL1drnlCtbUhF_ktjIskZi48uiRlwv-Sk5bLbwqwcM4YtTt6TSv8yPQIvmFDyqj6FusYlnLmbANPAEozrHpRTqsf3P7OpElxUbUJFm75CCrU6PPvFovCzUPZx6Pm4oKCE8EAsrcwsyfVEBNqgwk-uDDOkBXeycRgHUNa7Fw9ckK8Fiz_oc26RhVagxIiK4H4OgivoP9f_vtmfCHmQET2CVAoJz_3zEwJuqIRJW1t20LADY8T9Nfp-7pVLGXkstE" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="bg-white text-slate-900 rounded-lg p-2 hover:bg-[#2beecd] hover:text-white transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="bg-white text-red-500 rounded-lg p-2 hover:bg-red-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">cloud_upload</span>
                        Change Image
                      </button>
                    </div>
                  </section>

                  <div className="space-y-3">
                    <button onClick={() => navigate('/app/admin/plants')} className="w-full bg-[#2beecd] hover:bg-[#2beecd]/90 text-[#10221f] py-4 rounded-xl font-bold shadow-lg shadow-[#2beecd]/20 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">save</span>
                      Save Changes
                    </button>
                    <button onClick={() => navigate('/app/admin/plants')} className="w-full bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">delete_forever</span>
                      Delete Plant
                    </button>
                  </div>
                </div>
              </div>

              <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                <p>© 2024 DeskBoost System. All rights reserved.</p>
                <div className="flex gap-6">
                  <a className="hover:text-[#2beecd] transition-colors" href="#">Documentation</a>
                  <a className="hover:text-[#2beecd] transition-colors" href="#">API Reference</a>
                  <a className="hover:text-[#2beecd] transition-colors" href="#">Support</a>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPlant;
