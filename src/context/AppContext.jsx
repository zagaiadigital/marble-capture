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
    const [videoFile, setVideoFile] = useState(null);
    const [worldResult, setWorldResult] = useState(null);

    const setApiKey = useCallback((key) => {
        setApiKeyState(key);
        if (key) {
            sessionStorage.setItem('wl_api_key', key);
        } else {
            sessionStorage.removeItem('wl_api_key');
        }
    }, []);

    const resetCapture = useCallback(() => {
        setVideoFile(null);
        setScreen(SCREENS.CAPTURE);
    }, []);

    const resetAll = useCallback(() => {
        setVideoFile(null);
        setWorldResult(null);
        setScreen(SCREENS.HOME);
    }, []);

    // No blob cleanup needed if passing raw File objects
    const value = {
        apiKey,
        setApiKey,
        screen,
        setScreen,
        videoFile,
        setVideoFile,
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
