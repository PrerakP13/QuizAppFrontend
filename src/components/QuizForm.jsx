import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Radio, Space, Typography, Spin, message, Modal } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QuizForm = () => {
    const { quizName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);  // ✅ Store score in state
    const [isModalVisible, setIsModalVisible] = useState(false);  // ✅ Track modal visibility
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
            .catch(error => console.log("Error fetching quiz question:", error));
                setQuestions(response.data.questions);
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
                message.error("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [quizName]);

    const handleChange = (questionId, userAnswer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: userAnswer
        }));
    };

    const QuizSubmit = async (event) => {
        event.preventDefault();
        try {
            const responses = Object.entries(answers).map(([questionId, user_answer]) => ({
                question_id: questionId,
                user_answer: user_answer
            }));

            const payload = {
                user_id: "user123",
                responses: responses
            };

            const response = await axios.post(`https://quizappbackend-4aj2.onrender.com/quiz/${quizName}/submit`, payload);

            if (response.data && response.data.score !== undefined) {
                setScore(response.data.score);  // ✅ Store score
                setIsModalVisible(true);  // ✅ Show modal popup
                message.success(`Quiz submitted! Your score: ${response.data.score}`);
            } else {
                message.error("Score not found in response.");
            }

        } catch (error) {
            console.error("Error submitting quiz:", error);
            message.error("Failed to submit quiz.");
        }
    };

    return (
        <Space direction="vertical" style={{ width: "100%", padding: "20px" }}>
            <Button
                icon={<HomeOutlined />}
                style={{ backgroundColor: "#673AB7", borderColor: "#673AB7", color: "white" }}
                onClick={() => navigate("/Dashboard")}
            >
                🏠 Home
            </Button>

            <Title level={2}>{quizName}</Title>

            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <Form onSubmitCapture={QuizSubmit} layout="vertical">
                        {questions.map((q) => (
                            <div key={q._id} style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                                <Title level={4} style={{ color: "#FF5722", marginBottom: "10px" }}>
                                    {q.question}
                                </Title>

                                <Form.Item>
                                    <Radio.Group onChange={(e) => handleChange(q._id, e.target.value)} value={answers[q._id]}>
                                        {q.options.map(option => (
                                            <Radio key={option} value={option} style={{ display: "block", padding: "5px" }}>
                                                {option}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        ))}

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50", color: "white" }}
                        >
                            ✅ Submit Quiz
                        </Button>
                    </Form>
                </>
            )}

            {/* ✅ Modal Popup for Score Display */}
            <Modal
                title="Quiz Results"
                visible={isModalVisible}
                onOk={() => navigate("/Dashboard")}  // ✅ Navigate when user clicks "OK"
                onCancel={() => setIsModalVisible(false)}  // ✅ Allow modal to be closed manually
                centered
            >
                <Title level={3} style={{ color: "#4CAF50", textAlign: "center" }}>
                    🎯 Your Score: {score}
                </Title>
                <Text>Your results have been recorded. Click "OK" to return to the Dashboard.</Text>
            </Modal>
        </Space>
    );
};

export default QuizForm;