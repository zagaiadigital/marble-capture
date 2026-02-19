import { useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Camera, ChevronRight, Hexagon, Crosshair } from 'lucide-react';

export default function CaptureScreen() {
    const { setVideoFile, setScreen, SCREENS } = useAppContext();
    const fileInputRef = useRef(null);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setVideoFile(file);
            setScreen(SCREENS.REVIEW);
        }
    }, [setVideoFile, setScreen, SCREENS]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="h-full w-full bg-cyber-bg flex flex-col items-center justify-between p-6 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-neon-green/10 to-transparent" />
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Top UI */}
            <div className="w-full flex justify-between items-center z-10 glass px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-neon-green" />
                    <span className="font-mono text-white text-sm tracking-widest">AWAITING CAPTURE</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green/40" />
                </div>
            </div>

            {/* Instruction Panel */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-sm mt-8 relative">
                <div className="absolute inset-0 border border-cyber-border rounded-2xl rotate-3 opacity-50 bg-black/40" />
                <div className="absolute inset-0 border border-neon-green/30 rounded-2xl -rotate-1 opacity-50 shadow-[0_0_15px_rgba(0,255,157,0.1)]" />

                <div className="relative glass p-6 rounded-2xl border border-cyber-border w-full flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-cyber-border/50 pb-4">
                        <Hexagon className="w-6 h-6 text-neon-green" />
                        <h2 className="font-mono text-neon-green text-lg tracking-wider">CAPTURE PROTOCOL</h2>
                    </div>

                    <ol className="space-y-4">
                        {[
                            "Select 0.5x Ultra-Wide Lens.",
                            "Lock Exposure.",
                            "Pan slowly 360° around the subject.",
                            "Maximum duration: 30 seconds."
                        ].map((instruction, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-cyber-text">
                                <span className="font-mono text-neon-green opacity-70">
                                    0{idx + 1}
                                </span>
                                <span>{instruction}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Action Area */}
            <div className="z-10 w-full max-w-sm pb-8 pt-10 flex flex-col items-center gap-4">
                <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    onClick={handleButtonClick}
                    className="group relative w-full bg-black border border-neon-green/50 text-neon-green hover:bg-neon-green hover:text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 text-lg uppercase tracking-widest transition-all overflow-hidden shadow-[0_0_20px_rgba(0,255,157,0.15)] hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] active:scale-95"
                >
                    <div className="absolute inset-0 bg-neon-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <Camera className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">OPEN NATIVE CAMERA</span>
                    <ChevronRight className="w-5 h-5 absolute right-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all z-10" />
                </button>
            </div>
        </div>
    );
}
