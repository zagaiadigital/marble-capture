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
