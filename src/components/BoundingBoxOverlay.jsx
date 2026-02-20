import { useState, useRef, useEffect } from 'react';
import { MousePointer2 } from 'lucide-react';

export default function BoundingBoxOverlay({ onSelectionComplete, onCancel }) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Provide a way to escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handlePointerDown = (e) => {
        setIsDrawing(true);
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setCurrentPos({ x, y });
    };

    const handlePointerMove = (e) => {
        if (!isDrawing) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPos({ x, y });
    };

    const handlePointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);

        // Don't trigger for tiny clicks
        if (width > 10 && height > 10) {
            onSelectionComplete({ x, y, width, height });
        }
    };

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const w = Math.abs(currentPos.x - startPos.x);
    const h = Math.abs(currentPos.y - startPos.y);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-50 cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
            {/* Instruction tooltip */}
            {!isDrawing && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-neon-green/30 flex items-center gap-2 pointer-events-none animate-fade-in shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                    <MousePointer2 className="w-4 h-4 text-neon-green animate-bounce" />
                    <span className="text-white text-xs font-bold tracking-wider">CLICK & DRAG TO SELECT OBJECT</span>
                </div>
            )}

            {/* Cancel button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
                className="absolute top-6 right-6 px-4 py-2 bg-black/60 glass rounded-xl text-white text-xs hover:bg-white/10 transition-colors z-50 pointer-events-auto"
            >
                Cancel Edit
            </button>

            {/* The Drawing Box */}
            {isDrawing && w > 0 && h > 0 && (
                <div
                    className="absolute border border-neon-green bg-neon-green/10"
                    style={{
                        left: x,
                        top: y,
                        width: w,
                        height: h,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)' // Dim the rest of the screen
                    }}
                >
                    {/* Corners to make it look technical/cyber */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-green -translate-x-0.5 -translate-y-0.5" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-green translate-x-0.5 -translate-y-0.5" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-green -translate-x-0.5 translate-y-0.5" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-green translate-x-0.5 translate-y-0.5" />
                </div>
            )}
        </div>
    );
}
