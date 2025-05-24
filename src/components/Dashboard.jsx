import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Space, Typography, Spin, message, Modal, List, Input } from "antd";
import {
    HomeOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    LogoutOutlined
} from "@ant-design/icons";

const { Title } = Typography;

const Dashboard = () => {
    const [userType, setUserType] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isNewQuizModalVisible, setIsNewQuizModalVisible] = useState(false);
    const [newQuizName, setNewQuizName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserType = sessionStorage.getItem("user_type");

        if (!storedUserType) {
            message.warning("Unauthorized access! Please log in.");
            navigate("/");
        } else {
            setUserType(storedUserType);
            fetchQuizzes();
        }
    }, [navigate]);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get("https://quizappbackend-4aj2.onrender.com/dashboard", {
                withCredentials: true
            });
            setQuizzes(response.data.quizzes);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
            setError("Failed to load quizzes.");
        } finally {
            setLoading(false);
        }
    };

    const editQuizName = async (quizName) => {
        Modal.confirm({
            title: "Rename Quiz",
            content: "Enter new quiz name:",
            onOk: async () => {
                const newName = prompt("Enter new quiz name:");
                if (!newName) return;
                try {
                    await axios.put(
                        `https://quizappbackend-4aj2.onrender.com/dashboard/update_quiz/${quizName}`,
                        null,
                        {
                            params: { newName },
                            withCredentials: true
                        }
                    );
                    message.success(`Quiz renamed to '${newName}'`);
                    fetchQuizzes();
                } catch (err) {
                    console.error("Error updating quiz:", err);
                    message.error("Failed to update quiz name.");
                }
            }
        });
    };

    const deleteQuiz = async (quizName) => {
        Modal.confirm({
            title: "Delete Quiz?",
            content: `Are you sure you want to delete '${quizName}'?`,
            onOk: async () => {
                try {
                    await axios.delete("https://quizappbackend-4aj2.onrender.com/dashboard/delete_quiz", {
                        data: { QuizName: quizName },
                        withCredentials: true
                    });
                    message.success(`Quiz '${quizName}' deleted successfully!`);
                    fetchQuizzes();
                } catch (err) {
                    console.error("Error deleting quiz:", err);
                    message.error("Failed to delete quiz.");
                }
            }
        });
    };

    // New function: show custom modal for adding a quiz
    const showAddNewQuizModal = () => {
        setNewQuizName(""); // clear previous input
        setIsNewQuizModalVisible(true);
    };

    const handleAddNewQuiz = async () => {
        if (!newQuizName) {
            message.error("Please enter a quiz name.");
            return;
        }
        try {
            await axios.post(
                "https://quizappbackend-4aj2.onrender.com/dashboard/add_new_quiz",
                { QuizName: newQuizName },
                { withCredentials: true }
            );
            message.success(`Quiz '${newQuizName}' created successfully!`);
            setIsNewQuizModalVisible(false);
            fetchQuizzes(); // refresh list
        } catch (err) {
            console.error("Error creating quiz:", err);
            message.error("Failed to create quiz.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "https://quizappbackend-4aj2.onrender.com/user/logout",
                {},
                { withCredentials: true }
            );
            localStorage.removeItem("authToken");
            sessionStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            message.error("Logout failed. Try again!");
        }
    };

    return (
        <Space direction="vertical" style={{ width: "100%", padding: "20px" }}>
            <Button
                icon={<HomeOutlined />}
                style={{
                    backgroundColor: "#673AB7",
                    borderColor: "#673AB7",
                    color: "white"
                }}
                onClick={() => navigate("/Dashboard")}
            >
                🏠 Home
            </Button>

            <Title level={2}>Dashboard</Title>

            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <Title level={3}>Available Quizzes</Title>

                    {error && <Typography.Text type="danger">{error}</Typography.Text>}

                    <List
                        dataSource={quizzes}
                        renderItem={(quiz) => (
                            <List.Item>
                                <Typography.Text>{quiz}</Typography.Text>

                                {userType === "Teacher" && (
                                    <Space>
                                        <Button icon={<EditOutlined />} onClick={() => editQuizName(quiz)}>
                                            Edit Name
                                        </Button>
                                        <Button icon={<PlusOutlined />} onClick={() => navigate(`/createquizbatch/${quiz}`)}>
                                            Add Questions
                                        </Button>
                                        <Button icon={<DeleteOutlined />} danger onClick={() => deleteQuiz(quiz)}>
                                            Delete Quiz
                                        </Button>
                                    </Space>
                                )}

                                {userType === "Student" && (
                                    <Button type="primary" onClick={() => navigate(`/quizform/${quiz}`)}>
                                        Take Quiz
                                    </Button>
                                )}
                            </List.Item>
                        )}
                    />

                    {userType === "Teacher" && (
                        <Button
                            style={{
                                backgroundColor: "#FFC107",
                                borderColor: "#FFC107",
                                color: "black"
                            }}
                            icon={<PlusOutlined />}
                            onClick={showAddNewQuizModal}
                        >
                            ➕ Add New Quiz
                        </Button>
                    )}

                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </Button>

                    {/* Custom Modal for Adding New Quiz */}
                    <Modal
                        title="Create New Quiz"
                        visible={isNewQuizModalVisible}
                        onOk={handleAddNewQuiz}
                        onCancel={() => setIsNewQuizModalVisible(false)}
                        okText="Create"
                    >
                        <Input
                            placeholder="Enter quiz name"
                            value={newQuizName}
                            onChange={(e) => setNewQuizName(e.target.value)}
                        />
                    </Modal>
                </>
            )}
        </Space>
    );
};

export default Dashboard;