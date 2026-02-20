import React, { useRef, useState, useEffect } from 'react';
import { Check, X, Undo, Download } from 'lucide-react';

const INTERNAL_WIDTH = 2560;
const INTERNAL_HEIGHT = 1280;

export default function MaskCanvas({ imageUrl, onSaveMask, onCancel }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // We maintain strokes to allow redraws if necessary, but here we can just draw directly onto the canvas.
    // For simplicity and immediate feedback, we will draw directly onto the scaled canvas resolution.

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Setup internal resolution for the canvas
        canvas.width = INTERNAL_WIDTH;
        canvas.height = INTERNAL_HEIGHT;

        const ctx = canvas.getContext('2d');
        // Start with a transparent canvas so we can see the image underneath
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Brush settings
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 40; // thick brush relative to 2560
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Support touch and mouse
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Map CSS bounding rect coordinates to internal 2560x1280 resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        setIsDrawing(false);
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSave = () => {
        const drawingCanvas = canvasRef.current;

        // Create an off-screen canvas to composite the final Mask
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = INTERNAL_WIDTH;
        exportCanvas.height = INTERNAL_HEIGHT;
        const exportCtx = exportCanvas.getContext('2d');

        // 1. Fill completely with black
        exportCtx.fillStyle = '#000000';
        exportCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

        // 2. Draw the white strokes from the user's canvas on top
        exportCtx.drawImage(drawingCanvas, 0, 0);

        // Export as base64 JPEG
        const base64Mask = exportCanvas.toDataURL('image/jpeg', 0.9);
        onSaveMask(base64Mask);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col safe-area-top safe-area-bottom">
            {/* Header Toolbar */}
            <div className="glass px-4 py-4 flex items-center justify-between shrink-0 border-b border-cyber-border/30">
                <button
                    onClick={onCancel}
                    className="p-2 rounded-full bg-cyber-surface hover:bg-cyber-surface/80 transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase">Paint Mask</h2>
                    <span className="text-[10px] text-neon-green font-mono">DRAW AREA TO EDIT</span>
                </div>
                <button
                    onClick={clearCanvas}
                    className="p-2 rounded-full bg-cyber-surface hover:bg-cyber-surface/80 transition-colors"
                >
                    <Undo className="w-5 h-5 text-cyber-text" />
                </button>
            </div>

            {/* Canvas Area */}
            <div
                ref={containerRef}
                className="flex-1 relative w-full overflow-hidden flex items-center justify-center bg-cyber-bg"
            >
                {/* 
                    Because pano images are 2:1 aspect ratio typically, 
                    we constrain the container so both image and canvas overlap perfectly.
                    Instead of arbitrary resizing, we use absolute positioning and 100% width/height 
                    with object-contain behavior, but since canvas stretches, we force an aspect ratio container.
                */}
                <div className="relative w-full max-w-2xl aspect-[2/1] bg-black shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {/* Background Image (Not drawn on canvas to avoid CORS Tainted Canvas on mobile) */}
                    <img
                        src={imageUrl}
                        alt="Pano Background"
                        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                        crossOrigin="anonymous"
                    />

                    {/* Drawing Overlay */}
                    <canvas
                        ref={canvasRef}
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={stopDrawing}
                        onPointerOut={stopDrawing}
                        onPointerCancel={stopDrawing}
                        className="absolute inset-0 w-full h-full object-contain cursor-crosshair touch-none"
                        style={{ touchAction: 'none' }} // CRITICAL: Stop mobile scroll
                    />
                </div>

                {/* Helper hint */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full pointer-events-none animate-pulse">
                    <p className="text-[11px] font-mono text-white tracking-widest uppercase">
                        Use finger to paint mask
                    </p>
                </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="shrink-0 p-4 border-t border-cyber-border/30 glass">
                <button
                    onClick={handleSave}
                    className="w-full bg-neon-green text-cyber-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98] hover:shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                >
                    <Check className="w-5 h-5" strokeWidth={2} />
                    Confirm Mask
                </button>
            </div>
        </div>
    );
}
