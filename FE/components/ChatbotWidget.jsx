
import React, { useState } from 'react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {isOpen ? (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-primary p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white">smart_toy</span>
              <span className="font-bold text-white">Plant Doctor AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 p-4 bg-background-light overflow-y-auto flex flex-col gap-4">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100 self-start max-w-[80%] text-text-main">
              Hello! I'm your DeskBoost Expert. How can I help your green friends today?
            </div>
            <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm self-end max-w-[80%] font-medium">
              How often should I water my Snake Plant in an office?
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100 self-start max-w-[80%] text-text-main">
              Snake Plants are very drought-tolerant! In an office, watering once every 3-4 weeks is usually perfect.
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-2 bg-white">
            <input type="text" placeholder="Type a message..." className="flex-1 rounded-xl border-gray-200 text-sm py-2 px-4 focus:ring-primary focus:border-primary" />
            <button className="bg-primary p-2 rounded-xl text-white hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="size-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform animate-bounce hover:animate-none"
        >
          <span className="material-symbols-outlined text-3xl">chat_bubble</span>
        </button>
      )}
    </div>

  );
};

export default ChatbotWidget;
