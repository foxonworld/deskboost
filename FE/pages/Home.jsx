import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '../components/Navbar';
import ChatbotWidget from '../components/ChatbotWidget';
import { useCare } from '../context/CareContext';
import { PLANTS, formatVND } from '../data/mockData';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getRevealVars, motionDistances, motionDurations, motionEasings, usePrefersReducedMotion } from '../utils/motion';

gsap.registerPlugin(useGSAP);

const careWorkflow = [
  {
    icon: 'photo_camera',
    title: 'Gửi tín hiệu từ cây',
    text: 'Chụp ảnh lá, đất hoặc ghi chú triệu chứng để AI có ngữ cảnh chăm sóc rõ hơn.',
  },
  {
    icon: 'psychology',
    title: 'AI đọc vấn đề',
    text: 'DeskBoost gợi ý nguyên nhân thường gặp: thiếu sáng, thừa nước, sâu bệnh hoặc stress môi trường.',
  },
  {
    icon: 'event_available',
    title: 'Biến thành lịch chăm',
    text: 'Nhắc tưới, quan sát và theo dõi theo từng cây thay vì chăm theo cảm tính.',
  },
];

const trustSignals = [
  { value: 'Contact-only', label: 'Xem cây, hỏi tư vấn, chốt qua kênh liên hệ' },
  { value: 'AI hỗ trợ', label: 'Không thay chuyên gia, nhưng giúp bạn biết bước tiếp theo' },
  { value: 'Xác minh tay', label: 'Feedback được ghi nhận thủ công, tránh cảm giác review ảo' },
];

const Home = () => {
  const { pendingTasks } = useCare();
  const navigate = useNavigate();
  const [activeActivityIndex, setActiveActivityIndex] = React.useState(0);
  const rootRef = React.useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (pendingTasks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveActivityIndex((prev) => (prev + 1) % pendingTasks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pendingTasks.length]);

  useGSAP(() => {
    const heroItems = gsap.utils.toArray('[data-motion="home-hero"]');
    const sectionItems = gsap.utils.toArray('[data-motion="home-section"]');

    if (heroItems.length) {
      const vars = getRevealVars(reducedMotion, motionDistances.lg);
      gsap.fromTo(heroItems, vars.from, {
        ...vars.to,
        duration: reducedMotion ? motionDurations.reduced : motionDurations.slow,
        ease: motionEasings.emphasized,
      });
    }

    if (sectionItems.length) {
      const vars = getRevealVars(reducedMotion, motionDistances.md);
      gsap.fromTo(sectionItems, vars.from, vars.to);
    }
  }, { scope: rootRef, dependencies: [reducedMotion] });

  const currentTask = pendingTasks[activeActivityIndex] || {
    plantName: 'Cây bàn làm việc',
    taskLabel: 'Quan sát độ ẩm và ánh sáng',
    dueTime: 'Hôm nay',
    urgency: 'upcoming',
    plantEmoji: '🌿',
  };

  const urgencyConfig = {
    overdue: { tone: 'danger', label: 'Cần xử lý', icon: 'notification_important' },
    today: { tone: 'warning', label: 'Hôm nay', icon: 'schedule' },
    upcoming: { tone: 'primary', label: 'Sắp tới', icon: 'event' },
  };

  const cfg = urgencyConfig[currentTask.urgency] || urgencyConfig.upcoming;
  const featuredPlants = PLANTS.slice(0, 3);

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-background-light text-text-main antialiased dark:bg-background-dark dark:text-white">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="relative border-b border-[#E4EEE6] dark:border-[#2A4532]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,175,80,0.16),transparent_34%),linear-gradient(135deg,rgba(255,248,238,0.9),transparent_42%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(76,175,80,0.14),transparent_34%),linear-gradient(135deg,rgba(23,42,31,0.9),transparent_42%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_0.92fr] lg:py-24">
            <div className="flex max-w-3xl flex-col items-start gap-7">
              <span data-motion="home-hero">
                <Badge tone="primary" size="md" icon="eco">
                  AI-assisted desk plant care
                </Badge>
              </span>
              <div data-motion="home-hero" className="space-y-5">
                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-text-main dark:text-white md:text-6xl lg:text-7xl">
                  Chăm cây bàn làm việc bằng AI, không cần phức tạp.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-text-secondary dark:text-slate-300 md:text-xl">
                  DeskBoost giúp bạn chọn cây phù hợp, nhận nhắc chăm sóc đúng lúc và hỏi AI khi cây có dấu hiệu bất thường — trong một trải nghiệm bình tĩnh, rõ ràng, đáng tin.
                </p>
              </div>

              <div data-motion="home-hero" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button to="/plants" size="lg" className="w-full sm:w-auto">
                  Khám phá marketplace
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/app/ai-chat')}
                  className="w-full sm:w-auto"
                >
                  Thử AI chăm cây
                </Button>
              </div>

              <div data-motion="home-hero" className="grid w-full gap-3 sm:grid-cols-3">
                {trustSignals.map((item) => (
                  <div key={item.value} className="rounded-2xl border border-[#E4EEE6] bg-white/70 p-4 shadow-sm backdrop-blur dark:border-[#2A4532] dark:bg-white/5">
                    <p className="text-sm font-extrabold text-text-main dark:text-white">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-motion="home-hero" className="relative">
              <Card variant="elevated" padding="none" radius="hero" className="overflow-hidden">
                <div className="relative aspect-[4/3] min-h-[320px] bg-slate-100 dark:bg-slate-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzaus0c0LOhf2NX2DHlSrgoj7WJftqhZWnq2AaXvZGH_juFX-tzXsGtxKpiUTKI7o1qep8M-_mblF5fLwbfUAZBkbXNAwgdif6Fbd_TTDmR3Fn4bwl0C_sxr66ytyPsaniXtPwZovv8Jj2hG-6jQRdKjFy4Qi9xY456Jx4mhj-YhMXZQom8xGz0E9YuDuNOy_Q7EbzlxZ1eDTQLLSET3rEsIWX0QNNd0-56C2eO61nuFnUF_4wxoXrJY9-HR7VgsF4XTBDdH0Ytpg"
                    alt="Bàn làm việc có cây xanh và ánh sáng tự nhiên"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => navigate('/app/settings')}
                    className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/25 bg-white/85 p-4 text-left shadow-xl backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary/30 active:translate-y-0 dark:border-white/10 dark:bg-slate-950/75 dark:hover:bg-slate-950 md:left-auto md:w-72"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-xl dark:bg-primary/15">
                        {currentTask.plantEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <Badge tone={cfg.tone} icon={cfg.icon}>{cfg.label}</Badge>
                          <span className="material-symbols-outlined text-base text-text-secondary dark:text-slate-400" aria-hidden="true">arrow_forward</span>
                        </div>
                        <p className="mt-2 truncate text-sm font-extrabold text-text-main dark:text-white">{currentTask.plantName}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-text-secondary dark:text-slate-400">{currentTask.taskLabel} · {currentTask.dueTime}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge tone="neutral" size="md">Vấn đề → giải pháp</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                Cây không chết vì bạn bận. Cây chết vì thiếu tín hiệu đúng lúc.
              </h2>
              <p className="text-base leading-7 text-text-secondary dark:text-slate-300">
                DeskBoost chuyển việc chăm cây từ đoán mò sang một vòng lặp rõ ràng: chọn đúng cây, quan sát đúng dấu hiệu, hỏi AI khi cần và nhắc chăm sóc theo lịch.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: 'light_mode', title: 'Chọn theo môi trường', text: 'Ánh sáng, diện tích bàn, thói quen tưới và mức kinh nghiệm.' },
                { icon: 'health_and_safety', title: 'Chăm theo trạng thái', text: 'Tập trung vào dấu hiệu cây thật thay vì mẹo chăm sóc chung chung.' },
                { icon: 'forum', title: 'Liên hệ trước khi mua', text: 'Marketplace giữ vai trò tư vấn và kết nối, không biến thành checkout.' },
                { icon: 'verified', title: 'Tin cậy qua phản hồi', text: 'Feedback xác minh thủ công giúp câu chuyện chăm cây thực tế hơn.' },
              ].map((item) => (
                <Card key={item.title} padding="feature" interactive className="bg-white/80 dark:bg-white/5">
                  <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-extrabold text-text-main dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-slate-400">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="border-y border-[#E4EEE6] bg-surface-light py-14 dark:border-[#2A4532] dark:bg-surface-dark md:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <Badge tone="primary" size="md" icon="smart_toy">AI care workflow</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                Một luồng chăm cây đủ nhẹ cho bàn làm việc.
              </h2>
              <p className="mt-4 text-base leading-7 text-text-secondary dark:text-slate-300">
                AI xuất hiện như trợ lý chăm cây có ngữ cảnh — không phô diễn, không thay bạn, chỉ giúp quyết định bước tiếp theo nhanh hơn.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {careWorkflow.map((step, index) => (
                <Card key={step.title} padding="feature" radius="hero" interactive className="relative overflow-hidden bg-white dark:bg-background-dark">
                  <div className="absolute right-5 top-5 text-6xl font-extrabold text-primary/10">0{index + 1}</div>
                  <div className="relative">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
                      <span className="material-symbols-outlined text-3xl" aria-hidden="true">{step.icon}</span>
                    </div>
                    <h3 className="mt-8 text-xl font-extrabold text-text-main dark:text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary dark:text-slate-400">{step.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <Badge tone="neutral" size="md">Contact-only marketplace</Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                  Xem cây như một catalog tư vấn, không phải giỏ hàng.
                </h2>
                <p className="mt-3 text-base leading-7 text-text-secondary dark:text-slate-300">
                  Bạn xem cây phù hợp bàn làm việc, kiểm tra mức chăm sóc và liên hệ để được tư vấn. DeskBoost không xử lý thanh toán trong app.
                </p>
              </div>
              <Button to="/plants" variant="secondary" className="w-full md:w-auto">
                Xem tất cả cây
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featuredPlants.map((plant) => (
                <Card key={plant.id} padding="none" interactive className="group overflow-hidden bg-white dark:bg-surface-dark">
                  <Link to={`/plants/${plant.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-text-main dark:text-white">{plant.name}</h3>
                        <p className="mt-1 text-sm text-text-secondary dark:text-slate-400">Phù hợp bàn làm việc, dễ hỏi tư vấn trước khi chọn.</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-extrabold text-primary">{formatVND(plant.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="primary">Dễ chăm</Badge>
                      <Badge tone="neutral">Liên hệ tư vấn</Badge>
                    </div>
                    <Button to={`/plants/${plant.id}`} variant="secondary" size="sm" className="w-full">
                      Xem chi tiết liên hệ
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="bg-slate-950 py-14 text-white md:py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge tone="overlay" size="md" icon="verified">Trust-first care</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Sự tin cậy đến từ hỗ trợ thật, không phải hiệu ứng bán hàng.
              </h2>
              <p className="text-base leading-7 text-slate-300">
                DeskBoost ưu tiên tư vấn trước mua, chăm sóc sau mua và phản hồi đã xác minh. Trải nghiệm được thiết kế để mentor và người dùng thấy rõ một MVP có kỷ luật.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: 'support_agent', title: 'Tư vấn trước mua', text: 'Chọn cây theo điều kiện bàn làm việc.' },
                { icon: 'fact_check', title: 'Feedback xác minh', text: 'Ưu tiên phản hồi có ngữ cảnh thật.' },
                { icon: 'potted_plant', title: 'Care support', text: 'AI và nhắc lịch hỗ trợ sau khi chọn cây.' },
              ].map((item) => (
                <Card key={item.title} padding="feature" className="border-white/10 bg-white/5 shadow-none">
                  <span className="material-symbols-outlined text-3xl text-green-300" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section data-motion="home-section" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-10 md:py-20">
          <Card radius="hero" padding="feature" className="overflow-hidden bg-white dark:bg-surface-dark">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <Badge tone="primary" size="md">Bắt đầu nhẹ nhàng</Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-main dark:text-white md:text-4xl">
                  Chọn một cây. Hỏi một câu. Xây một thói quen chăm cây tốt hơn.
                </h2>
                <p className="mt-3 text-base leading-7 text-text-secondary dark:text-slate-300">
                  DeskBoost giữ marketplace đơn giản và dồn trọng tâm vào care experience — nơi AI, nhắc lịch và hỗ trợ liên hệ cùng làm việc cho cây của bạn.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button to="/plants" size="lg">Khám phá marketplace</Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/app/ai-chat')}>Thử AI care</Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="w-full border-t border-[#E4EEE6] bg-white py-10 dark:border-[#2A4532] dark:bg-surface-dark">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">potted_plant</span>
              <span className="text-xl font-extrabold tracking-tight text-text-main dark:text-white">DeskBoost</span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary dark:text-slate-400">
              Premium AI-assisted desk plant care. Marketplace contact-only, care support first.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-text-secondary dark:text-slate-300">
            <Link to="/plants" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">Marketplace</Link>
            <Link to="/app/ai-chat" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">AI care</Link>
            <Link to="/login" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20">Đăng nhập</Link>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
};

export default Home;
