import { AppProvider, useAppContext, SCREENS } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import CaptureScreen from './screens/CaptureScreen';
import ReviewScreen from './screens/ReviewScreen';
import ResultScreen from './screens/ResultScreen';

function AppContent() {
    const { screen } = useAppContext();

    switch (screen) {
        case SCREENS.HOME:
            return <HomeScreen />;
        case SCREENS.CAPTURE:
            return <CaptureScreen />;
        case SCREENS.REVIEW:
            return <ReviewScreen />;
        case SCREENS.RESULT:
            return <ResultScreen />;
        default:
            return <HomeScreen />;
    }
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
