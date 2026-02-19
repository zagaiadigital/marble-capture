import { useRef, useState, useCallback, useEffect } from 'react';

export function useCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                videoRef.current.setAttribute('autoplay', 'true');
                videoRef.current.setAttribute('muted', 'true');
                await videoRef.current.play();
                setIsReady(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setError(err.message || 'Failed to access camera');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsReady(false);
    }, []);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !videoRef.current.videoWidth) {
            return null;
        }

        const video = videoRef.current;
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;

        // Resize if > 1920px width to save mobile memory
        const MAX_WIDTH = 1920;
        if (targetWidth > MAX_WIDTH) {
            const ratio = MAX_WIDTH / targetWidth;
            targetWidth = MAX_WIDTH;
            targetHeight = Math.round(targetHeight * ratio);
        }

        // Create or reuse canvas
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                'image/jpeg',
                0.8
            );
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return {
        videoRef,
        isReady,
        error,
        startCamera,
        stopCamera,
        takePhoto,
    };
}
