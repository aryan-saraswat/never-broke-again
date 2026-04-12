import Board from './components/Board';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Application Tracker</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}

export default App;
