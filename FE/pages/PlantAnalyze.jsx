import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';

const PlantAnalyze = () => {
  const { id } = useParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <UserLayout>
      <div className="p-8 max-w-7xl mx-auto w-full space-y-10 pb-20">
        <nav className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/app/my-plants" className="hover:text-[#4CAF50] transition-colors">Jungle</Link> 
          <span className="opacity-30">/</span> 
          <span className="dark:text-white text-slate-900 uppercase">Interactive Diagnosis</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Bio-Metric Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium italic">Synchronizing with neural care networks...</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4CAF50]">photo_camera</span> Visual Evidence
              </h3>
              <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] p-16 flex flex-col items-center justify-center gap-6 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 hover:border-[#4CAF50] transition-all cursor-pointer group relative overflow-hidden">
                <div className="size-24 rounded-3xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center text-[#4CAF50] group-hover:scale-110 group-hover:bg-[#4CAF50] group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-5xl">biotech</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Capture Data</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Initialize Optical Sensor</p>
                </div>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Observable Anomalies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Chlorosis', 'Tip Decoupling', 'Gravity Core Fail', 'Parasitic Presence', 'Substrate Decay', 'Other'].map((s, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-50 dark:border-slate-800 hover:border-[#4CAF50] hover:bg-[#4CAF50]/5 transition-all gap-3 bg-slate-50/30 group">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#4CAF50] transition-colors text-3xl">emergency</span>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest text-center leading-tight">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-[#4CAF50] text-white h-20 rounded-[32px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-[#4CAF50]/30 flex items-center justify-center gap-4 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-4">
                  <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Scanning...</span>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl group-hover:rotate-180 transition-transform duration-700">settings_suggest</span> 
                  Initialize Scan
                </>
              )}
            </button>
          </div>

          <div className="relative">
            {showResult ? (
              <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 sticky top-24">
                <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-[#4CAF50]/5">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#4CAF50] text-3xl">verified</span> Intelligence Report
                  </h3>
                  <div className="px-5 py-2 bg-[#4CAF50] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#4CAF50]/20">Match: 98%</div>
                </div>
                <div className="p-10 space-y-10">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anomalous Detection</span>
                    <div className="flex justify-between items-start bg-red-50/30 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/50">
                      <div>
                        <h4 className="text-4xl font-black text-red-500 uppercase tracking-tighter">Hyper-Hydration</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed italic">Substrate moisture exceeds component tolerance.</p>
                      </div>
                      <div className="size-20 rounded-[24px] bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-500/20">
                        <span className="material-symbols-outlined text-5xl">water_off</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rectification Protocol</span>
                    <div className="space-y-6">
                      {[
                        { step: 'A-1', title: 'Cease Resource Input', text: 'Suspend all hydration cycles immediately. Predicted recovery window: 144 hours.' },
                        { step: 'A-2', title: 'Audit Drainage Ports', text: 'Verify unobstructed flow from baseline orifices to prevent root decay acceleration.' }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-6 group">
                          <div className={`size-12 rounded-2xl flex items-center justify-center font-black shrink-0 text-xs shadow-lg ${i === 0 ? 'bg-[#4CAF50] text-white shadow-[#4CAF50]/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{step.step}</div>
                          <div className="space-y-1">
                            <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{step.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-[#4CAF50]/5 rounded-[32px] flex items-center justify-between gap-6 border border-[#4CAF50]/10">
                    <div className="flex items-center gap-4">
                      <div className="size-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#4CAF50] shadow-sm">
                        <span className="material-symbols-outlined text-3xl">add_alert</span>
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-widest dark:text-white">Autopilot Care</p>
                        <p className="text-xs text-slate-400 font-bold">Schedule re-scan in 5 days?</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4CAF50] transition-all shadow-xl shadow-black/10">Initialize Timer</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center p-16 text-center space-y-6 text-slate-300 dark:text-slate-700 bg-slate-50/10 transition-colors hover:border-slate-200">
                <span className="material-symbols-outlined text-9xl opacity-10 animate-pulse">biotech</span>
                <p className="text-xl font-black uppercase tracking-[0.3em]">Awaiting Data</p>
                <p className="text-xs max-w-[200px] font-black uppercase tracking-widest opacity-40 leading-loose">The artificial mind is ready to process your botanical concerns.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PlantAnalyze;
