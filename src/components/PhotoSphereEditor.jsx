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

        // Get the real equirectangular dimensions of the pano
        // Usually, PhotoSphereViewer exposes the original texture size or we default to a standard high-res size 
        const panoWidth = viewer.textureData?.width || 2048;
        const panoHeight = viewer.textureData?.height || 1024;

        // Use an offscreen canvas to generate an equirectangular mask
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = panoWidth;
        maskCanvas.height = panoHeight;
        const ctx = maskCanvas.getContext('2d');

        // Fill completely with black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, panoWidth, panoHeight);

        // Approximate the bounding box in equirectangular space
        // PSV yaw goes from 0 to 2PI. Pitch goes from -PI/2 to PI/2.
        let yaw = sphericalCoords.yaw; // 0 to 2PI
        let pitch = sphericalCoords.pitch; // -PI/2 to PI/2

        // Map to x, y in pixels
        // yaw 0 is center, PSV wraps from 0 to 2PI
        // Actually PSV yaw 0 is at x = width / 2.
        const center_x = (yaw / (2 * Math.PI)) * panoWidth;
        // Pitch PI/2 is top (0), -PI/2 is bottom (height)
        const center_y = (0.5 - pitch / Math.PI) * panoHeight;

        // Estimate width and height in equirectangular pixels based on current zoom / FOV.
        // PSV v5 does NOT have dataHelper.getFov().
        // Instead, derive vFov from minFov/maxFov and current zoom level (0=maxFov, 100=minFov).
        const zoomLevel = viewer.getZoomLevel(); // 0 to 100
        const maxFov = viewer.config?.maxFov ?? 90;
        const minFov = viewer.config?.minFov ?? 30;
        const vFov = maxFov - (zoomLevel / 100) * (maxFov - minFov); // degrees
        const viewportHeight = canvas.clientHeight || viewer.container.clientHeight;
        const viewportWidth = canvas.clientWidth || viewer.container.clientWidth;

        // Vertical pixels to degrees
        const degPerPixelY = vFov / viewportHeight;
        const maskHeightDegrees = rect.height * degPerPixelY;
        const maskHeightPixelsEqui = (maskHeightDegrees / 180) * panoHeight;

        // Horizontal pixels to degrees (approximate based on latitude)
        const hFov = vFov * (viewportWidth / viewportHeight);
        const degPerPixelX = hFov / viewportWidth;
        const maskWidthDegrees = rect.width * degPerPixelX;
        // Longitude stretches near the poles, but this is a good enough approximation for AI inpainting masks
        const maskWidthPixelsEqui = (maskWidthDegrees / 360) * panoWidth;

        // Draw white mask rectangle
        ctx.fillStyle = '#FFFFFF';
        // Handle wrap-around for X
        const startX = center_x - maskWidthPixelsEqui / 2;
        const startY = center_y - maskHeightPixelsEqui / 2;

        ctx.fillRect(startX, startY, maskWidthPixelsEqui, maskHeightPixelsEqui);

        // If it wraps around the right edge
        if (startX + maskWidthPixelsEqui > panoWidth) {
            ctx.fillRect(startX - panoWidth, startY, maskWidthPixelsEqui, maskHeightPixelsEqui);
        }
        // If it wraps around the left edge
        if (startX < 0) {
            ctx.fillRect(startX + panoWidth, startY, maskWidthPixelsEqui, maskHeightPixelsEqui);
        }

        // Extremely small low quality jpeg so payload size is minimal (< 50kb for mask)
        const base64Mask = maskCanvas.toDataURL('image/jpeg', 0.5);

        onExtractionComplete({
            base64Crop: base64Mask, // Send the mask here
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
