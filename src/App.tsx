import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, Send, Settings, Menu, Search, Plus, Sparkles,
  MessageCircle, Users, Gamepad2, Music, Bell, Pin,
  Smile, Paperclip, Mic, Globe, Lock, Radio, Zap, Heart
} from "lucide-react";
// Asegúrate de tener este componente o elimina la referencia si aún no lo usas
// import { ElizabethCommandPanel } from "./components/ElizabethAI/ElizabethCommandPanel";

// ==========================================================================
// 🦊 COMPONENTE: PANTALLA DE CARGA (ZORRO CORRIENDO)
// ==========================================================================
const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [phase, setPhase] = useState<'running' | 'entering' | 'done'>('running');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('entering'), 2200);
    const t2 = setTimeout(() => setPhase('done'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onFinish, 600);
      return () => clearTimeout(t);
    }
  }, [phase, onFinish]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden select-none"
        >
          {/* Fondo Atmosférico */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(249,115,22,0.15),_transparent_70%)]" />
          
          {/* Partículas de Fuego */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(15)].map((_, i) => (
              <motion.div key={i}
                initial={{ y: '100vh', x: `${Math.random() * 100}%`, opacity: 0 }}
                animate={{ y: '-10vh', opacity: [0, 1, 0] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute w-1 h-1 bg-orange-500 rounded-full blur-[1px]"
              />
            ))}
          </div>

          <div className="relative w-full max-w-md h-80 flex items-end justify-center mb-20">
            {/* Árbol SVG */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute bottom-0 z-10 w-48 h-64"
            >
              <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
                <path d="M100,300 C100,250 80,200 60,150 C40,100 20,80 10,50 L30,40 C50,70 70,100 80,140 C90,100 110,70 130,40 L150,50 C140,80 120,100 110,150 C100,200 100,250 100,300 Z" fill="#18181b" stroke="#27272a" strokeWidth="2"/>
                <ellipse cx="100" cy="260" rx="25" ry="18" fill="#09090b" />
                <motion.ellipse cx="100" cy="260" rx="22" ry="15" fill="url(#denGrad)"
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }} transition={{ duration: 2, repeat: Infinity }} />
                <defs><radialGradient id="denGrad"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f97316" stopOpacity="0"/></radialGradient></defs>
              </svg>
            </motion.div>

            {/* Zorro Corriendo SVG */}
            <motion.svg viewBox="0 0 100 100"
              initial={{ x: -300, opacity: 0, scale: 0.8 }}
              animate={{ x: phase === 'running' ? -40 : 0, opacity: phase === 'entering' ? 0 : 1, scale: phase === 'entering' ? 0.6 : 1 }}
              transition={{ x: { type: "spring", stiffness: 60, damping: 15, delay: 0.5 }, opacity: { duration: 0.4, delay: 2.2 }, scale: { duration: 0.4, delay: 2.2 } }}
              className="absolute bottom-8 left-1/2 w-24 h-24 z-20 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]"
            >
              <path d="M30,70 Q20,60 25,45 Q30,30 45,35 Q60,25 75,35 Q85,40 80,55 Q75,65 65,70 L65,85 L55,85 L55,75 L45,75 L45,85 L35,85 Z" fill="url(#foxGrad)" stroke="#fbbf24" strokeWidth="1.5"/>
              <circle cx="65" cy="45" r="2" fill="#fff" className="animate-pulse" />
              <motion.path d="M30,70 Q10,60 15,40 Q20,30 30,45" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                animate={{ d: ["M30,70 Q10,60 15,40 Q20,30 30,45", "M30,70 Q5,65 10,45 Q15,35 30,45", "M30,70 Q10,60 15,40 Q20,30 30,45"] }} transition={{ duration: 0.3, repeat: Infinity }} />
              <defs><linearGradient id="foxGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient></defs>
            </motion.svg>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-16 text-center">
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 font-bold tracking-[0.2em] text-xs uppercase">
                {phase === 'running' ? 'Conectando al Nexo...' : 'Entrando a la Madriguera...'}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================================================
// 🏠 APP PRINCIPAL MEJORADA
// ==========================================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showElizabethPanel, setShowElizabethPanel] = useState(false);
  const [activeRoom, setActiveRoom] = useState("global");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messagesRightOpen, setMessagesRightOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Datos Mock (Reemplaza con tu lógica real)
  const rooms = [
    { id: "global", name: "Sala Global", icon: Globe, members: 142, type: "public" },
    { id: "games", name: "Zona de Juegos", icon: Gamepad2, members: 38, type: "public" },
    { id: "music", name: "Radio Comunitaria", icon: Radio, members: 67, type: "public" },
    { id: "private-1", name: "Amigos Cercanos", icon: Lock, members: 8, type: "private" },
    { id: "elizabeth", name: "Elizabeth AI", icon: Sparkles, members: 1, type: "ai" },
  ];

  const onlineUsers = [
    { id: "1", name: "María López", status: "online" as const },
    { id: "2", name: "Carlos Ruiz", status: "online" as const },
    { id: "3", name: "Ana Torres", status: "away" as const },
    { id: "4", name: "Luis Méndez", status: "online" as const },
    { id: "5", name: "Sofía Vega", status: "busy" as const },
  ];

  const messages = [
    { id: "1", user: "María López", text: "¡Hola a todos! ¿Cómo están hoy?", time: "14:23", own: false },
    { id: "2", user: "Carlos Ruiz", text: "Todo bien por aquí, ¿qué tal la nueva interfaz?", time: "14:24", own: false },
    { id: "3", user: "Tú", text: "¡Se ve increíble! Me encanta el diseño nuevo ", time: "14:25", own: true },
    { id: "4", user: "Elizabeth", text: "Gracias. He optimizado el renderizado y ahora la interfaz es un 40% más fluida.", time: "14:26", own: false, isAI: true },
    { id: "5", user: "Ana Torres", text: "Wow, Elizabeth es impresionante. ¿Puedes cambiar el color del sidebar?", time: "14:27", own: false },
  ];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
    // Lógica de envío aquí
  };

  // Si está cargando, mostrar pantalla del zorro
  if (isLoading) return <LoadingScreen onFinish={() => setIsLoading(false)} />;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative bg-zinc-950 text-zinc-100 font-sans">
      
      {/* 🌌 FONDO MESH KITSUNE (Tonos Naranja/Dorado) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-yellow-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-cyan-600/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjAzIi8+PC9zdmc+')] opacity-50" />
      </div>

      {/* ==========================================================================
           LAYOUT PRINCIPAL (3 columnas)
          ========================================================================== */}
      <div className="flex-1 flex relative z-10 h-0">
        
        {/* ====================================================================
            📂 SIDEBAR IZQUIERDO — Salas y Navegación
            ==================================================================== */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} shrink-0 border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-300 overflow-hidden`}>
          
          {/* Header del sidebar con Logo Zorro SVG */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                {/* Mini Zorro SVG Inline */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-tight text-white">Chat Liz</h1>
                <p className="text-[10px] text-orange-400/80 font-medium tracking-wider uppercase">Zenith8 · Kitsune</p>
              </div>
            </div>
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Buscador */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input type="text" placeholder="Buscar salas..." className="w-full pl-9 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
            </div>
          </div>

          {/* Lista de salas */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
            <div className="px-3 py-2"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Salas Públicas</p></div>
            {rooms.filter(r => r.type !== "private" && r.type !== "ai").map(room => (
              <div key={room.id} onClick={() => setActiveRoom(room.id)} className={`flex items-center gap-3 px-3 py-2.5 mx-2 mb-0.5 rounded-xl text-sm cursor-pointer transition-all duration-200 ${activeRoom === room.id ? "bg-orange-500/10 text-orange-300 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"}`}>
                <room.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate font-medium">{room.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeRoom === room.id ? "bg-orange-500/20 text-orange-300" : "bg-zinc-800 text-zinc-500"}`}>{room.members}</span>
              </div>
            ))}

            <div className="h-px bg-white/[0.06] my-2 mx-3" />
            <div className="px-3 py-2"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Privadas</p></div>
            {rooms.filter(r => r.type === "private").map(room => (
              <div key={room.id} onClick={() => setActiveRoom(room.id)} className={`flex items-center gap-3 px-3 py-2.5 mx-2 mb-0.5 rounded-xl text-sm cursor-pointer transition-all duration-200 ${activeRoom === room.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"}`}>
                <Lock className="w-4 h-4 shrink-0 text-zinc-500" />
                <span className="flex-1 truncate font-medium">{room.name}</span>
              </div>
            ))}

            <div className="h-px bg-white/[0.06] my-2 mx-3" />
            <div className="px-3 py-2"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">IA Asistente</p></div>
            {rooms.filter(r => r.type === "ai").map(room => (
              <div key={room.id} onClick={() => setActiveRoom(room.id)} className={`flex items-center gap-3 px-3 py-2.5 mx-2 mb-0.5 rounded-xl text-sm cursor-pointer transition-all duration-200 ${activeRoom === room.id ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"}`}>
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Sparkles className="w-3 h-3 text-white" /></div>
                <span className="flex-1 truncate font-medium">{room.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">PRO</span>
              </div>
            ))}
          </div>

          {/* User card al fondo */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white ring-2 ring-black/20">TU</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Tu Usuario</p>
                <p className="text-[10px] text-emerald-400 truncate flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En línea</p>
              </div>
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
        </aside>

        {/* ====================================================================
            💬 ÁREA CENTRAL — Chat Principal
            ==================================================================== */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
          
          {/* Header del chat */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 lg:hidden"><Menu className="w-5 h-5" /></button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-white">Sala Global</h2>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 142 EN LÍNEA
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">El corazón de la comunidad · Bienvenidos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Search className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Pin className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Bell className="w-4 h-4" /></button>
              <button onClick={() => setMessagesRightOpen(!messagesRightOpen)} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Users className="w-4 h-4" /></button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button onClick={() => setShowElizabethPanel(true)} className="ml-1 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Elizabeth</span>
              </button>
            </div>
          </header>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">Hoy</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {messages.map(msg => (
              <div key={msg.id} className={`group flex gap-3 ${msg.own ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-black/20 ${msg.isAI ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-zinc-700 to-zinc-800"}`}>
                  {msg.isAI ? <Sparkles className="w-3.5 h-3.5" /> : msg.user.slice(0,2).toUpperCase()}
                </div>
                <div className={`flex flex-col ${msg.own ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className={`text-[12px] font-bold ${msg.isAI ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" : "text-zinc-300"}`}>{msg.user}</span>
                    {msg.isAI && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-300 uppercase"><Zap className="w-2.5 h-2.5" /> Bot</span>}
                    <span className="text-[10px] text-zinc-600 font-medium">{msg.time}</span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all duration-200 hover:translate-y-[-1px] ${msg.own ? "bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-tr-sm shadow-orange-500/20" : "bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-sm hover:bg-zinc-800"}`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.own ? "flex-row-reverse" : ""}`}>
                    <button className="text-[10px] text-zinc-500 hover:text-orange-400 transition-colors font-medium">Reaccionar</button>
                    <button className="text-[10px] text-zinc-500 hover:text-white transition-colors font-medium">Responder</button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicador Escribiendo... */}
            <div className="flex gap-3 animate-in fade-in duration-500">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 ring-2 ring-black/20">CR</div>
              <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800/50 border border-white/5">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje Premium */}
          <div className="px-6 pb-6 pt-2 z-20">
            <form onSubmit={handleSendMessage} className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-500/30 shadow-lg shadow-black/20">
              <div className="flex items-end gap-2">
                <button type="button" className="p-2.5 rounded-xl text-zinc-400 hover:text-orange-400 hover:bg-white/5 transition-all mb-0.5"><Plus className="w-5 h-5" /></button>
                <div className="flex-1 relative">
                  <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Mensaje en #${rooms.find(r => r.id === activeRoom)?.name || "sala"}...`} className="w-full bg-transparent outline-none text-[14px] text-white placeholder-zinc-500 py-3 px-2 resize-none" />
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <button type="button" className="p-2.5 rounded-xl text-zinc-400 hover:text-yellow-400 hover:bg-white/5 transition-all"><Smile className="w-5 h-5" /></button>
                  <button type="submit" disabled={!message.trim()} className="ml-1 p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
            <p className="text-[10px] text-zinc-600 text-center mt-3 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 font-mono text-[9px] border border-white/5">Enter</kbd> enviar · 
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 font-mono text-[9px] border border-white/5 ml-1">Shift + Enter</kbd> nueva línea
            </p>
          </div>
        </main>

        {/* ====================================================================
            👥 SIDEBAR DERECHO — Miembros en línea
            ==================================================================== */}
        <aside className={`${messagesRightOpen ? "w-64" : "w-0"} shrink-0 border-l border-white/[0.06] bg-black/40 backdrop-blur-2xl flex flex-col transition-all duration-300 overflow-hidden hidden lg:flex`}>
          <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">Miembros</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-white/5">142</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En línea — {onlineUsers.filter(u => u.status === "online").length}
            </p>
            {onlineUsers.filter(u => u.status === "online").map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-black/20 relative">
                  {user.name.slice(0,2).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-orange-300 transition-colors">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">Chateando...</p>
                </div>
              </div>
            ))}

            <div className="h-px bg-white/[0.06] my-3" />
            <p className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest px-2 mb-2">Ausentes — 1</p>
            {onlineUsers.filter(u => u.status === "away").map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer opacity-60">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 ring-2 ring-black/20 relative">
                  {user.name.slice(0,2).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 truncate">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ==========================================================================
           AVATAR DEL ZORRO EN LA MADRIGUERA (Esquina Inferior Derecha)
          ========================================================================== */}
      <div className="absolute bottom-0 right-0 w-28 h-28 z-50 pointer-events-none group">
        <div className="absolute bottom-2 right-2 w-16 h-16 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all duration-500" />
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg translate-y-6 group-hover:translate-y-4 transition-transform duration-500">
           <path d="M20,100 Q20,60 50,60 Q80,60 80,100 Z" fill="#18181b" stroke="#27272a" strokeWidth="2" />
           <path d="M30,100 Q30,70 50,70 Q70,70 70,100 Z" fill="url(#peekFoxGrad)" />
           <path d="M35,75 L30,50 L45,65 Z" fill="#f97316" />
           <path d="M65,75 L70,50 L55,65 Z" fill="#f97316" />
           <circle cx="42" cy="80" r="2" fill="#fff" />
           <circle cx="58" cy="80" r="2" fill="#fff" />
           <defs><linearGradient id="peekFoxGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient></defs>
        </svg>
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
      </div>

      {/* Panel de Elizabeth (Descomenta cuando tengas el componente listo) */}
      {/* {showElizabethPanel && <ElizabethCommandPanel onClose={() => setShowElizabethPanel(false)} />} */}
    </div>
  );
}
