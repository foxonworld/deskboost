import React, { useState } from 'react';
import UserLayout from '../components/UserLayout';
import { diagnosePlant } from '../services/aiApi';
import { Spinner, StateNotice } from '../components/UiState';

const AIPlantAnalysis = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const loadImageFile = (file) => {
    setError('');
    setResult(null);
    if (!file?.type?.startsWith('image/')) {
      setError('Please choose a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.onerror = () => setError('Failed to load image. Try again.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    loadImageFile(e.dataTransfer.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload a plant image first.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      const diagnosis = await diagnosePlant({
        imageBase64: selectedImage,
        question: 'Diagnose this plant image and keep advice plant-care only.',
      });
      setResult(diagnosis);
    } catch (err) {
      setError(err?.message || 'Failed to load diagnosis. Try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <UserLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">AI Plant Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Chẩn đoán ảnh cây qua service AI, fallback mock khi backend chưa sẵn sàng.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-2xl">
            <span className="size-2 rounded-full bg-[#4CAF50] animate-pulse"></span>
            <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest">Plant-care only</span>
          </div>
        </div>

        {error && <StateNotice tone="error">{error}</StateNotice>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div
              className={`relative h-[380px] border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-8 text-center ${dragActive ? 'border-[#4CAF50] bg-[#4CAF50]/5 scale-[0.99]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedImage ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" aria-label="Remove image" onClick={() => { setSelectedImage(null); setResult(null); setError(''); }} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200"><span className="material-symbols-outlined">delete</span></button>
                </div>
              ) : (
                <>
                  <div className="size-20 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center mb-5"><span className="material-symbols-outlined text-4xl">photo_camera</span></div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Tải ảnh cây lên</h3>
                  <p className="text-slate-500 max-w-[280px] mb-6 font-medium text-sm leading-relaxed">Kéo thả hoặc chọn ảnh. Chỉ nhận image file, tối đa 5MB.</p>
                  <label className="bg-[#4CAF50] text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-105 active:scale-95 transition-all focus-within:ring-4 focus-within:ring-[#4CAF50]/20">Choose image<input type="file" className="sr-only" onChange={(e) => loadImageFile(e.target.files?.[0])} accept="image/*" /></label>
                </>
              )}
            </div>

            {selectedImage && <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="w-full py-4 bg-[#4CAF50] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#4CAF50]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/20">{isAnalyzing && <Spinner />}{isAnalyzing ? 'Loading...' : 'Submit'}</button>}

            {result && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#4CAF50]">psychiatry</span><h2 className="font-black text-xl text-slate-900 dark:text-white">Kết quả chẩn đoán</h2></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{result.summary || 'AI diagnosis fallback is active.'}</p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 font-bold">
                  {(result.recommendations || ['Check light exposure.', 'Avoid overwatering.', 'Inspect leaves weekly.']).map((item, idx) => <li key={idx}>• {item}</li>)}
                </ul>
                {result.source && <p className="text-xs font-black uppercase tracking-widest text-amber-600">Source: {result.source}</p>}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"><h3 className="text-base font-black text-slate-900 dark:text-white mb-3">Cách hoạt động</h3><div className="space-y-3">{['Chụp rõ lá/thân bị ảnh hưởng.', 'Gửi ảnh qua aiApi.diagnosePlant.', 'Nhận gợi ý chăm sóc cây, không tư vấn ngoài phạm vi.'].map((desc, i) => <div key={desc} className="flex gap-3 text-sm font-medium text-slate-500"><span className="font-black text-[#4CAF50]">0{i + 1}</span>{desc}</div>)}</div></div>
            <div className="p-4 bg-gradient-to-br from-[#4CAF50]/8 to-emerald-50 dark:from-[#4CAF50]/10 dark:to-emerald-900/10 rounded-2xl border border-[#4CAF50]/15 space-y-2"><div className="flex items-center gap-2 text-[#4CAF50]"><span className="material-symbols-outlined text-base">lightbulb</span><span className="font-black text-sm">Mẹo xịn</span></div><p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Chụp cả mặt trên và dưới lá để tăng chất lượng chẩn đoán.</p></div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIPlantAnalysis;
