﻿import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import CreateQuizBatch from "./components/CreateQuizBatch";
import QuizForm from "./components/QuizForm";
import { ConfigProvider } from "antd";

function App() {
    return (
        <ConfigProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path='/createquizbatch/:quizName' element={<CreateQuizBatch />} />
                <Route path='/quizform/:quizName' element={<QuizForm />} />
            </Routes>
            </Router>
        </ConfigProvider>
    );
}

export default App;