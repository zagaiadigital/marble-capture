import { useState, useEffect, useCallback, useRef } from 'react';

export function useDeviceOrientation() {
    const [alpha, setAlpha] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [debugAngle, setDebugAngle] = useState(0);
    const usingDebug = useRef(false);

    // Detect if we need iOS permission or if on desktop
    useEffect(() => {
        const hasOrientation = 'DeviceOrientationEvent' in window;
        const needsPermission =
            hasOrientation &&
            typeof DeviceOrientationEvent.requestPermission === 'function';

        if (!hasOrientation) {
            // Desktop fallback
            setIsDesktop(true);
            usingDebug.current = true;
            setPermissionGranted(true);
        } else if (!needsPermission) {
            // Android or older iOS — permission not needed
            setPermissionGranted(true);
        }
        // If needsPermission, wait for user click to request
    }, []);

    // Request permission (iOS 13+)
    const requestPermission = useCallback(async () => {
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            try {
                const result = await DeviceOrientationEvent.requestPermission();
                if (result === 'granted') {
                    setPermissionGranted(true);
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                console.error('Orientation permission error:', err);
                // Fallback to debug mode if permission fails
                setIsDesktop(true);
                usingDebug.current = true;
                setPermissionGranted(true);
                return true;
            }
        }
        // No permission needed
        setPermissionGranted(true);
        return true;
    }, []);

    // Listen to device orientation events
    useEffect(() => {
        if (!permissionGranted || usingDebug.current) return;

        const handleOrientation = (event) => {
            if (event.alpha !== null && event.alpha !== undefined) {
                // Normalize alpha to 0-360
                const normalized = ((event.alpha % 360) + 360) % 360;
                setAlpha(Math.round(normalized));
            }
        };

        window.addEventListener('deviceorientation', handleOrientation, true);

        // If no events arrive within 2 seconds, fall back to debug mode
        const timeout = setTimeout(() => {
            setIsDesktop(true);
            usingDebug.current = true;
        }, 2000);

        const earlyDetect = (e) => {
            if (e.alpha !== null) {
                clearTimeout(timeout);
            }
        };
        window.addEventListener('deviceorientation', earlyDetect, { once: true });

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation, true);
            window.removeEventListener('deviceorientation', earlyDetect);
            clearTimeout(timeout);
        };
    }, [permissionGranted]);

    // When using debug slider, override alpha
    useEffect(() => {
        if (usingDebug.current || isDesktop) {
            setAlpha(debugAngle);
        }
    }, [debugAngle, isDesktop]);

    return {
        alpha,
        requestPermission,
        permissionGranted,
        isDesktop,
        debugAngle,
        setDebugAngle,
    };
}
