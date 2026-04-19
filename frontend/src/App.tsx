import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Board from './components/Board';
import AddJobModal from './components/AddJobModal';
import JobDetailsPanel from './components/JobDetailsPanel';
import AuthScreen from './components/AuthScreen';
import AnalyticsPage from './components/AnalyticsPage';
import { useBoardStore } from './store/useBoardStore';

function BoardView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const logoutUser = useBoardStore(state => state.logoutUser);

    return (
        <div className="app-container">
            <header className="app-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="app-title">Application Tracker</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn-secondary" onClick={() => navigate('/analytics')}>
                        Analytics
                    </button>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Add Job
                    </button>
                    <button className="btn-secondary" onClick={logoutUser}>
                        Sign Out
                    </button>
                </div>
            </header>
            <main>
                <Board />
            </main>

            {isModalOpen && <AddJobModal onClose={() => setIsModalOpen(false)} />}
            <JobDetailsPanel />
        </div>
    );
}

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
