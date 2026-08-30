import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <nav style={{ width: "200px", padding: "1rem", backgroundColor: "#1e1e24", borderRight: "1px solid #333", color: "#fff" }}>
                <h3 style={{ color: "#a55eea" }}>RiskTrace</h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li><Link to="/dashboard" style={{ color: "#ccc", textDecoration: "none" }}>Dashboard</Link></li>
                    <li><Link to="/disputes" style={{ color: "#ccc", textDecoration: "none" }}>Disputes</Link></li>
                    <li><Link to="/patterns" style={{ color: "#ccc", textDecoration: "none" }}>Patterns</Link></li>
                    <li style={{ marginTop: "2rem" }}>
                        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 0, fontSize: "16px" }}>Logout</button>
                    </li>
                </ul>
            </nav>
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto", backgroundColor: "#0f0f12", color: "#eee" }}>
                <Outlet />
            </main>
        </div>
    );
}
