# CONTEXTO DO PROJETO: TESTE-360
Abaixo estão os conteúdos dos arquivos do projeto concatenados.
Cada arquivo inicia com '--- ARQUIVO: <caminho> ---'.


==================================================
--- ARQUIVO: index.html ---
==================================================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#0a0a0a" />
    <title>Marble 360 Capture</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


==================================================
--- ARQUIVO: vite.config.js ---
==================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
  },
})


==================================================
--- ARQUIVO: package.json ---
==================================================
{
  "name": "marble-capture-360",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0"
  }
}


==================================================
--- ARQUIVO: src/index.css ---
==================================================
@import "tailwindcss";

@theme {
  --color-cyber-bg: #0a0a0a;
  --color-cyber-surface: #111111;
  --color-cyber-surface-2: #1a1a1a;
  --color-cyber-border: #222222;
  --color-cyber-text: #e0e0e0;
  --color-cyber-text-dim: #666666;
  --color-neon-green: #00ff9d;
  --color-neon-green-dim: #00cc7d;
  --color-neon-red: #ff0055;
  --color-neon-red-dim: #cc0044;
  --color-neon-amber: #ffaa00;

  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', ui-monospace, monospace;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: var(--color-cyber-bg);
    color: var(--color-cyber-text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: var(--color-neon-green);
    color: var(--color-cyber-bg);
  }

  input {
    outline: none;
  }

  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none;
  }
}

/* Animations */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 157, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 157, 0.6); }
}

@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes reticle-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-reticle-pulse {
  animation: reticle-pulse 1.5s ease-in-out infinite;
}

/* Utility for glass effect */
.glass {
  background: rgba(17, 17, 17, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}


==================================================
--- ARQUIVO: src/main.jsx ---
==================================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);


==================================================
--- ARQUIVO: src/App.jsx ---
==================================================
import { AppProvider, useAppContext, SCREENS } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import CaptureScreen from './screens/CaptureScreen';
import ReviewScreen from './screens/ReviewScreen';
import ResultScreen from './screens/ResultScreen';

function AppContent() {
    const { screen } = useAppContext();

    switch (screen) {
        case SCREENS.HOME:
            return <HomeScreen />;
        case SCREENS.CAPTURE:
            return <CaptureScreen />;
        case SCREENS.REVIEW:
            return <ReviewScreen />;
        case SCREENS.RESULT:
            return <ResultScreen />;
        default:
            return <HomeScreen />;
    }
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}


==================================================
--- ARQUIVO: src/context/AppContext.jsx ---
==================================================
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const SCREENS = {
    HOME: 'home',
    CAPTURE: 'capture',
    REVIEW: 'review',
    RESULT: 'result',
};

export function AppProvider({ children }) {
    const [apiKey, setApiKeyState] = useState(() => {
        return sessionStorage.getItem('wl_api_key') || '';
    });
    const [screen, setScreen] = useState(SCREENS.HOME);
    const [capturedImages, setCapturedImages] = useState([]);
    const [worldResult, setWorldResult] = useState(null);

    const setApiKey = useCallback((key) => {
        setApiKeyState(key);
        if (key) {
            sessionStorage.setItem('wl_api_key', key);
        } else {
            sessionStorage.removeItem('wl_api_key');
        }
    }, []);

    const addCapturedImage = useCallback((imageData) => {
        setCapturedImages((prev) => [...prev, imageData]);
    }, []);

    const resetCapture = useCallback(() => {
        // Revoke any existing blob URLs
        capturedImages.forEach((img) => {
            if (img.url) URL.revokeObjectURL(img.url);
        });
        setCapturedImages([]);
        setScreen(SCREENS.CAPTURE);
    }, [capturedImages]);

    const resetAll = useCallback(() => {
        capturedImages.forEach((img) => {
            if (img.url) URL.revokeObjectURL(img.url);
        });
        setCapturedImages([]);
        setWorldResult(null);
        setScreen(SCREENS.HOME);
    }, [capturedImages]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            capturedImages.forEach((img) => {
                if (img.url) URL.revokeObjectURL(img.url);
            });
        };
    }, []);

    const value = {
        apiKey,
        setApiKey,
        screen,
        setScreen,
        capturedImages,
        addCapturedImage,
        resetCapture,
        resetAll,
        worldResult,
        setWorldResult,
        SCREENS,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export { SCREENS };


==================================================
--- ARQUIVO: src/screens/HomeScreen.jsx ---
==================================================
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { KeyRound, ChevronRight, Compass, Scan } from 'lucide-react';

export default function HomeScreen() {
    const { apiKey, setApiKey, setScreen, SCREENS } = useAppContext();
    const [showKey, setShowKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async () => {
        if (!apiKey.trim()) {
            setError('API Key is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // iOS 13+ requires DeviceMotionEvent.requestPermission() from user gesture
            if (
                typeof DeviceMotionEvent !== 'undefined' &&
                typeof DeviceMotionEvent.requestPermission === 'function'
            ) {
                const motionResult = await DeviceMotionEvent.requestPermission();
                if (motionResult !== 'granted') {
                    setError('Motion sensor permission denied. Required for capture.');
                    setIsLoading(false);
                    return;
                }
            }

            // Also request orientation if available
            if (
                typeof DeviceOrientationEvent !== 'undefined' &&
                typeof DeviceOrientationEvent.requestPermission === 'function'
            ) {
                const orientResult = await DeviceOrientationEvent.requestPermission();
                if (orientResult !== 'granted') {
                    setError('Orientation sensor permission denied. Required for compass.');
                    setIsLoading(false);
                    return;
                }
            }

            setScreen(SCREENS.CAPTURE);
        } catch (err) {
            console.error('Permission error:', err);
            // On desktop, permissions may not exist — proceed anyway
            setScreen(SCREENS.CAPTURE);
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background grid effect */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,255,157,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,157,0.3) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Scan line effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    background: 'linear-gradient(transparent 50%, rgba(0,255,157,0.1) 50%)',
                    backgroundSize: '100% 4px',
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm animate-fade-in">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-cyber-surface border border-cyber-border flex items-center justify-center mb-4 relative">
                        <Scan className="w-8 h-8 text-neon-green" strokeWidth={1.5} />
                        <div className="absolute inset-0 rounded-2xl bg-neon-green/5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Marble <span className="text-neon-green">360</span>
                    </h1>
                    <p className="text-sm text-cyber-text-dim mt-1 font-mono">
                        CAPTURE · GENERATE · EXPLORE
                    </p>
                </div>

                {/* Info card */}
                <div className="glass rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Compass className="w-5 h-5 text-neon-green mt-0.5 shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-sm text-cyber-text leading-relaxed">
                                Capture <span className="text-white font-semibold">8 photos</span> at 45° intervals
                                to generate a <span className="text-neon-green font-semibold">3D world</span> using
                                World Labs AI.
                            </p>
                        </div>
                    </div>
                </div>

                {/* API Key Input */}
                <div className="mb-4">
                    <label className="block text-xs font-mono text-cyber-text-dim uppercase tracking-wider mb-2 ml-1">
                        World Labs API Key
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <KeyRound className="w-4 h-4 text-cyber-text-dim" strokeWidth={1.5} />
                        </div>
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setError('');
                            }}
                            placeholder="wlt_xxxxxxxxxxxxx"
                            className="w-full bg-cyber-surface border border-cyber-border rounded-xl py-3.5 pl-10 pr-16 text-sm font-mono text-white placeholder:text-cyber-text-dim/50 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-cyber-text-dim hover:text-neon-green transition-colors py-1 px-2"
                        >
                            {showKey ? 'HIDE' : 'SHOW'}
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-neon-red/10 border border-neon-red/20">
                        <p className="text-xs font-mono text-neon-red">{error}</p>
                    </div>
                )}

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    disabled={isLoading}
                    className="w-full bg-neon-green text-cyber-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Start Project
                            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                        </>
                    )}
                </button>

                {/* Footer note */}
                <p className="text-center text-[10px] font-mono text-cyber-text-dim/40 mt-6">
                    KEY STORED IN SESSION ONLY · NEVER UPLOADED
                </p>
            </div>
        </div>
    );
}


==================================================
--- ARQUIVO: src/screens/ResultScreen.jsx ---
==================================================
import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
    Download,
    ExternalLink,
    Camera,
    Globe,
    Share2,
    Check,
    ChevronLeft,
    ChevronRight,
    Move,
} from 'lucide-react';

export default function ResultScreen() {
    const { worldResult, resetAll, resetCapture } = useAppContext();
    const [copied, setCopied] = useState(false);
    const viewerRef = useRef(null);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const rotationX = useRef(0);
    const [viewRotation, setViewRotation] = useState(0);

    if (!worldResult) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-cyber-bg">
                <p className="text-cyber-text-dim font-mono text-sm">No result data. Please start a new capture.</p>
            </div>
        );
    }

    const { panoUrl, worldMarbleUrl, caption, thumbnailUrl } = worldResult;

    // Simple panorama viewer via drag interaction
    const handlePointerDown = (e) => {
        isDragging.current = true;
        lastX.current = e.clientX || e.touches?.[0]?.clientX || 0;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current) return;
        const x = e.clientX || e.touches?.[0]?.clientX || 0;
        const delta = x - lastX.current;
        lastX.current = x;
        rotationX.current += delta * 0.3;
        setViewRotation(rotationX.current);
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
    };

    const handleDownload = async () => {
        if (!panoUrl) return;
        try {
            const res = await fetch(panoUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'marble_360_panorama.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            // Fallback: open in new tab
            window.open(panoUrl, '_blank');
        }
    };

    const handleShare = async () => {
        if (navigator.share && worldMarbleUrl) {
            try {
                await navigator.share({
                    title: 'My 3D World — Marble 360',
                    text: caption || 'Check out this 3D world I created!',
                    url: worldMarbleUrl,
                });
            } catch {
                // User cancelled or share failed
            }
        } else if (worldMarbleUrl) {
            await navigator.clipboard.writeText(worldMarbleUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-cyber-bg overflow-auto">
            {/* Header */}
            <div className="glass px-4 py-4 flex items-center justify-between shrink-0 safe-area-top">
                <div>
                    <h2 className="text-lg font-bold text-white">
                        World <span className="text-neon-green">Generated</span>
                    </h2>
                    <p className="text-xs font-mono text-cyber-text-dim">3D WORLD READY</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-neon-green" strokeWidth={1.5} />
                </div>
            </div>

            {/* Panorama Viewer */}
            <div className="flex-1 flex flex-col min-h-0">
                {panoUrl ? (
                    <div className="relative flex-1 overflow-hidden bg-black">
                        {/* Draggable panoramic view */}
                        <div
                            ref={viewerRef}
                            className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-none"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <img
                                src={panoUrl}
                                alt="360 Panorama"
                                className="h-full object-cover pointer-events-none"
                                draggable="false"
                                style={{
                                    transform: `translateX(${viewRotation}px)`,
                                    transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
                                    minWidth: '200%',
                                }}
                            />
                        </div>

                        {/* Drag hint overlay */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5 flex items-center gap-2 pointer-events-none">
                            <ChevronLeft className="w-3 h-3 text-cyber-text-dim" />
                            <Move className="w-3.5 h-3.5 text-neon-green" />
                            <ChevronRight className="w-3 h-3 text-cyber-text-dim" />
                            <span className="font-mono text-[10px] text-cyber-text-dim uppercase">
                                DRAG TO EXPLORE
                            </span>
                        </div>
                    </div>
                ) : thumbnailUrl ? (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <img
                            src={thumbnailUrl}
                            alt="World Thumbnail"
                            className="max-w-full max-h-full rounded-xl border border-cyber-border object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-cyber-text-dim font-mono text-sm">No preview available</p>
                    </div>
                )}

                {/* Caption */}
                {caption && (
                    <div className="px-4 py-3 glass">
                        <p className="text-xs text-cyber-text leading-relaxed line-clamp-3">{caption}</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col gap-2.5 safe-area-bottom">
                {/* View in Marble */}
                {worldMarbleUrl && (
                    <a
                        href={worldMarbleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-neon-green text-cyber-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98] hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] no-underline"
                    >
                        <ExternalLink className="w-4 h-4" strokeWidth={2} />
                        View in Marble
                    </a>
                )}

                {/* Download + Share row */}
                <div className="flex gap-2.5">
                    {panoUrl && (
                        <button
                            onClick={handleDownload}
                            className="flex-1 glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text hover:text-white transition-colors"
                        >
                            <Download className="w-4 h-4" strokeWidth={1.5} />
                            Download
                        </button>
                    )}

                    <button
                        onClick={handleShare}
                        className="flex-1 glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text hover:text-white transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-neon-green" strokeWidth={2} />
                                <span className="text-neon-green">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" strokeWidth={1.5} />
                                Share
                            </>
                        )}
                    </button>
                </div>

                {/* New Capture */}
                <button
                    onClick={resetAll}
                    className="w-full glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text-dim hover:text-white transition-colors"
                >
                    <Camera className="w-4 h-4" strokeWidth={1.5} />
                    Start New Capture
                </button>
            </div>
        </div>
    );
}


==================================================
--- ARQUIVO: src/screens/ReviewScreen.jsx ---
==================================================
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { uploadAndGenerate } from '../services/worldLabs';
import {
    RotateCcw,
    Sparkles,
    ImageIcon,
    Upload,
    Loader2,
    Globe,
    AlertTriangle,
    X,
} from 'lucide-react';

const DIRECTION_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Phase-specific icons and colors
const PHASE_CONFIG = {
    upload: { icon: Upload, color: 'text-neon-amber', label: 'UPLOADING' },
    generate: { icon: Sparkles, color: 'text-neon-green', label: 'GENERATING' },
    poll: { icon: Globe, color: 'text-neon-green', label: 'PROCESSING' },
};

export default function ReviewScreen() {
    const { capturedImages, resetCapture, setScreen, setWorldResult, SCREENS } =
        useAppContext();

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const result = await uploadAndGenerate(capturedImages, (progressInfo) => {
                setProgress(progressInfo);
            });

            // Store result and navigate
            setWorldResult(result);
            setScreen(SCREENS.RESULT);
        } catch (err) {
            console.error('Generation failed:', err);
            setError(err.message);
            setIsProcessing(false);
        }
    };

    // Processing overlay
    if (isProcessing && !error) {
        const phaseConfig = progress ? PHASE_CONFIG[progress.phase] : PHASE_CONFIG.upload;
        const PhaseIcon = phaseConfig?.icon || Loader2;

        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-cyber-bg px-6">
                {/* Background pulse */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-neon-green/5 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                <div className="relative z-10 flex flex-col items-center animate-fade-in">
                    {/* Animated icon */}
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center mb-6 relative">
                        <PhaseIcon
                            className={`w-8 h-8 ${phaseConfig?.color || 'text-neon-green'} ${progress?.phase === 'poll' ? 'animate-spin' : 'animate-pulse'
                                }`}
                            strokeWidth={1.5}
                            style={progress?.phase === 'poll' ? { animationDuration: '3s' } : {}}
                        />
                    </div>

                    {/* Phase label */}
                    <span className="font-mono text-xs text-cyber-text-dim uppercase tracking-widest mb-2">
                        {phaseConfig?.label || 'INITIALIZING'}
                    </span>

                    {/* Status text */}
                    <p className="text-white text-sm text-center max-w-xs mb-6">
                        {progress?.detail || 'Preparing...'}
                    </p>

                    {/* Upload progress bar */}
                    {progress?.phase === 'upload' && progress.total > 0 && (
                        <div className="w-64 mb-4">
                            <div className="h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neon-green rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${(progress.uploaded / progress.total) * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="font-mono text-[10px] text-cyber-text-dim mt-1.5 text-center">
                                {progress.uploaded} / {progress.total} IMAGES
                            </p>
                        </div>
                    )}

                    {/* Elapsed time hint */}
                    <p className="font-mono text-[10px] text-cyber-text-dim/50 mt-4">
                        {progress?.phase === 'poll'
                            ? 'THIS MAY TAKE 2-5 MINUTES'
                            : 'DO NOT CLOSE THIS TAB'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-cyber-bg overflow-auto">
            {/* Header */}
            <div className="glass px-4 py-4 flex items-center justify-between shrink-0 safe-area-top">
                <div>
                    <h2 className="text-lg font-bold text-white">Capture Complete</h2>
                    <p className="text-xs font-mono text-cyber-text-dim">
                        {capturedImages.length} PHOTOS · 360° COVERAGE
                    </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-neon-green" strokeWidth={1.5} />
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mx-3 mt-3 px-4 py-3 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-start gap-3 animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neon-red mb-1">Generation Failed</p>
                        <p className="text-[11px] font-mono text-neon-red/70 break-words">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="shrink-0">
                        <X className="w-4 h-4 text-neon-red/50 hover:text-neon-red" />
                    </button>
                </div>
            )}

            {/* Image Grid */}
            <div className="flex-1 p-3 overflow-auto">
                <div className="grid grid-cols-2 gap-2">
                    {capturedImages.map((img, index) => (
                        <div
                            key={index}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cyber-border group animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <img
                                src={img.url}
                                alt={`Capture ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                <span className="font-mono text-[10px] text-white/80 bg-black/40 rounded px-1.5 py-0.5">
                                    {img.azimuth}° {DIRECTION_LABELS[index]}
                                </span>
                                <span className="font-mono text-[10px] text-neon-green bg-black/40 rounded px-1.5 py-0.5">
                                    #{index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col gap-3 safe-area-bottom">
                <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full bg-neon-green text-cyber-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98] hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] disabled:opacity-50"
                >
                    <Sparkles className="w-4 h-4" strokeWidth={2} />
                    Generate 3D World
                </button>

                <button
                    onClick={resetCapture}
                    disabled={isProcessing}
                    className="w-full glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text-dim hover:text-white transition-colors disabled:opacity-30"
                >
                    <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                    Retake All Photos
                </button>
            </div>
        </div>
    );
}


==================================================
--- ARQUIVO: src/screens/CaptureScreen.jsx ---
==================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCamera } from '../hooks/useCamera';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import {
    RotateCcw,
    Camera,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const TARGETS = [0, 45, 90, 135, 180, 225, 270, 315];
const ALIGNMENT_THRESHOLD = 3; // degrees

// Compute shortest angular distance and direction
function getAngleDiff(current, target) {
    let diff = target - current;
    // Normalize to [-180, 180]
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return diff;
}

// Direction labels
const DIRECTION_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export default function CaptureScreen() {
    const { addCapturedImage, capturedImages, setScreen, SCREENS } = useAppContext();
    const { videoRef, isReady, error: cameraError, startCamera } = useCamera();
    const { alpha, isDesktop, debugAngle, setDebugAngle, requestPermission, permissionGranted } =
        useDeviceOrientation();

    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const canvasRef = useRef(null);

    const currentTarget = TARGETS[currentTargetIndex];
    const angleDiff = getAngleDiff(alpha, currentTarget);
    const isAligned = Math.abs(angleDiff) <= ALIGNMENT_THRESHOLD;
    const photoCount = capturedImages.length;

    // Start camera on mount
    useEffect(() => {
        const init = async () => {
            if (!permissionGranted) {
                await requestPermission();
            }
            await startCamera();
        };
        init();
    }, []);

    // Auto-advance to review when all 8 captured
    useEffect(() => {
        if (capturedImages.length >= 8) {
            setScreen(SCREENS.REVIEW);
        }
    }, [capturedImages.length]);

    const handleCapture = useCallback(async () => {
        if (!isAligned || isCapturing) return;

        setIsCapturing(true);
        setFlashActive(true);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        try {
            // Draw video frame to canvas
            const video = videoRef.current;
            if (!video || !video.videoWidth) return;

            let targetWidth = video.videoWidth;
            let targetHeight = video.videoHeight;

            // Resize if > 1920px
            const MAX_WIDTH = 1920;
            if (targetWidth > MAX_WIDTH) {
                const ratio = MAX_WIDTH / targetWidth;
                targetWidth = MAX_WIDTH;
                targetHeight = Math.round(targetHeight * ratio);
            }

            if (!canvasRef.current) {
                canvasRef.current = document.createElement('canvas');
            }
            const canvas = canvasRef.current;
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.8);
            });

            if (blob) {
                const url = URL.createObjectURL(blob);
                addCapturedImage({
                    blob,
                    url,
                    azimuth: currentTarget,
                    index: photoCount,
                });

                setCurrentTargetIndex((prev) => prev + 1);
            }
        } catch (err) {
            console.error('Capture error:', err);
        } finally {
            setTimeout(() => setFlashActive(false), 150);
            setIsCapturing(false);
        }
    }, [isAligned, isCapturing, alpha, currentTarget, photoCount, addCapturedImage]);

    // Render direction arrow
    const renderDirectionGuide = () => {
        if (isAligned) return null;

        const direction = angleDiff > 0 ? 'right' : 'left';
        const absDiff = Math.abs(angleDiff);

        return (
            <div className="flex items-center gap-2 text-neon-red font-mono text-xs">
                {direction === 'left' ? (
                    <ChevronLeft className="w-5 h-5 animate-pulse" />
                ) : null}
                <span>
                    ROTATE {direction.toUpperCase()} {Math.round(absDiff)}°
                </span>
                {direction === 'right' ? (
                    <ChevronRight className="w-5 h-5 animate-pulse" />
                ) : null}
            </div>
        );
    };

    return (
        <div className="h-full w-full relative overflow-hidden bg-black">
            {/* Flash effect */}
            {flashActive && (
                <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-fade-in" />
            )}

            {/* Video Feed */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                autoPlay
                muted
            />

            {/* Camera error overlay */}
            {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-bg/90 z-20 p-6">
                    <AlertTriangle className="w-12 h-12 text-neon-red mb-4" />
                    <p className="text-neon-red font-mono text-sm text-center mb-2">CAMERA ERROR</p>
                    <p className="text-cyber-text-dim text-xs text-center max-w-xs">{cameraError}</p>
                    <button
                        onClick={startCamera}
                        className="mt-6 px-6 py-2 bg-cyber-surface border border-cyber-border rounded-lg text-sm flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            )}

            {/* HUD Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                {/* Top Bar */}
                <div className="glass pointer-events-auto px-4 py-3 flex items-center justify-between safe-area-top">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-neon-green' : 'bg-neon-red'}`} />
                        <span className="font-mono text-xs text-cyber-text-dim uppercase">
                            {isReady ? 'LIVE' : 'CONNECTING'}
                        </span>
                    </div>
                    <div className="font-mono text-xs text-white">
                        <span className="text-neon-green">{photoCount}</span>
                        <span className="text-cyber-text-dim"> / 8</span>
                    </div>
                </div>

                {/* Center Area — Reticle */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative flex flex-col items-center gap-4">
                        {/* Target info */}
                        <div className="glass rounded-full px-4 py-1.5 pointer-events-auto">
                            <span className="font-mono text-xs">
                                <span className="text-cyber-text-dim">TARGET </span>
                                <span className="text-white">{currentTarget}°</span>
                                <span className="text-cyber-text-dim"> {DIRECTION_LABELS[currentTargetIndex]}</span>
                            </span>
                        </div>

                        {/* Reticle Ring */}
                        <div className="relative">
                            <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-lg">
                                {/* Outer ring */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="85"
                                    fill="none"
                                    stroke={isAligned ? '#00ff9d' : '#ff0055'}
                                    strokeWidth="2"
                                    opacity={isAligned ? 1 : 0.4}
                                    className={isAligned ? 'animate-reticle-pulse' : ''}
                                />
                                {/* Inner ring */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="70"
                                    fill="none"
                                    stroke={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.2)'}
                                    strokeWidth="1"
                                    strokeDasharray={isAligned ? 'none' : '8 4'}
                                />
                                {/* Crosshair lines */}
                                <line x1="90" y1="20" x2="90" y2="40" stroke={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.3)'} strokeWidth="1" />
                                <line x1="90" y1="140" x2="90" y2="160" stroke={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.3)'} strokeWidth="1" />
                                <line x1="20" y1="90" x2="40" y2="90" stroke={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.3)'} strokeWidth="1" />
                                <line x1="140" y1="90" x2="160" y2="90" stroke={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.3)'} strokeWidth="1" />
                                {/* Center dot */}
                                <circle
                                    cx="90"
                                    cy="90"
                                    r="3"
                                    fill={isAligned ? '#00ff9d' : 'rgba(255,255,255,0.5)'}
                                />
                            </svg>

                            {/* Glow effect when aligned */}
                            {isAligned && (
                                <div className="absolute inset-0 rounded-full animate-pulse-glow" />
                            )}
                        </div>

                        {/* Angle display + direction */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-lg text-white tabular-nums">
                                {alpha}°
                            </span>
                            {renderDirectionGuide()}
                            {isAligned && (
                                <span className="font-mono text-xs text-neon-green uppercase tracking-wider animate-pulse">
                                    ● ALIGNED — TAP TO CAPTURE
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Area */}
                <div className="pointer-events-auto pb-8 px-6 flex flex-col items-center gap-4 safe-area-bottom">
                    {/* Progress dots */}
                    <div className="flex items-center gap-2">
                        {TARGETS.map((target, i) => (
                            <div
                                key={target}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < photoCount
                                        ? 'bg-neon-green scale-100'
                                        : i === currentTargetIndex
                                            ? 'bg-white scale-110 ring-2 ring-white/30'
                                            : 'bg-cyber-text-dim/30 scale-90'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Capture Button */}
                    <button
                        onClick={handleCapture}
                        disabled={!isAligned || isCapturing}
                        className={`w-18 h-18 rounded-full border-4 flex items-center justify-center transition-all active:scale-90 ${isAligned
                                ? 'border-neon-green bg-neon-green/20 shadow-[0_0_30px_rgba(0,255,157,0.4)]'
                                : 'border-cyber-text-dim/30 bg-transparent opacity-50 cursor-not-allowed'
                            }`}
                        style={{ width: 72, height: 72 }}
                    >
                        <div
                            className={`rounded-full transition-all ${isAligned ? 'bg-neon-green w-14 h-14' : 'bg-cyber-text-dim/20 w-14 h-14'
                                }`}
                            style={{
                                width: isAligned ? 56 : 56,
                                height: isAligned ? 56 : 56,
                            }}
                        />
                    </button>

                    <p className="font-mono text-[10px] text-cyber-text-dim uppercase tracking-wider">
                        Photo {Math.min(photoCount + 1, 8)} of 8
                    </p>
                </div>
            </div>

            {/* Debug Slider (Desktop) */}
            {isDesktop && (
                <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto glass px-4 py-3 safe-area-bottom">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-neon-amber uppercase shrink-0">
                            DEBUG
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={debugAngle}
                            onChange={(e) => setDebugAngle(Number(e.target.value))}
                            className="flex-1 h-1 rounded-full appearance-none bg-cyber-border accent-neon-green cursor-pointer"
                        />
                        <span className="font-mono text-xs text-white w-10 text-right tabular-nums">
                            {debugAngle}°
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}


==================================================
--- ARQUIVO: src/hooks/useCamera.js ---
==================================================
import { useRef, useState, useCallback, useEffect } from 'react';

export function useCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                videoRef.current.setAttribute('autoplay', 'true');
                videoRef.current.setAttribute('muted', 'true');
                await videoRef.current.play();
                setIsReady(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError(err.message || 'Failed to access camera');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsReady(false);
    }, []);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !videoRef.current.videoWidth) {
            return null;
        }

        const video = videoRef.current;
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;

        // Resize if > 1920px width to save mobile memory
        const MAX_WIDTH = 1920;
        if (targetWidth > MAX_WIDTH) {
            const ratio = MAX_WIDTH / targetWidth;
            targetWidth = MAX_WIDTH;
            targetHeight = Math.round(targetHeight * ratio);
        }

        // Create or reuse canvas
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                'image/jpeg',
                0.8
            );
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return {
        videoRef,
        isReady,
        error,
        startCamera,
        stopCamera,
        takePhoto,
    };
}


==================================================
--- ARQUIVO: src/hooks/useDeviceOrientation.js ---
==================================================
import { useState, useEffect, useCallback, useRef } from 'react';

export function useDeviceOrientation() {
    const [alpha, setAlpha] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [debugAngle, setDebugAngle] = useState(0);
    const usingDebug = useRef(false);

    // Detect if we need iOS permission or if on desktop
    useEffect(() => {
        const hasOrientation = 'DeviceOrientationEvent' in window;
        const needsPermission =
            hasOrientation &&
            typeof DeviceOrientationEvent.requestPermission === 'function';

        if (!hasOrientation) {
            // Desktop fallback
            setIsDesktop(true);
            usingDebug.current = true;
            setPermissionGranted(true);
        } else if (!needsPermission) {
            // Android or older iOS — permission not needed
            setPermissionGranted(true);
        }
        // If needsPermission, wait for user click to request
    }, []);

    // Request permission (iOS 13+)
    const requestPermission = useCallback(async () => {
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            try {
                const result = await DeviceOrientationEvent.requestPermission();
                if (result === 'granted') {
                    setPermissionGranted(true);
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                console.error('Orientation permission error:', err);
                // Fallback to debug mode if permission fails
                setIsDesktop(true);
                usingDebug.current = true;
                setPermissionGranted(true);
                return true;
            }
        }
        // No permission needed
        setPermissionGranted(true);
        return true;
    }, []);

    // Listen to device orientation events
    useEffect(() => {
        if (!permissionGranted || usingDebug.current) return;

        const handleOrientation = (event) => {
            if (event.alpha !== null && event.alpha !== undefined) {
                // Normalize alpha to 0-360
                const normalized = ((event.alpha % 360) + 360) % 360;
                setAlpha(Math.round(normalized));
            }
        };

        window.addEventListener('deviceorientation', handleOrientation, true);

        // If no events arrive within 2 seconds, fall back to debug mode
        const timeout = setTimeout(() => {
            setIsDesktop(true);
            usingDebug.current = true;
        }, 2000);

        const earlyDetect = (e) => {
            if (e.alpha !== null) {
                clearTimeout(timeout);
            }
        };
        window.addEventListener('deviceorientation', earlyDetect, { once: true });

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
            window.removeEventListener('deviceorientation', earlyDetect);
            clearTimeout(timeout);
        };
    }, [permissionGranted]);

    // When using debug slider, override alpha
    useEffect(() => {
        if (usingDebug.current || isDesktop) {
            setAlpha(debugAngle);
        }
    }, [debugAngle, isDesktop]);

    return {
        alpha,
        requestPermission,
        permissionGranted,
        isDesktop,
        debugAngle,
        setDebugAngle,
    };
}


==================================================
--- ARQUIVO: src/services/worldLabs.js ---
==================================================
/**
 * World Labs API Service
 * Handles the multi-step async flow: upload images → generate world → poll for result
 *
 * Base URL: https://api.worldlabs.ai/marble/v1
 *
 * CORS Note: If the browser blocks direct calls, configure a Vite proxy in vite.config.js:
 *   server: { proxy: { '/api': { target: 'https://api.worldlabs.ai', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') } } }
 *   Then change BASE_URL to '/api/marble/v1'
 */

const BASE_URL = 'https://api.worldlabs.ai/marble/v1';

function getApiKey() {
    const key = sessionStorage.getItem('wl_api_key');
    if (!key) throw new Error('API Key not found. Please go back and enter your key.');
    return key;
}

function apiHeaders() {
    return {
        'Content-Type': 'application/json',
        'WLT-Api-Key': getApiKey(),
    };
}

/**
 * Step A: Upload a single image blob to World Labs.
 * 1. POST /media-assets:prepare_upload → get upload_url + media_asset_id
 * 2. PUT upload_url with the binary blob (respecting required_headers)
 * Returns: media_asset_id
 */
export async function uploadImage(blob, index = 0) {
    // A1: Prepare upload
    const prepareRes = await fetch(`${BASE_URL}/media-assets:prepare_upload`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({
            file_name: `capture_${index}.jpg`,
            kind: 'image',
            extension: 'jpg',
        }),
    });

    if (!prepareRes.ok) {
        const errorBody = await prepareRes.text();
        throw new Error(`Prepare upload failed (${prepareRes.status}): ${errorBody}`);
    }

    const prepareData = await prepareRes.json();
    const { media_asset, upload_info } = prepareData;
    const mediaAssetId = media_asset.id;
    const uploadUrl = upload_info.upload_url;
    const requiredHeaders = upload_info.required_headers || {};

    // A2: Upload the binary blob to the signed URL
    const uploadHeaders = { ...requiredHeaders };
    // The docs show Content-Type: image/jpeg for the PUT upload
    // but the signed URL may handle this — include it to be safe
    if (!uploadHeaders['Content-Type']) {
        uploadHeaders['Content-Type'] = 'image/jpeg';
    }

    const uploadRes = await fetch(uploadUrl, {
        method: upload_info.upload_method || 'PUT',
        headers: uploadHeaders,
        body: blob,
    });

    if (!uploadRes.ok) {
        const errorBody = await uploadRes.text();
        throw new Error(`Image upload failed (${uploadRes.status}): ${errorBody}`);
    }

    return mediaAssetId;
}

/**
 * Upload all images with controlled concurrency.
 * Returns array of { id, azimuth }.
 * onProgress(uploaded, total) called after each upload completes.
 */
export async function uploadAllImages(capturedImages, onProgress) {
    const CONCURRENCY = 3;
    const results = [];
    let completed = 0;

    // Process in batches of CONCURRENCY
    for (let i = 0; i < capturedImages.length; i += CONCURRENCY) {
        const batch = capturedImages.slice(i, i + CONCURRENCY);
        const batchResults = await Promise.all(
            batch.map(async (img, batchIndex) => {
                const globalIndex = i + batchIndex;
                const mediaAssetId = await uploadImage(img.blob, globalIndex);
                completed++;
                if (onProgress) onProgress(completed, capturedImages.length);
                return { id: mediaAssetId, azimuth: img.azimuth };
            })
        );
        results.push(...batchResults);
    }

    return results;
}

/**
 * Step B: Trigger world generation with 8 uploaded media assets.
 * Returns: operation_id
 */
export async function generateWorld(assetIds, model = 'Marble 0.1-mini') {
    const multiImagePrompt = assetIds.map(({ id, azimuth }) => ({
        azimuth,
        content: {
            source: 'media_asset',
            media_asset_id: id,
        },
    }));

    const body = {
        display_name: '360 Capture',
        world_prompt: {
            type: 'multi-image',
            reconstruct_images: true,
            multi_image_prompt: multiImagePrompt,
            text_prompt: 'A 360 capture of a space',
        },
        model,
    };

    const res = await fetch(`${BASE_URL}/worlds:generate`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`World generation failed (${res.status}): ${errorBody}`);
    }

    const data = await res.json();
    return data.operation_id;
}

/**
 * Step C: Poll an operation until done.
 * Returns the full response object from the completed operation.
 * onStatus(description) called on each poll with the progress description.
 */
export async function pollOperation(operationId, onStatus) {
    const POLL_INTERVAL = 5000; // 5 seconds
    const MAX_POLLS = 120; // 10 minutes max

    for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
        const res = await fetch(`${BASE_URL}/operations/${operationId}`, {
            method: 'GET',
            headers: {
                'WLT-Api-Key': getApiKey(),
            },
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Poll failed (${res.status}): ${errorBody}`);
        }

        const data = await res.json();

        // Report current status
        if (data.metadata?.progress?.description && onStatus) {
            onStatus(data.metadata.progress.description);
        }

        // Check if operation errored
        if (data.error) {
            throw new Error(`Generation error: ${JSON.stringify(data.error)}`);
        }

        // Check if done
        if (data.done) {
            return data;
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }

    throw new Error('Operation timed out after 10 minutes.');
}

/**
 * Full orchestration: upload all images → generate → poll → return result.
 * onProgress({ phase, detail, uploaded, total }) for UI updates.
 */
export async function uploadAndGenerate(capturedImages, onProgress) {
    // Phase 1: Upload images
    onProgress({ phase: 'upload', detail: 'Preparing uploads...', uploaded: 0, total: capturedImages.length });

    const assetIds = await uploadAllImages(capturedImages, (uploaded, total) => {
        onProgress({
            phase: 'upload',
            detail: `Uploading image ${uploaded} of ${total}...`,
            uploaded,
            total,
        });
    });

    // Phase 2: Trigger generation
    onProgress({ phase: 'generate', detail: 'Starting world generation...' });
    const operationId = await generateWorld(assetIds);

    // Phase 3: Poll for result
    onProgress({ phase: 'poll', detail: 'World generation in progress...' });

    const result = await pollOperation(operationId, (description) => {
        onProgress({ phase: 'poll', detail: description });
    });

    // Extract result data
    const response = result.response || {};
    const worldId = result.metadata?.world_id || response.id;

    return {
        panoUrl: response.assets?.imagery?.pano_url || null,
        thumbnailUrl: response.assets?.thumbnail_url || null,
        caption: response.assets?.caption || '',
        worldMarbleUrl: response.world_marble_url || `https://marble.worldlabs.ai/world/${worldId}`,
        worldId,
        splats: response.assets?.splats?.spz_urls || null,
    };
}

