import { useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import { useBoardStore } from './store/useBoardStore';

const BoardView = lazy(() => import('./components/BoardView'));
const AnalyticsPage = lazy(() => import('./components/AnalyticsPage'));

function App() {
    const token = useBoardStore(state => state.token);
    const fetchJobs = useBoardStore(state => state.fetchJobs);

    useEffect(() => {
        if (token) {
            fetchJobs();
        }
    }, [token, fetchJobs]);

    if (!token) {
        return <AuthScreen />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BoardView />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
