import React, { useState } from "react";
import axios from "axios";

const CreateQuizBatch = () => {
    const [questions, setQuestions] = useState([
        { question: "", options: ["", ""], correctAnswer: "" }  // ✅ Start with two empty options
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", ""], correctAnswer: "" }]);  // ✅ Ensure new question starts with 2 options
    };

    const handleAddOption = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push("");  // ✅ Add empty option field
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { questions };
            console.log("Submitting Quiz Batch:", payload);  // ✅ Debugging
            const response = await axios.post("http://localhost:8000/quiz/create-quiz-batch", payload);
            alert("Quiz batch created successfully!");
            setQuestions([{ question: "", options: ["", ""], correctAnswer: "" }]);  // ✅ Reset form after submission
        } catch (error) {
            console.error("Error creating quiz batch:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
                <div key={index}>
                    <input type="text" placeholder="Enter question" value={q.question} onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].question = e.target.value;
                        setQuestions(updatedQuestions);
                    }} />
                    {q.options.map((opt, optIndex) => (
                        <input key={optIndex} type="text" placeholder="Enter option" value={opt} onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].options[optIndex] = e.target.value;
                            setQuestions(updatedQuestions);
                        }} />
                    ))}
                    <button type="button" onClick={() => handleAddOption(index)}>Add Option</button>
                    <select value={q.correctAnswer} onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].correctAnswer = e.target.value;
                        setQuestions(updatedQuestions);
                    }}>
                        <option value="">Select Correct Answer</option>
                        {q.options.map((opt, optIndex) => <option key={optIndex} value={opt}>{opt}</option>)}
                    </select>
                </div>
            ))}
            <button type="button" onClick={handleAddQuestion}>Add Another Question</button>
            <button type="submit">Create Quiz Batch</button>
        </form>
    );
};

export default CreateQuizBatch;