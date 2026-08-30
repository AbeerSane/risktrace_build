import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <div style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: "8px", width: "300px" }}>
                <h2>RiskTrace Login</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "1rem" }}>
                    <input type="text" placeholder="Username" style={{ padding: "8px" }} />
                    <input type="password" placeholder="Password" style={{ padding: "8px" }} />
                    <button onClick={() => navigate("/dashboard")} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
