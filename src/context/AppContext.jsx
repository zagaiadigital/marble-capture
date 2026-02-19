import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const SCREENS = {
    HOME: 'home',
    CAPTURE: 'capture',
    REVIEW: 'review',
    RESULT: 'result',
};

export function AppProvider({ children }) {
    const [apiKey, setApiKeyState] = useState(() => {
        return sessionStorage.getItem('wl_api_key') || '';
    });
    const [screen, setScreen] = useState(SCREENS.HOME);
    const [capturedImages, setCapturedImages] = useState([]);
    const [worldResult, setWorldResult] = useState(null);

    const setApiKey = useCallback((key) => {
        setApiKeyState(key);
        if (key) {
            sessionStorage.setItem('wl_api_key', key);
        } else {
            sessionStorage.removeItem('wl_api_key');
        }
    }, []);

    const addCapturedImage = useCallback((imageData) => {
        setCapturedImages((prev) => [...prev, imageData]);
    }, []);

    const resetCapture = useCallback(() => {
        // Revoke any existing blob URLs
        capturedImages.forEach((img) => {
            if (img.url) URL.revokeObjectURL(img.url);
        });
        setCapturedImages([]);
        setScreen(SCREENS.CAPTURE);
    }, [capturedImages]);

    const resetAll = useCallback(() => {
        capturedImages.forEach((img) => {
            if (img.url) URL.revokeObjectURL(img.url);
        });
        setCapturedImages([]);
        setWorldResult(null);
        setScreen(SCREENS.HOME);
    }, [capturedImages]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            capturedImages.forEach((img) => {
                if (img.url) URL.revokeObjectURL(img.url);
            });
        };
    }, []);

    const value = {
        apiKey,
        setApiKey,
        screen,
        setScreen,
        capturedImages,
        addCapturedImage,
        resetCapture,
        resetAll,
        worldResult,
        setWorldResult,
        SCREENS,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export { SCREENS };
