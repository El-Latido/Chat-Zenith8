import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'running' | 'entering' | 'done'>('running');

  useEffect(() => {
    // Secuencia de tiempos para la narrativa visual
    const t1 = setTimeout(() => setPhase('entering'), 2500); // Llega al árbol
    const t2 = setTimeout(() => setPhase('done'), 3800);     // Entra a la madriguera
    
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
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden select-none"
        >
          {/* Fondo Atmosférico */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(249,115,22,0.15),_transparent_70%)]" />
          
          {/* Partículas de fuego flotantes (CSS puro) */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '100vh', x: Math.random() * 100 + '%', opacity: 0 }}
                animate={{ y: '-10vh', opacity: [0, 1, 0] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute w-1 h-1 bg-orange-500 rounded-full blur-[1px]"
              />
            ))}
          </div>

          {/* Escena Principal */}
          <div className="relative w-full max-w-md h-80 flex items-end justify-center mb-20">
            
            {/* El Árbol (SVG Inline) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="absolute bottom-0 z-10 w-48 h-64"
            >
              <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-2xl">
                {/* Tronco y Ramas */}
                <path d="M100,300 C100,250 80,200 60,150 C40,100 20,80 10,50 L30,40 C50,70 70,100 80,140 C90,100 110,70 130,40 L150,50 C140,80 120,100 110,150 C100,200 100,250 100,300 Z" fill="#18181b" stroke="#27272a" strokeWidth="2"/>
                {/* Madriguera Brillante */}
                <ellipse cx="100" cy="260" rx="25" ry="18" fill="#09090b" />
                <motion.ellipse 
                  cx="100" cy="260" rx="22" ry="15" 
                  fill="url(#denGradient)"
                  animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <defs>
                  <radialGradient id="denGradient">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>

            {/* El Zorro Corriendo (SVG Inline Animado) */}
            <motion.svg
              viewBox="0 0 100 100"
              initial={{ x: -300, opacity: 0, scale: 0.8 }}
              animate={{ 
                x: phase === 'running' ? -40 : 0, 
                opacity: phase === 'entering' ? 0 : 1,
                scale: phase === 'entering' ? 0.6 : 1
              }}
              transition={{ 
                x: { type: "spring", stiffness: 60, damping: 15, delay: 0.5 },
                opacity: { duration: 0.4, delay: 2.5 },
                scale: { duration: 0.4, delay: 2.5 }
              }}
              className="absolute bottom-8 left-1/2 w-24 h-24 z-20 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]"
            >
              {/* Silueta de Zorro Estilizada */}
              <path 
                d="M30,70 Q20,60 25,45 Q30,30 45,35 Q60,25 75,35 Q85,40 80,55 Q75,65 65,70 L65,85 L55,85 L55,75 L45,75 L45,85 L35,85 Z" 
                fill="url(#foxGradient)" 
                stroke="#fbbf24" strokeWidth="1.5"
              />
              {/* Ojo brillante */}
              <circle cx="65" cy="45" r="2" fill="#fff" className="animate-pulse" />
              {/* Cola en movimiento */}
              <motion.path 
                d="M30,70 Q10,60 15,40 Q20,30 30,45" 
                fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                animate={{ d: ["M30,70 Q10,60 15,40 Q20,30 30,45", "M30,70 Q5,65 10,45 Q15,35 30,45", "M30,70 Q10,60 15,40 Q20,30 30,45"] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
              <defs>
                <linearGradient id="foxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Texto de Estado */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 text-center"
            >
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 font-bold tracking-[0.2em] text-xs uppercase">
                {phase === 'running' ? 'Conectando al Nexo...' : 'Entrando a la Madriguera...'}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
