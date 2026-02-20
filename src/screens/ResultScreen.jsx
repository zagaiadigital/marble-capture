import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
    Download,
    Camera,
    Globe,
    Share2,
    Check,
} from 'lucide-react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default function ResultScreen() {
    const { worldResult, resetAll } = useAppContext();
    const [copied, setCopied] = useState(false);

    if (!worldResult) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-cyber-bg">
                <p className="text-cyber-text-dim font-mono text-sm">No result data. Please start a new capture.</p>
            </div>
        );
    }

    const { panoUrl, caption, thumbnailUrl, markers = [] } = worldResult;
    const plugins = useMemo(() => [[MarkersPlugin, { markers }]], [markers]);

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
        if (navigator.share && panoUrl) {
            try {
                await navigator.share({
                    title: 'My 360 World — Marble',
                    text: caption || 'Check out this 360 world I created!',
                    url: panoUrl, // Fallback to sharing the direct image url
                });
            } catch {
                // User cancelled or share failed
            }
        } else if (panoUrl) {
            await navigator.clipboard.writeText(panoUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-cyber-bg overflow-auto">
            {/* Header */}
            <div className="glass px-4 py-4 flex items-center justify-between shrink-0 safe-area-top z-10">
                <div>
                    <h2 className="text-lg font-bold text-white">
                        World <span className="text-neon-green">Generated</span>
                    </h2>
                    <p className="text-xs font-mono text-cyber-text-dim">IMMERSIVE 3D VIEW</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-neon-green" strokeWidth={1.5} />
                </div>
            </div>

            {/* Immersive 360 Viewer */}
            <div className="flex-1 min-h-0 relative bg-black cursor-grab active:cursor-grabbing">
                {panoUrl ? (
                    <ReactPhotoSphereViewer
                        src={panoUrl}
                        height="100%"
                        width="100%"
                        containerClass="w-full h-full"
                        navbar={[]}
                        defaultYaw={0}
                        defaultPitch={0}
                        touchmoveTwoFingers={true}
                        mousewheel={true}
                        plugins={plugins}
                    />
                ) : thumbnailUrl ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <img
                            src={thumbnailUrl}
                            alt="World Thumbnail"
                            className="max-w-full max-h-full rounded-xl border border-cyber-border object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-cyber-text-dim font-mono text-sm">No preview available</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col gap-2.5 safe-area-bottom glass z-10 border-t border-cyber-border/30">
                {/* Download + Share row */}
                <div className="flex gap-2.5">
                    {panoUrl && markers.length === 0 && (
                        <button
                            onClick={handleDownload}
                            className="flex-1 glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text hover:text-white transition-colors border border-cyber-border/50"
                        >
                            <Download className="w-4 h-4" strokeWidth={1.5} />
                            Download Pano
                        </button>
                    )}

                    {panoUrl && !panoUrl.startsWith('blob:') && !panoUrl.startsWith('data:') && (
                        <button
                            onClick={handleShare}
                            className="flex-1 glass py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text hover:text-white transition-colors border border-cyber-border/50"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-neon-green" strokeWidth={2} />
                                    <span className="text-neon-green">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" strokeWidth={1.5} />
                                    Share Link
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* New Capture */}
                <button
                    onClick={resetAll}
                    className="w-full bg-black/40 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-cyber-text-dim hover:text-white transition-colors border border-cyber-border/50"
                >
                    <Camera className="w-4 h-4" strokeWidth={1.5} />
                    Start New Capture
                </button>
            </div>
        </div>
    );
}
