import React, { useState, useEffect } from 'react';
import { 
  Bot, Code2, Sparkles, X, CheckCircle, AlertCircle, 
  GitCommit, Save, Eye, FileCode, RefreshCw, Key 
} from 'lucide-react';

// ============================================================================
// 🧠 CEREBRO DE ELIZABETH (Lógica de Inyección Inteligente)
// ============================================================================
const intelligentInject = async (currentCode: string, prompt: string, filePath: string, geminiKey: string) => {
  // MODO 1: IA REAL (Gemini) - Si el usuario proporciona su API Key
  if (geminiKey && geminiKey.startsWith('AIza')) {
    try {
      const systemPrompt = `Eres Elizabeth, una ingeniera de software experta en React, TypeScript y Tailwind CSS. 
      Tu tarea es modificar el archivo '${filePath}' según la solicitud del usuario.
      Reglas:
      1. NUNCA borres código existente a menos que se te pida explícitamente.
      2. Si es CSS, añade o modifica las clases necesarias.
      3. Si es TSX, añade los imports arriba y el JSX en el lugar lógico.
      4. Devuelve SOLO el código completo del archivo modificado, sin markdown, sin explicaciones, solo el código raw.
      
      Código actual del archivo:
      ${currentCode}
      
      Solicitud del usuario: ${prompt}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        // Limpiar posibles bloques de markdown que la IA pueda añadir
        return data.candidates[0].content.parts[0].text.replace(/^```[\w]*\n?|```$/g, '').trim();
      }
    } catch (error) {
      console.error("Error llamando a Gemini:", error);
    }
  }

  // MODO 2: SIMULACIÓN INTELIGENTE (Fallback si no hay API Key, para que puedas probar la UI ya mismo)
  await new Promise(r => setTimeout(r, 1500)); // Simular pensamiento
  let newCode = currentCode;
  
  if (filePath.endsWith('.css')) {
    const addition = `\n/* 🤖 Inyectado por Elizabeth AI: ${prompt} */\n.elizabeth-ai-update {\n  background: rgba(15, 15, 25, 0.8) !important;\n  border: 1px solid rgba(236, 72, 153, 0.5) !important;\n  box-shadow: 0 0 20px rgba(236, 72, 153, 0.3) !important;\n  backdrop-filter: blur(10px);\n}\n`;
    newCode = currentCode + addition;
  } else if (filePath.endsWith('.tsx')) {
    const importToAdd = "\nimport { Sparkles } from 'lucide-react'; // Añadido por Elizabeth AI";
    newCode = currentCode.replace(/^(import .*)/m, `$1${importToAdd}`);
  } else {
    newCode = currentCode + `\n// 🤖 Elizabeth AI: Modificación solicitada: ${prompt}\n`;
  }
  
  return newCode;
};

// ============================================================================
// 🖥️ COMPONENTE PRINCIPAL: PANEL DE COMANDO
// ============================================================================
export const ElizabethCommandPanel = ({ onClose }: { onClose: () => void }) => {
  // Configuración
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('elizabeth_gh_token') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('elizabeth_gemini_key') || '');
  
  // Estado de la tarea
  const [prompt, setPrompt] = useState('');
  const [targetFile, setTargetFile] = useState('src/index.css');
  const [generatedCode, setGeneratedCode] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  
  // Estado de la máquina
  const [status, setStatus] = useState<'idle' | 'reading' | 'thinking' | 'ready' | 'committing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [originalSha, setOriginalSha] = useState('');

  useEffect(() => {
    if (githubToken) localStorage.setItem('elizabeth_gh_token', githubToken);
    if (geminiKey) localStorage.setItem('elizabeth_gemini_key', geminiKey);
  }, [githubToken, geminiKey]);

  // PASO 1: Leer de GitHub y Generar Código
  const handleGenerate = async () => {
    if (!prompt.trim() || !targetFile.trim()) {
      setStatus('error');
      setStatusMessage('⚠️ Por favor, proporciona una instrucción y un archivo de destino válido.');
      return;
    }
    if (!githubToken) {
      setStatus('error');
      setStatusMessage('⚠️ Se requiere un GitHub Token para leer y escribir en el repositorio.');
      return;
    }

    setStatus('reading');
    setStatusMessage(`📡 Elizabeth está conectando con GitHub para leer el estado actual de ${targetFile}...`);

    const owner = 'El-Latido';
    const repo = 'Chat-Zenith8';
    const path = targetFile.replace(/^\//, ''); // Limpiar slash inicial
    const branch = 'main';

    try {
      // 1. LEER ARCHIVO ACTUAL
      const getFileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getFileRes.ok) {
        if (getFileRes.status === 404) {
          // Si el archivo no existe, empezamos con uno en blanco (útil para crear archivos nuevos)
          setOriginalSha('');
          setGeneratedCode(`/* Archivo nuevo creado por Elizabeth AI: ${path} */\n`);
          setCommitMessage(`feat: Crear ${path} solicitado por Elizabeth AI`);
          setStatus('thinking');
          setStatusMessage('📝 Archivo no encontrado. Elizabeth lo creará desde cero. Procesando...');
        } else {
          throw new Error(`Error HTTP ${getFileRes.status}: ${getFileRes.statusText}`);
        }
      } else {
        const fileData = await getFileRes.json();
        setOriginalSha(fileData.sha);
        const decodedContent = atob(fileData.content);
        setGeneratedCode(decodedContent);
        
        setStatus('thinking');
        setStatusMessage('🧠 Elizabeth está analizando el código y redactando la solución...');
      }

      // 2. PROCESAR CON IA (Real o Simulada)
      const newCode = await intelligentInject(
        status === 'reading' ? (await (await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
          headers: { 'Authorization': `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json'
        })).json().then(d => atob(d.content))) : generatedCode, 
        prompt, 
        path, 
        geminiKey
      );

      setGeneratedCode(newCode);
      setCommitMessage(`feat(ai): Elizabeth AI modificó ${path} - "${prompt.substring(0, 40)}..."`);
      setStatus('ready');
      setStatusMessage('✅ ¡Código generado! Revisa la planilla, edítalo si lo deseas y aprueba el commit.');

    } catch (error: any) {
      setStatus('error');
      setStatusMessage(`❌ Error al leer/generar: ${error.message}`);
    }
  };

  // PASO 2: Hacer Commit a GitHub
  const handleCommitToGitHub = async () => {
    if (!generatedCode) return;
    
    setStatus('committing');
    setStatusMessage('📤 Subiendo el nuevo código a GitHub y creando el commit...');

    const owner = 'El-Latido';
    const repo = 'Chat-Zenith8';
    const path = targetFile.replace(/^\//, '');
    const branch = 'main';

    try {
      const contentBase64 = btoa(unescape(encodeURIComponent(generatedCode)));
      
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage || 'Update by Elizabeth AI',
          content: contentBase64,
          ...(originalSha && { sha: originalSha }), // Solo enviar sha si el archivo ya existía
          branch: branch
        })
      });

      if (commitRes.ok) {
        setStatus('success');
        setStatusMessage('🎉 ¡Commit realizado con éxito! Tu repositorio ha sido actualizado.');
      } else {
        const errData = await commitRes.json();
        throw new Error(errData.message || 'Error desconocido en el commit');
      }
    } catch (error: any) {
      setStatus('error');
      setStatusMessage(`❌ Error al hacer commit: ${error.message}`);
    }
  };

  // ============================================================================
  // 🎨 RENDERIZADO DE LA INTERFAZ (UI)
  // ============================================================================
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-5xl bg-[#0a0a0c]/95 border border-[#94a3b8]/30 rounded-2xl shadow-[0_0_60px_rgba(148,163,184,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status === 'thinking' || status === 'reading' || status === 'committing' ? 'bg-pink-500/20 animate-pulse' : 'bg-pink-500/20'}`}>
              <Bot className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Planilla de Desarrollo Elizabeth <Sparkles className="w-4 h-4 text-yellow-400" />
              </h2>
              <p className="text-xs text-gray-400">Lee ➔ Piensa ➔ Propone ➔ Tú Apruebas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* 1. Configuración de Acceso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Key className="w-3 h-3" /> GitHub Token (Permiso: repo)
              </label>
              <input 
                type="password" 
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:border-pink-500/50 focus:outline-none"
                placeholder="ghp_... o github_pat_..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini API Key (Opcional, para IA real)
              </label>
              <input 
                type="password" 
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:border-purple-500/50 focus:outline-none"
                placeholder="AIza..."
              />
              <p className="text-[10px] text-gray-500">Sin clave, Elizabeth usará su modo de simulación inteligente.</p>
            </div>
          </div>

          {/* 2. Instrucción y Archivo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" /> 1. Instrucción y Archivo Objetivo
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: 'Añade un efecto de brillo neón rosa a los botones y oscurece el fondo'"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 transition-all"
                disabled={status === 'reading' || status === 'thinking' || status === 'committing'}
              />
              <input 
                type="text" 
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                className="w-full sm:w-48 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-yellow-400 focus:outline-none focus:border-yellow-500/50 transition-all"
                placeholder="src/index.css"
                disabled={status === 'reading' || status === 'thinking' || status === 'committing'}
              />
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || status === 'reading' || status === 'thinking' || status === 'committing'}
                className="neon-button px-6 py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {status === 'reading' || status === 'thinking' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {status === 'reading' ? 'Leyendo...' : status === 'thinking' ? 'Pensando...' : 'Generar'}
              </button>
            </div>
          </div>

          {/* 3. La Planilla de Código (Editable) */}
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-400" /> 2. Planilla de Código (Revisa y Edita)
            </label>
            <div className="relative flex-1 min-h-[300px]">
              <textarea
                value={generatedCode}
                onChange={(e) => setGeneratedCode(e.target.value)}
                placeholder="El código leído y modificado por Elizabeth aparecerá aquí. Puedes corregirlo manualmente antes de aprobar."
                className="w-full h-full min-h-[300px] bg-black/70 border border-white/10 rounded-xl p-4 text-sm font-mono text-green-400 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
                disabled={status === 'reading' || status === 'thinking'}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 font-mono border border-white/5">{targetFile}</span>
              </div>
            </div>
          </div>

          {/* 4. Mensaje del Commit */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-purple-400" /> 3. Mensaje del Commit
            </label>
            <input 
              type="text" 
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all"
              placeholder="feat: descripción del cambio realizado"
            />
          </div>

          {/* Feedback de Estado */}
          {statusMessage && (
            <div className={`p-4 rounded-xl flex items-start gap-3 text-sm animate-fade-in border ${
              status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
              status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {status === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : 
               status === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : 
               <Sparkles className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />}
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer: Botón de Acción Final */}
        <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-xl flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            disabled={status === 'committing'}
          >
            Cancelar
          </button>
          <button 
            onClick={handleCommitToGitHub}
            disabled={status === 'reading' || status === 'thinking' || status === 'committing' || status === 'success' || !generatedCode}
            className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95"
          >
            <Save className="w-4 h-4" /> 
            {status === 'committing' ? 'Subiendo a GitHub...' : status === 'success' ? '¡Completado!' : 'Aprobar y Hacer Commit'}
          </button>
        </div>
      </div>
    </div>
  );
};