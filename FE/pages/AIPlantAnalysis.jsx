import React, { useState, useRef, useEffect } from 'react';
import UserLayout from '../components/UserLayout';

// --- Mock AI Response Function ---
const getMockAIResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('vàng') || msg.includes('yellow') || msg.includes('lá vàng')) {
    return 'Lá vàng thường do **thiếu ánh sáng**, **tưới nước quá nhiều**, hoặc **thiếu dinh dưỡng**.\n\n**Giải pháp:**\n• Kiểm tra độ ẩm đất trước khi tưới – chỉ tưới khi đất khô 2-3cm\n• Di chuyển cây đến nơi có ánh sáng gián tiếp tốt hơn\n• Bổ sung phân bón cân bằng NPK mỗi 2–4 tuần vào mùa sinh trưởng\n\nBạn có thể chia sẻ thêm về loại cây và tần suất tưới không?';
  }
  if (msg.includes('héo') || msg.includes('rủ') || msg.includes('wilting')) {
    return 'Cây héo rũ có thể do **thiếu nước**, **rễ bị thối**, hoặc **nhiệt độ quá cao**.\n\n**Cách kiểm tra:**\n• Thử tưới nước và chờ 30 phút – nếu cây phục hồi thì do thiếu nước\n• Kiểm tra rễ: rễ khỏe có màu trắng/kem, rễ thối có màu nâu và mùi\n• Đảm bảo cây không đặt gần điều hòa trực tiếp\n\nNếu rễ bị thối, cần cắt bỏ phần thối và thay đất ngay!';
  }
  if (msg.includes('tưới') || msg.includes('nước') || msg.includes('water')) {
    return 'Tần suất tưới nước lý tưởng phụ thuộc vào **loại cây** và **điều kiện môi trường**:\n\n• 🌵 **Xương rồng/Mọng nước**: 1–2 lần/tháng\n• 🌿 **Monstera, Pothos**: 1–2 lần/tuần\n• 🌸 **Lan hồ điệp**: Mỗi 7–10 ngày, nhúng chậu trong nước 30 phút\n\n**Quy tắc vàng:** Luôn kiểm tra độ ẩm đất bằng ngón tay trước khi tưới. Tưới quá nhiều nguy hiểm hơn tưới thiếu!';
  }
  if (msg.includes('ánh sáng') || msg.includes('nắng') || msg.includes('light')) {
    return 'Ánh sáng là yếu tố quan trọng nhất trong chăm sóc cây:\n\n☀️ **Ánh sáng trực tiếp** (6+ giờ/ngày): Xương rồng, Hướng dương, Hoa hồng\n🌤️ **Ánh sáng gián tiếp sáng** (3–6 giờ): Monstera, Pothos, Dracaena\n🌥️ **Ánh sáng thấp**: Lưỡi hổ, Syngonium, Zamioculcas\n\nHướng đông–nam thường lý tưởng cho hầu hết cây trong nhà. Tránh để cây sát kính nhận ánh nắng gay gắt buổi trưa!';
  }
  if (msg.includes('phân bón') || msg.includes('fertilizer') || msg.includes('dinh dưỡng')) {
    return 'Bón phân đúng cách giúp cây phát triển mạnh:\n\n**Loại phân:**\n• **NPK 20-20-20**: Cân bằng cho cây xanh lá\n• **Cao Phospho** (P): Kích thích ra hoa\n• **Phân hữu cơ**: An toàn, bền vững cho đất\n\n**Tần suất:** Mùa xuân–hè: 2–4 tuần/lần · Mùa thu–đông: Ngừng hoặc giảm\n\n⚠️ **Lưu ý:** Không bón phân khi cây đang bệnh hoặc đất quá khô. Luôn tưới nước trước khi bón!';
  }
  if (msg.includes('sâu') || msg.includes('bệnh') || msg.includes('pest') || msg.includes('disease')) {
    return 'Phát hiện và xử lý sâu bệnh sớm rất quan trọng:\n\n🐛 **Rệp sáp (Mealybugs)**: Chấm trắng bông – dùng cồn 70% lau sạch\n🕷️ **Nhện đỏ (Spider mites)**: Mạng nhện mỏng – phun nước mạnh hoặc thuốc nhện\n🦟 **Fungus Gnats**: Bướm nhỏ bay quanh đất – để đất khô hơn, dùng bẫy vàng\n🍄 **Bệnh mốc**: Giảm độ ẩm, tăng thông gió, dùng thuốc diệt nấm\n\n💡 **Mẹo**: Cách ly cây bệnh ngay để tránh lây lan!';
  }
  if (msg.includes('monstera') || msg.includes('monstera deliciosa')) {
    return 'Monstera Deliciosa – "Nữ hoàng cây nội thất"! 👑\n\n**Điều kiện lý tưởng:**\n• 🌤️ Ánh sáng gián tiếp sáng (tránh nắng trực tiếp)\n• 💧 Tưới khi đất khô 2–3cm (khoảng 1–2 lần/tuần)\n• 🌡️ Nhiệt độ 18–30°C, tránh gió lạnh\n• 💦 Độ ẩm 60%+ (có thể phun sương hoặc dùng máy tạo ẩm)\n\n**Chăm sóc đặc biệt:**\n• Lau lá bằng khăn ẩm để cây hấp thụ ánh sáng tốt hơn\n• Thay chậu khi rễ mọc ra lỗ đáy chậu\n• Cắm cọc để hỗ trợ cây leo';
  }
  if (msg.includes('xin chào') || msg.includes('hello') || msg.includes('hi') || msg.includes('chào')) {
    return 'Xin chào! 🌿 Tôi là **PlantBot AI**, trợ lý chăm sóc cây thông minh của DeskBoost!\n\nTôi có thể giúp bạn:\n• 🔍 Chẩn đoán vấn đề của cây (lá vàng, héo, sâu bệnh...)\n• 💧 Tư vấn lịch tưới nước và bón phân\n• ☀️ Hướng dẫn vị trí đặt cây phù hợp\n• 🌱 Chăm sóc từng loại cây cụ thể\n\nHãy mô tả tình trạng cây của bạn hoặc đặt câu hỏi nhé!';
  }

  return 'Cảm ơn bạn đã hỏi! 🌱 Tôi đang phân tích câu hỏi của bạn...\n\nĐể tôi tư vấn chính xác hơn, bạn có thể cho tôi biết:\n• **Loại cây** bạn đang chăm sóc là gì?\n• **Triệu chứng** cụ thể bạn quan sát thấy?\n• **Điều kiện** đặt cây (trong nhà/ngoài trời, ánh sáng như thế nào?)\n\nTải ảnh lên hoặc mô tả chi tiết để tôi giúp bạn tốt hơn! 📸';
};

// --- Chat Message Component ---
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 size-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-slate-600 to-slate-800'
          : 'bg-gradient-to-br from-[#4CAF50] to-[#2E7D32]'
      }`}>
        {isUser
          ? <span className="material-symbols-outlined text-base">person</span>
          : <span className="material-symbols-outlined text-base">psychiatry</span>
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-3xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-[#4CAF50] text-white rounded-br-lg'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-lg'
        }`}>
          <span dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
        </div>
        <span className="text-[10px] text-slate-400 px-1">{message.time}</span>
      </div>
    </div>
  );
};

// --- Typing Indicator ---
const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="flex-shrink-0 size-9 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] shadow-lg">
      <span className="material-symbols-outlined text-white text-base">psychiatry</span>
    </div>
    <div className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl rounded-bl-lg shadow-sm">
      <div className="flex gap-1 items-center h-4">
        <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
);

// --- Main Page ---
const AIPlantAnalysis = () => {
  // Upload state
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'chat'

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! 🌿 Tôi là **PlantBot AI** của DeskBoost. Tôi có thể giúp bạn chẩn đoán bệnh cây, tư vấn chế độ chăm sóc và giải đáp mọi thắc mắc về cây cảnh.\n\nTải ảnh lên tab **AI Scan** hoặc hỏi tôi bất kỳ câu hỏi nào nhé! 🌱',
      time: 'Bây giờ',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Upload Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImageFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) loadImageFile(file);
  };

  const loadImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Switch to chat and send a mock result message
      setActiveTab('chat');
      const analysisMsg = {
        id: Date.now(),
        role: 'assistant',
        content: '📸 Tôi đã phân tích ảnh cây của bạn!\n\n**Kết quả sơ bộ:**\n• Phát hiện dấu hiệu **lá vàng nhẹ** ở các lá dưới\n• Có thể do tưới nước **quá nhiều** hoặc thiếu ánh sáng\n• Không phát hiện dấu hiệu sâu bệnh nghiêm trọng\n\n**Khuyến nghị:**\n• Giảm tần suất tưới, để đất khô hơn giữa các lần\n• Di chuyển cây đến nơi sáng hơn\n• Theo dõi thêm 1–2 tuần\n\nBạn có muốn tôi tư vấn thêm về loài cây cụ thể không?',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, analysisMsg]);
    }, 2500);
  };

  // --- Chat Handlers ---
  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getMockAIResponse(trimmed);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { label: 'Lá vàng', icon: 'warning', prompt: 'Lá cây tôi bị vàng, nguyên nhân là gì?' },
    { label: 'Lịch tưới', icon: 'water_drop', prompt: 'Hướng dẫn tưới nước đúng cách cho cây' },
    { label: 'Ánh sáng', icon: 'wb_sunny', prompt: 'Cây cần bao nhiêu ánh sáng mỗi ngày?' },
    { label: 'Phân bón', icon: 'spa', prompt: 'Tư vấn phân bón phù hợp cho cây trong nhà' },
  ];

  return (
    <UserLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">AI Plant Analysis</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">
              Chẩn đoán bệnh cây &amp; tư vấn chăm sóc thông minh với AI
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-2xl">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-[#4CAF50]"></span>
            </span>
            <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest">AI Online</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit gap-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-slate-700 text-[#4CAF50] shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">qr_code_scanner</span>
            AI Scan
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-700 text-[#4CAF50] shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Chat với AI
            {messages.length > 1 && activeTab !== 'chat' && (
              <span className="absolute -top-1 -right-1 size-4 bg-[#4CAF50] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {messages.length - 1}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Main Panel */}
          <div className="lg:col-span-2">

            {/* === AI SCAN TAB === */}
            {activeTab === 'scan' && (
              <div className="space-y-5">
                {/* Upload Area */}
                <div
                  className={`relative h-[380px] border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-8 text-center ${
                    dragActive
                      ? 'border-[#4CAF50] bg-[#4CAF50]/5 scale-[0.99]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedImage ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                      <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="size-20 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center mb-5">
                        <span className="material-symbols-outlined text-4xl">photo_camera</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">Tải ảnh cây lên</h3>
                      <p className="text-slate-500 max-w-[280px] mb-6 font-medium text-sm leading-relaxed">
                        Kéo &amp; thả hoặc nhấn nút bên dưới. Ảnh rõ nét, ánh sáng tốt cho kết quả tốt nhất.
                      </p>
                      <label className="bg-[#4CAF50] text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-105 active:scale-95 transition-all">
                        Chọn ảnh
                        <input type="file" className="hidden" onChange={handleChange} accept="image/*" />
                      </label>
                    </>
                  )}
                </div>

                {/* Analyze Button */}
                {selectedImage && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-[#4CAF50] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#4CAF50]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin size-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">analytics</span>
                        Phân tích với AI
                      </>
                    )}
                  </button>
                )}

                {/* Quick Chat Prompt */}
                <div
                  onClick={() => setActiveTab('chat')}
                  className="p-4 bg-gradient-to-r from-[#4CAF50]/5 to-emerald-50 dark:from-[#4CAF50]/10 dark:to-emerald-900/10 border border-[#4CAF50]/15 rounded-2xl cursor-pointer hover:border-[#4CAF50]/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 bg-[#4CAF50]/15 rounded-xl flex items-center justify-center text-[#4CAF50] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-lg">chat</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Chat với AI để hỏi thêm</p>
                      <p className="text-xs text-slate-500">Đặt câu hỏi về chăm sóc cây của bạn →</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === CHAT TAB === */}
            {activeTab === 'chat' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-sm"
                   style={{ height: '520px' }}>

                {/* Chat Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-[#4CAF50]/5 to-transparent">
                  <div className="size-10 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4CAF50]/30">
                    <span className="material-symbols-outlined text-white text-lg">psychiatry</span>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">PlantBot AI</p>
                    <p className="text-xs text-[#4CAF50] font-semibold">Chuyên gia chăm sóc cây</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex size-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2 bg-[#4CAF50]"></span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts (show when no conversation yet) */}
                {messages.length === 1 && !isTyping && (
                  <div className="px-4 pb-3 flex gap-2 flex-wrap">
                    {quickPrompts.map((qp, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInputValue(qp.prompt);
                          inputRef.current?.focus();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-[#4CAF50] hover:text-[#4CAF50] hover:bg-[#4CAF50]/5 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">{qp.icon}</span>
                        {qp.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 focus-within:border-[#4CAF50] focus-within:ring-2 focus-within:ring-[#4CAF50]/20 transition-all">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Hỏi về cây của bạn... (vd: Lá Monstera bị vàng)"
                      rows={1}
                      className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none outline-none py-1.5 max-h-28 font-medium"
                      style={{ lineHeight: '1.5' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="mb-0.5 size-9 bg-[#4CAF50] text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#4CAF50]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    Nhấn <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-mono">Enter</kbd> để gửi · <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-mono">Shift+Enter</kbd> để xuống dòng
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* How it works */}
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white px-1 mb-3">Cách hoạt động</h3>
              <div className="space-y-3">
                {[
                  { step: '01', title: 'Chụp ảnh', desc: 'Chụp rõ phần lá hoặc thân bị ảnh hưởng.' },
                  { step: '02', title: 'AI phân tích', desc: 'Mô hình AI nhận diện dấu hiệu bệnh lý.' },
                  { step: '03', title: 'Nhận kết quả', desc: 'Chẩn đoán tức thì và kế hoạch chăm sóc.' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-3 hover:border-[#4CAF50]/30 hover:shadow-sm transition-all">
                    <span className="text-xl font-black text-[#4CAF50]/25 leading-none pt-0.5">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Chat Topics */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4CAF50] text-base">tips_and_updates</span>
                Chủ đề phổ biến
              </h3>
              <div className="space-y-2">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab('chat');
                      setTimeout(() => {
                        setInputValue(qp.prompt);
                        inputRef.current?.focus();
                      }, 100);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] transition-all group text-slate-600 dark:text-slate-400"
                  >
                    <span className="material-symbols-outlined text-sm text-[#4CAF50]/60 group-hover:text-[#4CAF50]">{qp.icon}</span>
                    <span className="text-xs font-semibold">{qp.prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pro tip */}
            <div className="p-4 bg-gradient-to-br from-[#4CAF50]/8 to-emerald-50 dark:from-[#4CAF50]/10 dark:to-emerald-900/10 rounded-2xl border border-[#4CAF50]/15 space-y-2">
              <div className="flex items-center gap-2 text-[#4CAF50]">
                <span className="material-symbols-outlined text-base">lightbulb</span>
                <span className="font-black text-sm">Mẹo xịn</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Chụp cả mặt trên và mặt dưới của lá — nhiều loài sâu ẩn ở phía dưới lá, dễ bỏ sót!
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AIPlantAnalysis;
