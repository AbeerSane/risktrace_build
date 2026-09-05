import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, AlertTriangle, Network, PlusCircle, LogOut, ShieldCheck, User } from "lucide-react";

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getPageTitle = (pathname) => {
        if (pathname.includes("/disputes/new")) return "Ingest New Dispute Telemetry";
        if (pathname.includes("/disputes/")) return "AI Case Investigation";
        if (pathname.includes("/disputes")) return "Active Dispute Registry";
        if (pathname.includes("/patterns")) return "Systemic Pattern Intelligence";
        return "Dispute Command Center";
    };

    const isDisputesActive = location.pathname === "/disputes" || (location.pathname.startsWith("/disputes/") && location.pathname !== "/disputes/new");
    const isIngestActive = location.pathname === "/disputes/new";

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
            {/* Minimalist Elevated Sidebar */}
            <aside style={{ 
                width: "260px", 
                backgroundColor: "var(--bg-surface-1)", 
                borderRight: "1px solid var(--border-subtle)", 
                display: "flex",
                flexDirection: "column",
                zIndex: 30
            }}>
                {/* Brand Header */}
                <div style={{ padding: "1.75rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "7px",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(139, 92, 246, 0.35)"
                    }}>
                        <ShieldCheck size={17} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "1.5px", color: "#F8FAFC" }}>
                            RISKTRACE
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#8B5CF6", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                            MERCHANT WORKSPACE
                        </div>
                    </div>
                </div>

                {/* Primary Navigation */}
                <nav style={{ padding: "1.25rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
                    <div style={{ padding: "0 0.75rem 0.5rem 0.75rem", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                        NAVIGATION
                    </div>

                    <NavLink 
                        to="/dashboard" 
                        end
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.88rem",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "#F8FAFC" : "#94A3B8",
                            backgroundColor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                            border: isActive ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                            transition: "all 0.18s ease"
                        })}
                    >
                        <LayoutDashboard size={18} color="#8B5CF6" />
                        <span>Command Center</span>
                    </NavLink>

                    <NavLink 
                        to="/disputes" 
                        end
                        style={() => ({
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.88rem",
                            fontWeight: isDisputesActive ? 600 : 500,
                            color: isDisputesActive ? "#F8FAFC" : "#94A3B8",
                            backgroundColor: isDisputesActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                            border: isDisputesActive ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                            transition: "all 0.18s ease"
                        })}
                    >
                        <AlertTriangle size={18} color="#F59E0B" />
                        <span>Active Disputes</span>
                    </NavLink>

                    <NavLink 
                        to="/patterns" 
                        end
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.88rem",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "#F8FAFC" : "#94A3B8",
                            backgroundColor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                            border: isActive ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                            transition: "all 0.18s ease"
                        })}
                    >
                        <Network size={18} color="#38BDF8" />
                        <span>Pattern Intel</span>
                    </NavLink>

                    <NavLink 
                        to="/disputes/new" 
                        end
                        style={() => ({
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.88rem",
                            fontWeight: isIngestActive ? 600 : 500,
                            color: isIngestActive ? "#F8FAFC" : "#94A3B8",
                            backgroundColor: isIngestActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                            border: isIngestActive ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
                            transition: "all 0.18s ease"
                        })}
                    >
                        <PlusCircle size={18} color="#10B981" />
                        <span>Ingest Dispute</span>
                    </NavLink>
                </nav>

                {/* Sidebar User Footer */}
                <div style={{ padding: "1.25rem", borderTop: "1px solid var(--border-subtle)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--bg-surface-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={15} color="#94A3B8" />
                            </div>
                            <div style={{ overflow: "hidden" }}>
                                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F8FAFC", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {user?.name || "Merchant"}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {user?.email || "demo@razorpay.com"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            padding: "0.55rem",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                            color: "#94A3B8",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            transition: "all 0.18s ease"
                        }}
                        onMouseOver={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)"; }}
                        onMouseOut={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Application Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                {/* Top Telemetry Header */}
                <header style={{
                    height: "64px",
                    padding: "0 2.5rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(15, 14, 23, 0.6)",
                    backdropFilter: "blur(12px)",
                    zIndex: 20
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <h1 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#F8FAFC" }}>
                            {getPageTitle(location.pathname)}
                        </h1>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.75rem", borderRadius: "9999px", backgroundColor: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                            <div className="rt-pulse-live" />
                            <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 600, color: "#10B981" }}>
                                SYSTEM LIVE
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <main style={{ flex: 1, padding: "2.5rem", overflowY: "auto" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
