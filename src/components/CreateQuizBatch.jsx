import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateQuizBatch = () => {
    const { quizName } = useParams(); // ✅ Get quiz name from URL
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = "";
    const navigate = useNavigate();

    // ✅ Fetch existing questions from the database
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/quiz/${quizName}`, { withCredentials: true });
                setQuestions(response.data.questions);
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [quizName]);

    const updateQuestionText = (index, newText) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = newText;
        setQuestions(updatedQuestions);
    };

    const updateOptionText = (qIndex, optIndex, newOptText) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = newOptText;
        setQuestions(updatedQuestions);
    };

    const updateCorrectAnswer = (qIndex, correctAnswer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].correctAnswer = correctAnswer;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", ""], correctAnswer: "" }]);
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push("");
        setQuestions(updatedQuestions);
    };

    const removeOption = (qIndex, optIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.splice(optIndex, 1);
        setQuestions(updatedQuestions);
    };

    const backtohome = () => {
        navigate("/Dashboard");
    };

    // ✅ Submit initial quiz questions when creating a new quiz
    const handleInitialSubmit = async (e) => {
        e.preventDefault();

        const filteredQuestions = questions.filter(q => q.question.trim() !== "");
        if (filteredQuestions.length === 0) {
            alert("At least one question is required!");
            return;
        }

        try {
            const payload = { questions: filteredQuestions };
            console.log("Submitting Initial Quiz Batch:", JSON.stringify(payload, null, 2));

            const response = await axios.post(`http://localhost:8000/quiz/${quizName}/create`, payload, { withCredentials: true });

            alert("Quiz created successfully!");
            setTimeout(() => {
                navigate("/Dashboard")
            }, 6000
            );
        } catch (error) {
            console.error("Error creating quiz batch:", error.response?.data || error);
            alert("Failed to create quiz.");
        }
    };

    // ✅ Update existing quiz questions
    const handleUpdate = async (e) => {
        e.preventDefault();

        const filteredQuestions = questions.filter(q => q.question.trim() !== "");
        if (filteredQuestions.length === 0) {
            alert("At least one question is required!");
            return;
        }

        try {
            const payload = { questions: filteredQuestions };
            console.log("Submitting Updated Quiz Batch:", JSON.stringify(payload, null, 2));

            const response = await axios.put(`http://localhost:8000/quiz/${quizName}/update`, payload, { withCredentials: true });
            
            alert("Quiz batch updated successfully!");
            setTimeout(() => {
                navigate("/Dashboard")
            }, 6000
            );
        } catch (error) {
            console.error("Error updating quiz batch:", error.response?.data || error);
            alert("Failed to update quiz batch.");
        }
    };

    return (
        <>
            <button type="button" align="right" onClick={backtohome}>🏠 Home</button>
            <form>
                {loading && <p>Loading questions...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <h1>{quizName}</h1>

                {!loading &&
                    questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ width: "100%", maxWidth: "1000px", margin: "auto" }}>
                            <textarea
                                placeholder="Enter question"
                                value={q.question}
                                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                style={{
                                    width: "100%",
                                    maxWidth: "1200px",
                                    minHeight: "50px",
                                    whiteSpace: "normal",
                                }}
                            />

                            {q.options.map((opt, optIndex) => (
                                <div key={optIndex}>
                                    <input
                                        type="text"
                                        placeholder="Enter option"
                                        value={opt}
                                        onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                                    />
                                    <button type="button" onClick={() => removeOption(qIndex, optIndex)}>❌ Remove Option</button>
                                </div>
                            ))}

                            <button type="button" onClick={() => addOption(qIndex)}>➕ Add Option</button>

                            <label>Select Correct Answer:</label>
                            <select
                                value={q.correctAnswer}
                                onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
                            >
                                <option value="">Select an answer</option>
                                {q.options.map((opt, optIndex) => (
                                    <option key={optIndex} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))
                }

                <button type="button" align="center" onClick={addQuestion}>➕ Add Another Question</button>
                <br /><br /><br />

                {/* ✅ Separate buttons for quiz creation and updating */}
                <button type="button" onClick={handleInitialSubmit}>🆕 Create Quiz</button>
                <button type="submit" onClick={handleUpdate}>💾 Save Changes</button>
            </form>
        </>
    );
};

export default CreateQuizBatch;