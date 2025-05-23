import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Select, Space, Typography, Modal, Spin, message } from "antd";
import { PlusOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const CreateQuizBatch = () => {
    const { quizName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`https://quizappbackend-4aj2.onrender.com/quiz/${quizName}`, { withCredentials: true });
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

    // ✅ Ant Design Modal for Confirmation
    const removeQuestion = (qIndex, questionId) => {
        Modal.confirm({
            title: "Delete Question?",
            content: "Are you sure you want to delete this question?",
            onOk: async () => {
                const updatedQuestions = [...questions];

                if (!updatedQuestions[qIndex].question.trim()) {
                    updatedQuestions.splice(qIndex, 1);
                    setQuestions(updatedQuestions);
                    return;
                }

                try {
                    await axios.delete(`https://quizappbackend-4aj2.onrender.com/quiz/${quizName}/remove/${questionId}`, { withCredentials: true });
                    updatedQuestions.splice(qIndex, 1);
                    setQuestions(updatedQuestions);
                    message.success("Question deleted successfully!");
                } catch (error) {
                    console.error("Error deleting question:", error);
                    message.error("Failed to delete question.");
                }
            },
        });
    };

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        const filteredQuestions = questions.filter(q => q.question.trim() !== "");
        if (filteredQuestions.length === 0) {
            message.warning("At least one question is required!");
            return;
        }
        try {
            const payload = { questions: filteredQuestions };
            await axios.post(`https://quizappbackend-4aj2.onrender.com/quiz/${quizName}/create`, payload, { withCredentials: true });
            message.success("Quiz created successfully!");
            navigate("/Dashboard");
        } catch (error) {
            console.error("Error creating quiz batch:", error);
            message.error("Failed to create quiz.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const filteredQuestions = questions.filter(q => q.question.trim() !== "");
        if (filteredQuestions.length === 0) {
            message.warning("At least one question is required!");
            return;
        }
        try {
            const payload = { questions: filteredQuestions };
            await axios.put(`https://quizappbackend-4aj2.onrender.com/quiz/${quizName}/update`, payload, { withCredentials: true });
            message.success("Quiz batch updated successfully!");
            navigate("/Dashboard");
        } catch (error) {
            console.error("Error updating quiz batch:", error);
            message.error("Failed to update quiz batch.");
        }
    };

    return (
        <>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    
                    style={{ backgroundColor: "#673AB7", borderColor: "#673AB7", color: "white" }}
                    onClick={() => navigate("/Dashboard")}
                >
                    🏠 Home
                </Button>
                <Title level={2}>{quizName}</Title>
            </Space>


            {loading ? (
                <Spin size="large" />
            ) : (
                <Form layout="vertical">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                            <Form.Item label={<span style={{ fontWeight: "bold", fontSize: "18px", color: "#FF5722" }}>
                                Question {qIndex + 1}
                            </span>
                            }>
                                <Input.TextArea
                                    value={q.question}
                                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                    placeholder="Enter question"
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                />
                            </Form.Item>

                            {q.options.map((opt, optIndex) => (
                                <Space key={optIndex} style={{ display: "flex", marginBottom: "10px" }}>
                                    <Input
                                        value={opt}
                                        onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                                        placeholder="Enter option"
                                    />
                                    <Button type="danger" icon={<DeleteOutlined />} style={{ borderColor:"Red" }} onClick={() => removeOption(qIndex, optIndex)}>
                                        <b>Remove</b>
                                    </Button>
                                </Space>
                            ))}

                            <Button type="dashed" style={{ borderColor:"Black" }} icon={<PlusOutlined />} onClick={() => addOption(qIndex)}>
                                Add Option
                            </Button>

                            <Form.Item label="Select Correct Answer">
                                <Select
                                    value={q.correctAnswer}
                                    onChange={(value) => updateCorrectAnswer(qIndex, value)}
                                    placeholder="Select correct answer"
                                >
                                    {q.options.map((opt, optIndex) => (
                                        <Option key={optIndex} value={opt}>
                                            {opt}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Button type="danger" icon={<DeleteOutlined />} style={{ backgroundColor: "#ffcccb", borderColor: "black" }} onClick={() => removeQuestion(qIndex, q._id)}>
                                Delete Question
                            </Button>
                        </div>
                    ))}

                        <Button
                            style={{ backgroundColor: "#FFC107", borderColor: "#FFC107", color: "black" }}
                            onClick={addQuestion}
                        >
                            ➕ Add Another Question
                        </Button>


                    <Space style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                            <Button
                                style={{ backgroundColor: "#FF5722", borderColor: "#FF5722", color: "white" }}
                                onClick={handleInitialSubmit}
                            ><b>🆕 Create Quiz</b></Button>
                            <Button
                                style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50", color: "black" }}
                                onClick={handleUpdate}
                            >
                                💾 Save Changes
                            </Button>

                    </Space>
                </Form>
            )}
        </>
    );
};

export default CreateQuizBatch;