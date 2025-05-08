import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [userID, setUserID] = useState("");
    const [userpasswd, setUserPasswd] = useState("");
    const navigate = useNavigate(); 

    const handlelogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/user/login",
                {
                    userID: userID,
                    user_passwd: userpasswd,
                    user_type: "Teacher"
                   
                    
                },
                { withCredentials: true }
            );

            console.log("Login successful", response.data);

            // ✅ Ensure user_type exists in response before storing
            if (!response.data.user_type) {
                alert("Login failed: User type not found!");
                return;
            }

            alert(`Login Successful! User type: ${response.data.user_type}`);
            sessionStorage.setItem("user_type", response.data.user_type);

            // ✅ Navigate only after successful login
            navigate("/Dashboard");

        } catch (error) {
            console.error("Login Error", error);
            alert("Invalid Credentials or Server Error. Please try again.");
        }
    };

    return (
        <>
            <form onSubmit={handlelogin}>
                <label>User ID</label>
                <input
                    type="text"
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}  // ✅ Correct state update 
                /><br />

                <label>Password</label>
                <input
                    type="password"
                    value={userpasswd}
                    onChange={(e) => setUserPasswd(e.target.value)}  // ✅ Correct state update
                /><br />

                <button type="submit">Login</button>
            </form>
        </>
    );
}

export default LoginPage;