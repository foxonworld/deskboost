import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UserLayout from '../components/UserLayout';
import { diagnosePlant } from '../services/aiApi';
import { Spinner, StateNotice } from '../components/UiState';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, usePrefersReducedMotion } from '../utils/motion';

gsap.registerPlugin(useGSAP);

const captureTips = [
  'Chụp rõ vùng lá/thân có dấu hiệu bất thường.',
  'Ưu tiên ánh sáng tự nhiên, tránh ảnh quá tối hoặc lóa.',
  'Nếu có thể, chụp thêm nền đất/chậu để AI hiểu ngữ cảnh chăm sóc.',
];

const defaultRecommendations = ['Kiểm tra độ ẩm đất trước khi tưới.', 'Đặt cây ở nơi sáng gián tiếp.', 'Theo dõi mặt dưới lá trong 3–5 ngày.'];

const AIPlantAnalysis = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-analysis-page"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.md);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion] });

  useGSAP(() => {
    const items = gsap.utils.toArray('[data-motion="ai-analysis-state"]');
    if (!items.length) return;

    const vars = getRevealVars(reducedMotion, motionDistances.sm);
    gsap.fromTo(items, vars.from, vars.to);
  }, { scope: rootRef, dependencies: [reducedMotion, Boolean(selectedImage), isAnalyzing, Boolean(result)] });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const loadImageFile = (file) => {
    setError('');
    setResult(null);
    if (!file?.type?.startsWith('image/')) {
      setError('Vui lòng chọn đúng định dạng ảnh cây.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh cần nhỏ hơn hoặc bằng 5MB để phân tích ổn định.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.onerror = () => setError('Chưa đọc được ảnh. Hãy thử chọn ảnh khác.');
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
      setError('Hãy tải ảnh cây trước khi phân tích.');
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
      setError(err?.message || 'Chưa phân tích được ảnh. Hãy thử lại với ảnh rõ hơn.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError('');
  };

  return (
    <UserLayout>
      <div ref={rootRef} className="mx-auto max-w-6xl space-y-6 p-4 pb-24 sm:p-6 md:p-8">
        <Card data-motion="ai-analysis-page" radius="hero" padding="feature" className="overflow-hidden bg-gradient-to-br from-white via-[#F7FBF5] to-[#EEF7EC] dark:from-surface-dark dark:via-[#102116] dark:to-[#0B1510]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="primary" icon="health_and_safety">AI chẩn đoán cây</Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-text-main dark:text-white sm:text-4xl">
                Gửi ảnh cây để nhận nhận định chăm sóc rõ ràng, bình tĩnh.
              </h1>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300 sm:text-base">
                DeskBoost AI phân tích ảnh trong phạm vi chăm cây: dấu hiệu lá/thân/đất, nguyên nhân khả dĩ và bước chăm sóc tiếp theo. Không thay đổi contract backend/API.
              </p>
            </div>
            <div className="grid gap-2 text-xs font-bold text-text-secondary dark:text-slate-300 sm:min-w-72">
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">Ảnh image · tối đa 5MB</span>
              <span className="rounded-2xl border border-primary/15 bg-white/70 px-4 py-3 dark:bg-white/5">Plant-care only · không tư vấn ngoài phạm vi</span>
            </div>
          </div>
        </Card>

        {error && <StateNotice tone="error">{error}</StateNotice>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-5 lg:col-span-2">
            <Card data-motion="ai-analysis-state" padding="none" radius="hero" className="overflow-hidden">
              <div
                className={`relative min-h-[360px] border-2 border-dashed p-4 text-center transition-all sm:min-h-[430px] sm:p-6 ${dragActive ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedImage ? (
                  <div className="grid h-full min-h-[330px] gap-4 lg:grid-cols-[1fr_260px]">
                    <div className="relative overflow-hidden rounded-3xl bg-[#0B1510]">
                      <img src={selectedImage} alt="Ảnh cây đã chọn để AI phân tích" className="h-full min-h-[330px] w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Xóa ảnh đã chọn"
                        onClick={handleRemoveImage}
                        className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200"
                      >
                        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                      </button>
                    </div>
                    <div className="flex flex-col justify-between rounded-3xl border border-[#E4EEE6] bg-[#FAFCF8] p-5 text-left dark:border-[#2A4532] dark:bg-white/5">
                      <div>
                        <Badge tone="success" icon="image">Preview ready</Badge>
                        <h2 className="mt-4 text-xl font-extrabold text-text-main dark:text-white">Ảnh đã sẵn sàng</h2>
                        <p className="mt-2 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                          Kiểm tra ảnh có đủ rõ phần cần chẩn đoán trước khi gửi. Kết quả sẽ hiện bên dưới vùng upload.
                        </p>
                      </div>
                      <Button type="button" onClick={handleAnalyze} disabled={isAnalyzing} loading={isAnalyzing} className="mt-5 w-full">
                        {isAnalyzing ? 'Đang phân tích' : 'Phân tích ảnh cây'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl bg-[#FAFCF8] px-5 py-10 dark:bg-white/5">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-4xl" aria-hidden="true">add_photo_alternate</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-extrabold text-text-main dark:text-white">Tải ảnh cây lên</h3>
                    <p className="mt-3 max-w-md text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                      Kéo thả ảnh vào đây hoặc chọn từ thiết bị. Ảnh rõ giúp AI đưa ra gợi ý chăm sóc đáng tin hơn.
                    </p>
                    <label className="mt-6 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark focus-within:ring-4 focus-within:ring-primary/25">
                      Chọn ảnh cây
                      <input type="file" className="sr-only" onChange={(e) => loadImageFile(e.target.files?.[0])} accept="image/*" />
                    </label>
                    <p className="mt-4 text-xs font-bold text-text-secondary dark:text-slate-400">Hỗ trợ image file · tối đa 5MB</p>
                  </div>
                )}
              </div>
            </Card>

            {selectedImage && !isAnalyzing && !result && (
              <StateNotice tone="info" className="text-sm">
                Ảnh đã được tải lên. Nhấn “Phân tích ảnh cây” để gửi qua AI diagnosis service.
              </StateNotice>
            )}

            {isAnalyzing && (
              <Card data-motion="ai-analysis-state" radius="hero" padding="feature" className="border-primary/20 bg-primary/5 dark:bg-primary/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm dark:bg-white/10">
                    <Spinner />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-text-main dark:text-white">AI đang đọc dấu hiệu trên ảnh...</h2>
                    <p className="mt-1 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                      Đang kiểm tra vùng lá/thân/đất và chuẩn bị gợi ý chăm sóc theo hướng an toàn, không gây hoang mang.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {result && (
              <Card data-motion="ai-analysis-state" radius="hero" padding="feature" className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge tone="success" icon="check_circle">Đã có nhận định</Badge>
                    <h2 className="mt-3 text-2xl font-extrabold text-text-main dark:text-white">Tóm tắt tình trạng cây</h2>
                  </div>
                  {result.source && <Badge tone="warning">Source: {result.source}</Badge>}
                </div>
                <p className="text-base font-medium leading-7 text-text-secondary dark:text-slate-300">
                  {result.summary || 'AI diagnosis fallback đang hoạt động. Dùng các khuyến nghị dưới đây như checklist chăm sóc ban đầu.'}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(result.recommendations || defaultRecommendations).map((item, idx) => (
                    <div key={item} className="rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-4 dark:border-[#2A4532] dark:bg-white/5">
                      <p className="text-xs font-extrabold text-primary">Bước {idx + 1}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-text-main dark:text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card radius="hero" padding="feature">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">verified</span>
                <h3 className="text-lg font-extrabold text-text-main dark:text-white">Ảnh tốt giúp kết quả tốt hơn</h3>
              </div>
              <div className="mt-5 space-y-4">
                {captureTips.map((desc, index) => (
                  <div key={desc} className="flex gap-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                    <span className="mt-0.5 font-extrabold text-primary">0{index + 1}</span>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card radius="hero" padding="feature" className="bg-gradient-to-br from-[#F0FDF4] to-[#E8F5E9] dark:from-primary/10 dark:to-[#2E7D32]/10">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-base" aria-hidden="true">lightbulb</span>
                <span className="text-sm font-extrabold">Gợi ý đọc kết quả</span>
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary dark:text-slate-300">
                Kết quả AI là hỗ trợ chăm sóc ban đầu. Nếu cây tiếp tục xấu đi, hãy chụp lại sau vài ngày hoặc hỏi AI Chat với ngữ cảnh cây cụ thể.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIPlantAnalysis;
