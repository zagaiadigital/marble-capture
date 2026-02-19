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
