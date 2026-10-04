import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ElizabethCommandPanel } from './components/ElizabethAI/ElizabethCommandPanel';

export default function App() {
  const [showElizabethPanel, setShowElizabethPanel] = useState(false);

  return (
    <div className="relative h-screen w-screen bg-[#030014] text-white overflow-hidden">
      {/* ... Tu interfaz de chat existente ... */}

      {/* Botón Flotante o en la Navbar para invocar a Elizabeth */}
      <button 
        onClick={() => setShowElizabethPanel(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white font-bold shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all hover:scale-105 active:scale-95"
      >
        <Bot className="w-5 h-5" />
        <span>Panel Elizabeth</span>
        <Sparkles className="w-4 h-4 text-yellow-300" />
      </button>

      {/* El Panel Modal */}
      {showElizabethPanel && (
        <ElizabethCommandPanel onClose={() => setShowElizabethPanel(false)} />
      )}
    </div>
  );
}