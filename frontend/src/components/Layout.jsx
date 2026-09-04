import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, AlertTriangle, Network } from "lucide-react";

export default function Layout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <nav style={{ width: "250px", padding: "1rem", backgroundColor: "#1e1e24", borderRight: "1px solid #333", color: "#fff" }}>
                <h3 style={{ color: "#a55eea", padding: "1rem" }}>RiskTrace</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <NavLink to="/dashboard" style={({isActive}) => ({
                        display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem',
                        textDecoration: 'none', color: isActive ? '#fff' : '#747d8c',
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                        borderRadius: '8px'
                    })}>
                        <LayoutDashboard size={20} /> Command Center
                    </NavLink>
                    <NavLink to="/disputes" style={({isActive}) => ({
                        display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem',
                        textDecoration: 'none', color: isActive ? '#fff' : '#747d8c',
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                        borderRadius: '8px'
                    })}>
                        <AlertTriangle size={20} /> Active Disputes
                    </NavLink>
                    <NavLink to="/patterns" style={({isActive}) => ({
                        display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem',
                        textDecoration: 'none', color: isActive ? '#a55eea' : '#747d8c',
                        background: isActive ? 'rgba(165, 94, 234, 0.1)' : 'transparent',
                        borderRadius: '8px', border: isActive ? '1px solid rgba(165, 94, 234, 0.3)' : '1px solid transparent'
                    })}>
                        <Network size={20} /> Pattern Intel
                    </NavLink>
                    <button onClick={handleLogout} style={{ marginTop: "auto", background: "none", border: "none", color: "#747d8c", cursor: "pointer", padding: "1rem", textAlign: "left", fontSize: "16px" }}>Logout</button>
                </div>
            </nav>
            <main style={{ flex: 1, padding: "2rem", overflowY: "auto", backgroundColor: "#0f0f12", color: "#eee" }}>
                <Outlet />
            </main>
        </div>
    );
}
