import React from 'react';
import { useNavigate } from 'react-router-dom';

const DiagnosisResult = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f8f8] dark:bg-[#10221f] font-['Manrope'] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-20 py-3">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100 cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-6 text-[#2beecd]">
                  <span className="material-symbols-outlined text-3xl">potted_plant</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">DeskBoost</h2>
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <button onClick={() => navigate('/app/dashboard')} className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Dashboard</button>
                <button onClick={() => navigate('/app/my-plants')} className="text-slate-900 dark:text-slate-100 border-b-2 border-[#2beecd] text-sm font-medium pb-1">My Plants</button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Diagnosis</button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-[#2beecd] transition-colors text-sm font-medium">Care Guides</button>
              </nav>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-slate-100 dark:bg-slate-800">
                  <div className="text-slate-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-500 px-4 text-base font-normal" placeholder="Search plants..." />
                </div>
              </label>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-10 flex items-center justify-center overflow-hidden border-2 border-[#2beecd]/20">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkIZWFIXa2et8OSD3KJ8UgcofMLirW7HWtIfsnIpG66xS10JVw_zw4CnNSJBFZ7NdQ4C6m-__gqPFmFRhpzUxrn_2FN7SFzbKarxGg6c4IJISDH2BOdmLPjuSW0RssOyhYGwjMQk1LLg19WK433TGHbrF-_U-BOq6s1fKA6VWcFZQ1RBFC9fLheH4eOd9qd83J2NhHQumtd7a2UfIz52vrwNrQuMYHU8LvAq7dtPukxK8FelhTWR8p3j22zr-Pq9c_90YrA1-W1f4" />
              </div>
            </div>
          </header>

          <main className="flex flex-1 justify-center py-8 px-4 md:px-20">
            <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <button onClick={() => navigate('/')} className="hover:text-[#2beecd]">Home</button>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <button onClick={() => navigate('/app/my-plants')} className="hover:text-[#2beecd]">My Plants</button>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">Diagnosis Result</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Diagnosis Result</h1>
                <p className="text-slate-600 dark:text-slate-400">AI-powered health analysis for your Pothos (Epipremnum aureum)</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4iFXL2KqCBLuuXTq8a3VlKX5NTZygB-QcQL74BGdom6ETYe1cp5FkIaQMPIHdym4bPYALTI3JgY4ng7WUjC4btPAX3IhZc6P_wnshTN-OijSu0WL4VZSlXdtF6zaSnsoVJ_eZ6tCtQewT9DRf7SoA8GEK7UP_mEibx4QtBzqpwJRc3-vWPcVCF8SKQZ53rMaI0u6z7g_OKRtkzavIb5bsJJs0dpM3guqbKwcnG808iNguP7TUGxIDgqn-soY66z6xXGy02vCQLWE" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-2 bg-yellow-400/90 text-slate-900 px-3 py-1 rounded-full text-sm font-bold w-fit mb-2">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Anomally Detected
                      </div>
                      <p className="text-white text-xl font-bold">Yellowing Leaves Area</p>
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-dashed border-[#2beecd] rounded-full animate-pulse flex items-center justify-center">
                      <span className="bg-[#2beecd]/20 text-[#2beecd] text-[10px] font-bold px-1 rounded uppercase tracking-wider">Analysis Zone</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Analysis Summary</h3>
                      <span className="text-xs font-bold text-[#2beecd] uppercase tracking-widest bg-[#2beecd]/10 px-2 py-1 rounded">94% Match</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                      <span className="material-symbols-outlined text-red-500 mt-1">error</span>
                      <div>
                        <p className="font-bold text-red-700 dark:text-red-400">Overwatering Detected</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">The yellowing patterns and leaf texture suggest root suffocation due to excessive moisture levels in the soil substrate.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-[#2beecd]">psychology</span>
                      <h3 className="font-bold text-lg">Possible Causes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="material-symbols-outlined text-slate-400">water_drop</span>
                        <p className="text-sm">Soil remains damp for more than 7 days</p>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="material-symbols-outlined text-slate-400">layers_clear</span>
                        <p className="text-sm">Inadequate drainage in the pot</p>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="material-symbols-outlined text-slate-400">light_mode</span>
                        <p className="text-sm">Low light levels reducing evaporation</p>
                      </div>
                      <div className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                        <p className="text-sm">Watering on a strict schedule, not by need</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-[#2beecd]">medical_services</span>
                      <h3 className="font-bold text-lg">Treatment Suggestions</h3>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="bg-[#2beecd]/20 text-[#2beecd] rounded-full p-1 mt-0.5">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Reduce watering frequency</p>
                          <p className="text-xs text-slate-500">Wait until the top 2 inches of soil are dry before watering again.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#2beecd]/20 text-[#2beecd] rounded-full p-1 mt-0.5">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Relocate for better light</p>
                          <p className="text-xs text-slate-500">Move the plant to a brighter spot with indirect sunlight to help use excess water.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#2beecd]/20 text-[#2beecd] rounded-full p-1 mt-0.5">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Check drainage holes</p>
                          <p className="text-xs text-slate-500">Ensure the pot allows water to escape freely. Consider repotting if soil is compacted.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#2beecd]/10 border border-[#2beecd]/20 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-[#2beecd]">assignment</span>
                      <h3 className="font-bold text-lg">Care Instructions Checklist</h3>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-5 h-5 rounded border-slate-300 text-[#2beecd] focus:ring-[#2beecd] bg-white" type="checkbox" />
                        <span className="text-sm group-hover:text-[#2beecd] transition-colors">Prune severely yellowed leaves to save energy</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-5 h-5 rounded border-slate-300 text-[#2beecd] focus:ring-[#2beecd] bg-white" type="checkbox" />
                        <span className="text-sm group-hover:text-[#2beecd] transition-colors">Aerate soil with a chopstick to allow roots to breathe</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-5 h-5 rounded border-slate-300 text-[#2beecd] focus:ring-[#2beecd] bg-white" type="checkbox" />
                        <span className="text-sm group-hover:text-[#2beecd] transition-colors">Stop fertilizing until new healthy growth appears</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input className="w-5 h-5 rounded border-slate-300 text-[#2beecd] focus:ring-[#2beecd] bg-white" type="checkbox" />
                        <span className="text-sm group-hover:text-[#2beecd] transition-colors">Monitor moisture level daily for the next week</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <button onClick={() => navigate('/app/my-plants/1/profile')} className="flex-1 bg-[#2beecd] hover:bg-[#2beecd]/90 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">person</span>
                      Back to Plant Profile
                    </button>
                    <button onClick={() => navigate('/app/my-plants/1/analyze')} className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">restart_alt</span>
                      Analyze Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-6 md:px-20 mt-12">
            <div className="max-w-[1024px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-xl">potted_plant</span>
                <span className="text-sm font-medium">© 2024 DeskBoost AI Plant Care</span>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                <a className="hover:text-[#2beecd]" href="#">Privacy Policy</a>
                <a className="hover:text-[#2beecd]" href="#">Terms of Service</a>
                <a className="hover:text-[#2beecd]" href="#">Help Center</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
