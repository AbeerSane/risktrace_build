import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <nav style={{ width: "200px", padding: "1rem", backgroundColor: "#f4f4f4", borderRight: "1px solid #ccc" }}>
                <h3>RiskTrace</h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/disputes">Disputes</Link></li>
                    <li><Link to="/patterns">Patterns</Link></li>
                    <li style={{ marginTop: "2rem" }}><Link to="/login">Logout</Link></li>
                </ul>
            </nav>
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
                <Outlet />
            </main>
        </div>
    );
}
