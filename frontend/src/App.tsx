import { useState } from 'react';
import Board from './components/Board';
import AddJobModal from './components/AddJobModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="app-title">Application Tracker</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Job
        </button>
      </header>
      <main>
        <Board />
      </main>
      
      {isModalOpen && <AddJobModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default App;
