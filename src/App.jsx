import { useState } from 'react';
import QuizForm from './components/QuizForm';
import CreateQuizBatch from './components/CreateQuizBatch';
import './App.css';

function App() {
    const [view, setView] = useState("");  // ✅ Tracks which feature user selects

    return (
        <>
            <header>
                <h1>Welcome to the Quiz App!</h1>
            </header>

            <div>
                <button onClick={() => setView("create")}>Create a Quiz</button>
                <button onClick={() => setView("attempt")}>Attempt a Quiz</button>
            </div>

            {view === "create" && <CreateQuizBatch />}  {/* ✅ Show quiz creation form */}
            {view === "attempt" && <QuizForm />}        {/* ✅ Show quiz attempt interface */}
        </>
    );
}

export default App;