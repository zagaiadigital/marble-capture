import { useRef, useEffect, useMemo } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import { Camera, Paintbrush, Download } from 'lucide-react';

export default function PhotoSphereEditor({
    panoUrl,
    isEditing,
    onCancelEdit,
    onExtractionComplete,
    markers = [],
}) {
    const viewerRef = useRef(null);
    const rawViewerRef = useRef(null);

    const handleReady = (instance) => {
        rawViewerRef.current = instance;
    };

    const handleSelectionComplete = (rect) => {
        if (!rawViewerRef.current) return;

        const viewer = rawViewerRef.current;
        const canvas = viewer.container.querySelector('canvas');
        if (!canvas) return;

        // Calculate center for spherical coordinates
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const sphericalCoords = viewer.dataHelper.viewerCoordsToSphericalCoords({
            x: centerX,
            y: centerY,
        });

        // Extract the visible viewport crop at full physical resolution (DPR-aware)
        const dpr = window.devicePixelRatio || 1;
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = Math.round(rect.width * dpr);
        cropCanvas.height = Math.round(rect.height * dpr);
        const ctx = cropCanvas.getContext('2d');
        ctx.drawImage(
            canvas,
            Math.round(rect.x * dpr), Math.round(rect.y * dpr),
            cropCanvas.width, cropCanvas.height,
            0, 0,
            cropCanvas.width, cropCanvas.height
        );
        const base64Crop = cropCanvas.toDataURL('image/jpeg', 0.85);

        // Build an all-white mask of the same size so Imagen 3 edits the entire region
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = cropCanvas.width;
        maskCanvas.height = cropCanvas.height;
        const mCtx = maskCanvas.getContext('2d');
        mCtx.fillStyle = '#FFFFFF';
        mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        const base64Mask = maskCanvas.toDataURL('image/jpeg', 0.9);

        onExtractionComplete({
            base64Crop,
            base64Mask,
            pitch: sphericalCoords.pitch,
            yaw: sphericalCoords.yaw,
            width: rect.width,
            height: rect.height
        });
    };

    const handleDownloadSnapshot = async () => {
        if (!rawViewerRef.current) return;
        const viewer = rawViewerRef.current;
        const canvas = viewer.container.querySelector('canvas');
        if (!canvas) return;

        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = canvas.width;
        mergeCanvas.height = canvas.height;
        const ctx = mergeCanvas.getContext('2d');

        // Draw base WebGL texture
        ctx.drawImage(canvas, 0, 0);

        const viewerRect = viewer.container.getBoundingClientRect();
        const scaleX = canvas.width / viewerRect.width;
        const scaleY = canvas.height / viewerRect.height;

        // PSV uses CSS background-image for image markers — DOM query returns nothing.
        // Bypass DOM: iterate the markers prop, resolve each marker's viewport position
        // via the data helper, then await image load before drawing.
        await Promise.all(
            markers.map((marker) => {
                return new Promise((resolve) => {
                    if (!marker.image || !marker.position) return resolve();

                    const viewerCoords = viewer.dataHelper.sphericalCoordsToViewerCoords({
                        pitch: marker.position.pitch,
                        yaw: marker.position.yaw,
                    });

                    // viewerCoords may be null when the marker is behind the camera
                    if (!viewerCoords) return resolve();

                    const markerW = (marker.size?.width ?? 100) * scaleX;
                    const markerH = (marker.size?.height ?? 100) * scaleY;
                    const drawX = viewerCoords.x * scaleX - markerW / 2;
                    const drawY = viewerCoords.y * scaleY - markerH / 2;

                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        ctx.drawImage(img, drawX, drawY, markerW, markerH);
                        resolve();
                    };
                    img.onerror = () => resolve(); // skip on error, don't block download
                    img.src = marker.image;
                });
            })
        );

        const link = document.createElement('a');
        link.download = 'marble_360_snapshot.jpg';
        link.href = mergeCanvas.toDataURL('image/jpeg', 1.0);
        link.click();
    };

    // Reactively sync markers prop → live MarkersPlugin instance after AI edits
    useEffect(() => {
        if (!viewerRef.current) return;
        const plugin = viewerRef.current.getPlugin(MarkersPlugin);
        if (plugin) plugin.setMarkers(markers);
    }, [markers]);

    // plugins array only used for initial mount configuration
    const plugins = useMemo(() => [
        [MarkersPlugin, { markers: markers }],
    ], []); // O array vazio previne o crash do raycaster

    return (
        <div className="w-full h-full relative group bg-black shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl border border-cyber-border">
            {/* The 3D Viewer */}
            <div className={`w-full h-full ${isEditing ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}>
                <ReactPhotoSphereViewer
                    ref={viewerRef}
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
                    onReady={handleReady}
                    rendererParameters={{ preserveDrawingBuffer: true }} // CRITICAL FOR CANVAs EXTRACTION
                />
            </div>

            {/* Editing Overlay */}
            {isEditing && (
                <BoundingBoxOverlay
                    onSelectionComplete={handleSelectionComplete}
                    onCancel={onCancelEdit}
                />
            )}

            {/* Badges and Snapshot action */}
            {!isEditing && (
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                    <span className="font-mono text-[10px] text-white/80 bg-black/60 rounded px-2 py-1 flex items-center gap-1.5 backdrop-blur-sm border border-cyber-border/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-amber animate-pulse" />
                        INTERACTIVE 360 STUDIO
                    </span>

                    <button
                        onClick={handleDownloadSnapshot}
                        className="pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl p-2 border border-cyber-border transition-colors group/btn"
                        title="Download Viewport Snapshot"
                    >
                        <Download className="w-5 h-5 text-neon-green group-hover/btn:scale-110 transition-transform" strokeWidth={1.5} />
                    </button>
                </div>
            )}
        </div>
    );
}
