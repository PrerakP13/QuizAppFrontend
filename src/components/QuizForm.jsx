import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuizForm() {
    const { quizName } = useParams();
    const [question, setQuestion] = useState([]);
    const [answer, setAnswer] = useState({}); // ✅ Use an object instead of array
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/quiz/${quizName}`)
            .then(response => setQuestion(response.data.questions))  // ✅ Change `question` to `questions`
            .catch(error => console.log("Error fetching quiz question:", error));
    }, []);

    const handleChange = (questionId, userAnswer) => {
        setAnswer(prev => ({
            ...prev,
            [questionId]: userAnswer
        }));
    };

    const QuizSubmit = async (event) => {
        event.preventDefault();

        try {
            const responses = Object.entries(answer).map(([questionId, user_answer]) => ({
                question_id: questionId,
                user_answer: user_answer
            }));

            const payload = {
                user_id: "user123",  // ✅ Make sure this is included
                responses: responses
            };

            const response = await axios.post(`http://localhost:8000/quiz/${quizName}/submit`, payload);
            alert(`Quiz submitted! Your score: ${response.data.score}`);
            setTimeout(() => {
                navigate("/Dashboard")
            }, 6000
            );
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    return (
        <>
            <h1>{quizName}</h1>
            <br></br><br></br>
        <form onSubmit={QuizSubmit}>
            {question.map((q) => (
                <div key={q._id}>
                    <h3>{q.question}</h3>
                    {q.options.map(option => (
                        <label key={option}>
                            <input
                                type="radio"
                                name={q._id}  // ✅ Ensure `_id` is used here
                                value={option}
                                checked={answer[q._id] === option}
                                onChange={() => handleChange(q._id, option)}  // ✅ Pass correct `_id`
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ))}
            <button type="submit">Submit Quiz</button>
            </form>
        </>
    );
}

export default QuizForm;