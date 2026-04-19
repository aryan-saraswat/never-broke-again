import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../store/useBoardStore.ts';
import AddJobModal from './AddJobModal.tsx';
import Board from './Board.tsx';
import JobDetailsPanel from './JobDetailsPanel.tsx';

const BoardView = () => {
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
};

export default BoardView;
