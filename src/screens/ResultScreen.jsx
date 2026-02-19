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
