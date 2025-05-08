import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuizForm from "./QuizForm";
import CreateQuizBatch from "./CreateQuizBatch";

function Dashboard() {
    const [userType, setUserType] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserType = sessionStorage.getItem("user_type");

        if (!storedUserType) {
            alert("Unauthorized access! Please log in.");
            navigate("/");
        } else {
            setUserType(storedUserType);
        }

        fetchQuizzes();  // ✅ Fetch quiz data on mount
    }, [navigate]);

    // ✅ Fetch quizzes dynamically from backend
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get("http://localhost:8000/dashboard", { withCredentials: true });
            setQuizzes(response.data.quizzes);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError("Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ API Requests for Quiz Management
    const editQuizName = async (quizName) => {
        const newName = prompt("Enter new quiz name:");
        if (!newName) return;

        try {
            await axios.put(`http://localhost:8000/dashboard/update_quiz/${quizName}`, null, {
                params: { newName },
                withCredentials: true
            });
            alert(`Quiz '${quizName}' renamed to '${newName}'`);
            fetchQuizzes();  // ✅ Refresh list
        } catch (err) {
            console.error("Error updating quiz:", err);
            alert("Failed to update quiz name.");
        }
    };

    const addQuestions = async (quizName) => {
        alert(`Redirecting to add questions for '${quizName}'`);
        navigate(`/createquizbatch/${quizName}`);
    };

    const deleteQuiz = async (quizName) => {
        if (!window.confirm(`Are you sure you want to delete '${quizName}'?`)) return;

        try {
            await axios.delete("http://localhost:8000/dashboard/delete_quiz", {
                data: { QuizName: quizName },
                withCredentials: true
            });
            alert(`Quiz '${quizName}' deleted successfully!`);
            fetchQuizzes();  // ✅ Refresh list
        } catch (err) {
            console.error("Error deleting quiz:", err);
            alert("Failed to delete quiz.");
        }
    };

    const addNewQuiz = async () => {
        const quizName = prompt("Enter quiz name:");
        if (!quizName) return;

        try {
            await axios.post("http://localhost:8000/dashboard/add_new_quiz", { QuizName: quizName }, { withCredentials: true });
            alert(`Quiz '${quizName}' created successfully!`);
            fetchQuizzes();  // ✅ Refresh list
        } catch (err) {
            console.error("Error creating quiz:", err);
            alert("Failed to create quiz.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/user/logout", {}, { withCredentials: true });

            localStorage.removeItem("authToken");
            sessionStorage.clear();
            navigate("/");

        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Try again!");
        }
    };

    return (
        <>
            <header>
                <h1>Dashboard</h1>
            </header>

            <main style={{ backgroundColor: "lightblue" }}>
                <h2>Available Quizzes</h2>

                {loading && <p>Loading quizzes...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && quizzes.map((quiz) => (
                    <div key={quiz} className="quiz-item">
                        <span>{quiz}</span>

                        {userType === "Teacher" && (
                            <>
                                <button onClick={() => editQuizName(quiz)}>Edit Quiz Name</button>
                                <button onClick={() => addQuestions(quiz)}>Add Questions</button>
                                <button onClick={() => deleteQuiz(quiz)}>Delete Quiz</button>
                            </>
                        )}
                        {userType === "Student" && (
                            <button onClick={() => navigate(`/quizform/${quiz}`)}>Take Quiz</button>
                        )}
                    </div>
                ))}

                {userType === "Teacher" && (
                    <button className="add-quiz" onClick={addNewQuiz}>➕ Add New Quiz</button>
                )}
            </main>

            <button type="button" onClick={handleLogout}>🚪 Logout</button>
        </>
    );
}

export default Dashboard;