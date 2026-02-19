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
