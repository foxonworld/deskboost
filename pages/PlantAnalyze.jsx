
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-background-light flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-10 w-full">
        <nav className="flex mb-8 gap-2 text-sm font-medium text-text-secondary">
          <Link to="/app/my-plants">My Jungle</Link> <span>/</span> <span>Analyze</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Doctor Monstera is in session</h1>
          <p className="text-text-secondary text-lg">Upload a photo and select symptoms to get an AI diagnosis.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_a_photo</span> Visual Evidence
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-white transition-all cursor-pointer group">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">Upload Plant Photo</p>
                  <p className="text-sm text-text-secondary">Drag & drop or click to open camera</p>
                </div>
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Observed Symptoms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Yellow Leaves', 'Dry Tips', 'Drooping', 'Pests Visible', 'Moldy Soil', 'Other'].map((s, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-primary transition-all gap-2 bg-gray-50">
                    <span className="material-symbols-outlined text-gray-400">stethoscope</span>
                    <span className="text-sm font-bold">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary hover:bg-primary-dark text-text-main h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : (
                <>
                  <span className="material-symbols-outlined">analytics</span> Run AI Diagnosis
                </>
              )}
            </button>
          </div>

          <div>
            {showResult ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in duration-500">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">medical_services</span> Diagnosis Report
                  </h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">98% Confidence</span>
                </div>
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Primary Issue</span>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-3xl font-black text-red-500">Overwatering</h4>
                        <p className="text-text-secondary mt-1">Detected via yellowing leaves and drooping stems.</p>
                      </div>
                      <div className="size-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">water</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Treatment Plan</span>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Stop watering immediately', text: 'Let the top 2-3 inches of soil dry out completely. This usually takes about 5-7 days.' },
                        { step: 2, title: 'Check drainage', text: 'Ensure the pot has drainage holes. If water sits at the bottom, root rot will accelerate.' }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className={`size-8 rounded-full flex items-center justify-center font-bold shrink-0 ${i === 0 ? 'bg-primary text-text-main' : 'bg-gray-100'}`}>{step.step}</div>
                          <div>
                            <p className="font-bold">{step.title}</p>
                            <p className="text-sm text-text-secondary leading-relaxed mt-1">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">calendar_add_on</span>
                      <div>
                        <p className="font-bold text-sm">Add reminder?</p>
                        <p className="text-xs text-text-secondary">Check soil in 5 days.</p>
                      </div>
                    </div>
                    <button className="bg-text-main text-white px-4 py-2 rounded-lg text-sm font-bold">Set Reminder</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-4 text-gray-400">
                <span className="material-symbols-outlined text-6xl">biotech</span>
                <p className="text-lg font-medium">Ready for diagnosis</p>
                <p className="text-sm max-w-xs">Upload images and select symptoms to get your treatment plan.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantAnalyze;
