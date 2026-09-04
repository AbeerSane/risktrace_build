import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Zap } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { login, demoLogin } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [status, setStatus] = useState("DEFAULT"); // DEFAULT | LOADING | SUCCESS | ERROR
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === "LOADING") return;

        setStatus("LOADING");
        setErrorMessage("");

        try {
            await login(email, password);
            setStatus("SUCCESS");
            setTimeout(() => navigate("/dashboard"), 400);
        } catch (err) {
            setStatus("ERROR");
            setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
        }
    };

    const handleDemoAccess = () => {
        demoLogin();
        setStatus("SUCCESS");
        setTimeout(() => navigate("/dashboard"), 300);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#08080A",
            backgroundImage: "radial-gradient(circle at 50% 10%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)",
            padding: "2rem",
            fontFamily: "var(--font-sans)"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "1000px",
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                backgroundColor: "var(--bg-surface-1)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.08)"
            }}>
                {/* Left Side: Cinematic AI Investigation Preview */}
                <div style={{
                    padding: "3.5rem",
                    background: "linear-gradient(145deg, #0D0C15 0%, #131221 100%)",
                    borderRight: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "3rem" }}>
                            <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)"
                            }}>
                                <ShieldCheck size={18} color="#fff" />
                            </div>
                            <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "2px", color: "#ffffff" }}>
                                RISKTRACE
                            </span>
                        </div>

                        <span style={{ fontSize: "0.75rem", letterSpacing: "2.5px", fontWeight: 600, color: "#8B5CF6", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>
                            SECURE INVESTIGATION GATEWAY
                        </span>
                        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#F8FAFC", lineHeight: "1.25", marginBottom: "1rem" }}>
                            Defend your business against bad faith chargebacks.
                        </h2>
                        <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
                            Reconstruct transaction paths, analyze contradictory evidence, and generate bank-ready defence packages in seconds.
                        </p>
                    </div>

                    {/* Telemetry Status Card */}
                    <div style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        backgroundColor: "rgba(22, 21, 36, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                        <div className="rt-pulse-live" />
                        <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#F8FAFC" }}>Autonomous Engine Online</div>
                            <div style={{ fontSize: "0.74rem", color: "#94A3B8", fontFamily: "var(--font-mono)" }}>Latency: 18ms | 99.98% Accuracy</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Dedicated Sign In Form */}
                <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ marginBottom: "2rem" }}>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.4rem", letterSpacing: "-0.5px" }}>
                            Welcome back
                        </h1>
                        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                            Sign in to your RiskTrace merchant workspace.
                        </p>
                    </div>

                    {/* Error Summary Banner */}
                    {status === "ERROR" && (
                        <div style={{
                            padding: "0.85rem 1rem",
                            borderRadius: "8px",
                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#EF4444",
                            fontSize: "0.88rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            marginBottom: "1.5rem"
                        }}>
                            <AlertCircle size={16} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label htmlFor="login-email" style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1", marginBottom: "0.5rem" }}>
                                Work Email
                            </label>
                            <input 
                                id="login-email"
                                type="email" 
                                autoComplete="username email"
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rt-input"
                            />
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <label htmlFor="login-password" style={{ fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1" }}>
                                    Password
                                </label>
                                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link dispatched to authorized security contact."); }} style={{ fontSize: "0.8rem", color: "#8B5CF6", transition: "color 0.2s" }}>
                                    Forgot password?
                                </a>
                            </div>
                            <div style={{ position: "relative" }}>
                                <input 
                                    id="login-password"
                                    type={showPassword ? "text" : "password"} 
                                    autoComplete="current-password"
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="rt-input"
                                    style={{ paddingRight: "2.8rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    style={{
                                        position: "absolute",
                                        right: "0.75rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        color: "#64748B",
                                        cursor: "pointer",
                                        padding: "4px"
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === "LOADING"}
                            className="rt-btn rt-btn-primary"
                            style={{ width: "100%", padding: "0.95rem", marginTop: "0.5rem" }}
                        >
                            {status === "LOADING" ? "Authenticating..." : status === "SUCCESS" ? "Authorized ✓" : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ position: "relative", margin: "1.75rem 0", textAlign: "center" }}>
                        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", backgroundColor: "var(--border-subtle)" }} />
                        <span style={{ position: "relative", backgroundColor: "var(--bg-surface-1)", padding: "0 0.75rem", color: "#64748B", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                            OR
                        </span>
                    </div>

                    {/* Instant Demo Access Button */}
                    <button 
                        type="button"
                        onClick={handleDemoAccess} 
                        className="rt-btn rt-btn-secondary"
                        style={{ width: "100%", padding: "0.85rem", gap: "0.6rem" }}
                    >
                        <Zap size={16} color="#8B5CF6" /> Enter Demo Workspace
                    </button>

                    <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.88rem", color: "#94A3B8" }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: "#8B5CF6", fontWeight: 600 }}>
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
