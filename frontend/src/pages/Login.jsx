import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, demoLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = () => {
        if (login(email, password)) {
            navigate("/dashboard");
        }
    };

    const handleDemoLogin = () => {
        if (demoLogin()) {
            navigate("/dashboard");
        }
    };

    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh",
            backgroundColor: "#08060d", backgroundImage: "radial-gradient(circle at 50% 0%, #2a0b4d 0%, #08060d 50%)",
            fontFamily: "system-ui, sans-serif"
        }}>
            <div style={{
                padding: "3rem",
                borderRadius: "16px",
                width: "400px",
                background: "rgba(20, 18, 25, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(170, 59, 255, 0.2)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(170, 59, 255, 0.1)",
                textAlign: "center"
            }}>
                <h1 style={{ color: "#f3f4f6", margin: "0 0 5px", fontSize: "2rem", letterSpacing: "2px" }}>RISKTRACE</h1>
                <p style={{ color: "#a55eea", margin: "0 0 2rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Merchant Intelligence Platform
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: "12px 16px", borderRadius: "8px", border: "1px solid #2e303a",
                            background: "#16171d", color: "#f3f4f6", outline: "none", fontSize: "1rem"
                        }} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: "12px 16px", borderRadius: "8px", border: "1px solid #2e303a",
                            background: "#16171d", color: "#f3f4f6", outline: "none", fontSize: "1rem"
                        }} 
                    />
                    
                    <button 
                        onClick={handleSignIn} 
                        style={{
                            padding: "14px", marginTop: "1rem", borderRadius: "8px", border: "none",
                            background: "#a55eea", color: "#fff", fontWeight: "bold", fontSize: "1rem",
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        SIGN IN
                    </button>

                    <div style={{ position: "relative", margin: "1rem 0" }}>
                        <hr style={{ borderTop: "1px solid #2e303a", borderBottom: "none" }} />
                        <span style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#110f17", padding: "0 10px", color: "#6b6375", fontSize: "0.8rem" }}>OR</span>
                    </div>

                    <button 
                        onClick={handleDemoLogin} 
                        style={{
                            padding: "14px", borderRadius: "8px", border: "1px solid #a55eea",
                            background: "rgba(170, 59, 255, 0.1)", color: "#a55eea", fontWeight: "bold", fontSize: "1rem",
                            cursor: "pointer", transition: "all 0.2s"
                        }}>
                        ENTER DEMO WORKSPACE
                    </button>
                </div>
            </div>
        </div>
    );
}
