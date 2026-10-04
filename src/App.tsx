import React, { useState, useEffect, useRef } from "react";
import {
  Hash, Send, Settings, Bot, Menu, X, Search, Plus, Sparkles,
  MessageCircle, Users, Gamepad2, Music, Bell, MoreHorizontal,
  Smile, Paperclip, Mic, Phone, Video, Pin, ChevronDown, Crown,
  Globe, Lock, Radio, Palette, Zap, Heart
} from "lucide-react";
import { ElizabethCommandPanel } from "./components/ElizabethAI/ElizabethCommandPanel";

// ==========================================================================
// 🎨 COMPONENTES AUXILIARES REUTILIZABLES
// ==========================================================================

const Avatar: React.FC<{ 
  src?: string; 
  name: string; 
  size?: "sm" | "md" | "lg"; 
  status?: "online" | "away" | "busy" | "offline";
  isAI?: boolean;
}> = ({ src, name, size = "md", status, isAI }) => {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const initials = name.slice(0, 2).toUpperCase();
  
  return (
    <div className={`avatar ${sizes[size]}`}>
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <div className={`avatar-img flex items-center justify-center font-semibold text-white ${
          isAI ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-zinc-700 to-zinc-800"
        }`}>
          {isAI ? <Sparkles className="w-4 h-4" /> : initials}
        </div>
      )}
      {status && <div className={`avatar-status ${status}`} />}
    </div>
  );
};

// ==========================================================================
// 🏠 APP PRINCIPAL
// ==========================================================================

export default function App() {
  const [showElizabethPanel, setShowElizabethPanel] = useState(false);
  const [activeRoom, setActiveRoom] = useState("global");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messagesRightOpen, setMessagesRightOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Datos de ejemplo (reemplaza con tu estado real de Firebase/Socket)
  const rooms = [
    { id: "global", name: "Sala Global", icon: Globe, members: 142, type: "public" },
    { id: "games", name: "Zona de Juegos", icon: Gamepad2, members: 38, type: "public" },
    { id: "music", name: "Radio Comunitaria", icon: Radio, members: 67, type: "public" },
    { id: "private-1", name: "Amigos Cercanos", icon: Lock, members: 8, type: "private" },
    { id: "elizabeth", name: "Elizabeth AI", icon: Sparkles, members: 1, type: "ai" },
  ];

  const onlineUsers = [
    { id: "1", name: "María López", status: "online" as const, avatar: "" },
    { id: "2", name: "Carlos Ruiz", status: "online" as const, avatar: "" },
    { id: "3", name: "Ana Torres", status: "away" as const, avatar: "" },
    { id: "4", name: "Luis Méndez", status: "online" as const, avatar: "" },
    { id: "5", name: "Sofía Vega", status: "busy" as const, avatar: "" },
  ];

  const messages = [
    { id: "1", user: "María López", avatar: "", text: "¡Hola a todos! ¿Cómo están hoy?", time: "14:23", own: false },
    { id: "2", user: "Carlos Ruiz", avatar: "", text: "Todo bien por aquí, ¿qué tal la nueva interfaz?", time: "14:24", own: false },
    { id: "3", user: "Tú", avatar: "", text: "¡Se ve increíble! Me encanta el diseño nuevo 🎨", time: "14:25", own: true },
    { id: "4", user: "Elizabeth", avatar: "", text: "Gracias por los cumplidos. He optimizado el renderizado y ahora la interfaz es un 40% más fluida. ¿Alguna otra sugerencia?", time: "14:26", own: false, isAI: true },
    { id: "5", user: "Ana Torres", avatar: "", text: "Wow, Elizabeth es impresionante. ¿Puedes cambiar el color del sidebar?", time: "14:27", own: false },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
    // Aquí va tu lógica de Firebase/Socket
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      
      {/* 🌌 FONDO MESH PREMIUM */}
      <div className="mesh-background">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>
      <div className="noise-overlay" />

      {/* ==========================================================================
          📱 LAYOUT PRINCIPAL (3 columnas)
          ========================================================================== */}
      <div className="flex-1 flex relative z-10 h-0">
        
        {/* ====================================================================
            📂 SIDEBAR IZQUIERDO — Salas y Navegación
            ==================================================================== */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} shrink-0 border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-300 overflow-hidden`}>
          
          {/* Header del sidebar */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight text-white">Chat-Liz</h1>
                <p className="text-[11px] text-zinc-500 font-medium">v2.0 · Premium</p>
              </div>
            </div>
            <button className="btn-icon">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Buscador */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Buscar salas..."
                className="input w-full pl-9 text-sm"
              />
            </div>
          </div>

          {/* Lista de salas */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            <div className="px-3 py-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Salas Públicas</p>
            </div>
            {rooms.filter(r => r.type !== "private" && r.type !== "ai").map(room => (
              <div 
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`nav-item mx-2 mb-0.5 ${activeRoom === room.id ? "active" : ""}`}
              >
                <room.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{room.name}</span>
                <span className="badge badge-default text-[10px]">{room.members}</span>
              </div>
            ))}

            <div className="divider mx-3" />

            <div className="px-3 py-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Privadas</p>
            </div>
            {rooms.filter(r => r.type === "private").map(room => (
              <div 
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`nav-item mx-2 mb-0.5 ${activeRoom === room.id ? "active" : ""}`}
              >
                <room.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{room.name}</span>
              </div>
            ))}

            <div className="divider mx-3" />

            <div className="px-3 py-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">IA Asistente</p>
            </div>
            {rooms.filter(r => r.type === "ai").map(room => (
              <div 
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`nav-item mx-2 mb-0.5 ${activeRoom === room.id ? "active" : ""}`}
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="flex-1 truncate">{room.name}</span>
                <span className="badge badge-accent text-[10px]">PRO</span>
              </div>
            ))}
          </div>

          {/* User card al fondo */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Avatar name="Tú" status="online" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Tu Usuario</p>
                <p className="text-[11px] text-zinc-500 truncate">En línea</p>
              </div>
              <button className="btn-icon">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ====================================================================
            💬 ÁREA CENTRAL — Chat Principal
            ==================================================================== */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent">
          
          {/* Header del chat */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="btn-icon lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-white">Sala Global</h2>
                    <span className="badge badge-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      142 en línea
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">El corazón de la comunidad · Bienvenidos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="btn-icon" title="Buscar">
                <Search className="w-4 h-4" />
              </button>
              <button className="btn-icon" title="Fijados">
                <Pin className="w-4 h-4" />
              </button>
              <button className="btn-icon" title="Notificaciones">
                <Bell className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMessagesRightOpen(!messagesRightOpen)}
                className="btn-icon" 
                title="Miembros"
              >
                <Users className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button 
                onClick={() => setShowElizabethPanel(true)}
                className="btn btn-primary !py-2 !px-3 !text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Elizabeth</span>
              </button>
            </div>
          </header>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
            
            {/* Fecha separadora */}
            <div className="flex items-center gap-3 py-4">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] font-medium text-zinc-500 px-3">Hoy</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {messages.map(msg => (
              <div key={msg.id} className={`message group ${msg.own ? "flex-row-reverse" : ""}`}>
                <Avatar 
                  name={msg.user} 
                  isAI={msg.isAI}
                  status={msg.isAI ? "online" : undefined}
                />
                <div className={`flex flex-col ${msg.own ? "items-end" : "items-start"} max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={`text-[13px] font-semibold ${msg.isAI ? "text-purple-400" : "text-white"}`}>
                      {msg.user}
                    </span>
                    {msg.isAI && (
                      <span className="badge badge-accent !py-0 !px-1.5 !text-[9px]">
                        <Zap className="w-2.5 h-2.5" /> IA
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-600">{msg.time}</span>
                  </div>
                  <div className={`message-bubble ${msg.own ? "own" : ""}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje */}
          <div className="px-6 pb-5 pt-2">
            <form onSubmit={handleSendMessage} className="panel-glass p-2">
              <div className="flex items-center gap-2">
                <button type="button" className="btn-icon">
                  <Plus className="w-5 h-5" />
                </button>
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Mensaje en #${rooms.find(r => r.id === activeRoom)?.name || "sala"}...`}
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-zinc-500 px-2"
                />
                <div className="flex items-center gap-0.5">
                  <button type="button" className="btn-icon">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button type="button" className="btn-icon">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="btn-icon">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    type="submit"
                    disabled={!message.trim()}
                    className="btn btn-primary !p-2 !rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
            <p className="text-[11px] text-zinc-600 text-center mt-2">
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 font-mono text-[10px]">Enter</kbd> para enviar · 
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 font-mono text-[10px] ml-1">Shift+Enter</kbd> nueva línea
            </p>
          </div>
        </main>

        {/* ====================================================================
            👥 SIDEBAR DERECHO — Miembros en línea
            ==================================================================== */}
        <aside className={`${messagesRightOpen ? "w-64" : "w-0"} shrink-0 border-l border-white/[0.06] bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-300 overflow-hidden hidden lg:flex`}>
          
          <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
            <h3 className="text-[13px] font-bold text-white">Miembros</h3>
            <span className="badge badge-default ml-auto">142</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2">
              En línea — {onlineUsers.filter(u => u.status === "online").length}
            </p>
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                <Avatar name={user.name} status={user.status} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">Chateando...</p>
                </div>
              </div>
            ))}

            <div className="divider" />

            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2">
              Ausentes — 1
            </p>
            {onlineUsers.filter(u => u.status === "away").map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer opacity-60">
                <Avatar name={user.name} status={user.status} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ==========================================================================
          🤖 PANEL DE ELIZABETH (Modal)
          ========================================================================== */}
      {showElizabethPanel && (
        <ElizabethCommandPanel onClose={() => setShowElizabethPanel(false)} />
      )}
    </div>
  );
}