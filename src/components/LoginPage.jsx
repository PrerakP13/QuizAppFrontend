import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Typography, Space, message, Card } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginPage = () => {
    const [userID, setUserID] = useState("");
    const [userpasswd, setUserPasswd] = useState("");
    const navigate = useNavigate();

    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/user/login", {
                userID: userID,
                user_passwd: userpasswd,
                user_type: "Teacher"
            }, { withCredentials: true });

            console.log("Login successful", response.data);

            if (!response.data.user_type) {
                message.error("Login failed: User type not found!");
                return;
            }

            message.success(`Login Successful! User type: ${response.data.user_type}`);
            sessionStorage.setItem("user_type", response.data.user_type);
            navigate("/Dashboard");
        } catch (error) {
            console.error("Login Error", error);
            message.error("Invalid Credentials or Server Error. Please try again.");
        }
    };

    return (
        <Space direction="vertical" align="center" style={{ width: "100%", padding: "50px" }}>
            <Title level={2} style={{ color: "#673AB7" }}>🎓 Welcome to QuizMaster</Title>
            <Text type="secondary">Your interactive quiz platform for students & teachers.</Text>

            <Card style={{ width: 350, padding: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                <Title level={3}>Login</Title>

                <Form onSubmitCapture={handlelogin} layout="vertical">
                    <Form.Item label="User ID">
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your User ID"
                            value={userID}
                            onChange={(e) => setUserID(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Password">
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your Password"
                            value={userpasswd}
                            onChange={(e) => setUserPasswd(e.target.value)}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        htmlType="submit"
                        style={{ width: "100%", backgroundColor: "#673AB7", borderColor: "#673AB7", color: "white" }}
                    >
                        🔑 Login
                    </Button>
                </Form>
            </Card>
        </Space>
    );
};

export default LoginPage;