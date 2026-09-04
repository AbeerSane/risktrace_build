import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [status, setStatus] = useState("DEFAULT"); // DEFAULT | LOADING | SUCCESS | ERROR
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === "LOADING") return;

        setStatus("LOADING");
        setErrorMessage("");

        try {
            await register({ name, email, password, confirmPassword });
            setStatus("SUCCESS");
            setTimeout(() => navigate("/dashboard"), 400);
        } catch (err) {
            setStatus("ERROR");
            setErrorMessage(err.message || "Failed to create account. Please check your inputs.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#08080A",
            backgroundImage: "radial-gradient(circle at 50% 90%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)",
            padding: "2rem",
            fontFamily: "var(--font-sans)"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "540px",
                backgroundColor: "var(--bg-surface-1)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "20px",
                padding: "3.5rem 3rem",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.08)"
            }}>
                {/* Brand Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1rem auto",
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)"
                    }}>
                        <ShieldCheck size={22} color="#fff" />
                    </div>

                    <span style={{ fontSize: "0.75rem", letterSpacing: "2.5px", fontWeight: 600, color: "#8B5CF6", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                        MERCHANT ONBOARDING
                    </span>
                    <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#F8FAFC", marginBottom: "0.4rem", letterSpacing: "-0.5px" }}>
                        Create your account
                    </h1>
                    <p style={{ color: "#94A3B8", fontSize: "0.92rem" }}>
                        Start investigating payment risk and defending dispute revenue.
                    </p>
                </div>

                {/* Error Banner */}
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

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <div>
                        <label htmlFor="reg-name" style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1", marginBottom: "0.45rem" }}>
                            Full Name
                        </label>
                        <input 
                            id="reg-name"
                            type="text" 
                            autoComplete="name"
                            placeholder="Abeer Sane" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="rt-input"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-email" style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1", marginBottom: "0.45rem" }}>
                            Work Email
                        </label>
                        <input 
                            id="reg-email"
                            type="email" 
                            autoComplete="email"
                            placeholder="name@company.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rt-input"
                        />
                    </div>

                    <div>
                        <label htmlFor="reg-password" style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1", marginBottom: "0.45rem" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input 
                                id="reg-password"
                                type={showPassword ? "text" : "password"} 
                                autoComplete="new-password"
                                placeholder="Create a secure password (min 6 chars)" 
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

                    <div>
                        <label htmlFor="reg-confirm" style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#CBD5E1", marginBottom: "0.45rem" }}>
                            Confirm Password
                        </label>
                        <input 
                            id="reg-confirm"
                            type={showPassword ? "text" : "password"} 
                            autoComplete="new-password"
                            placeholder="Re-enter password to confirm" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="rt-input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={status === "LOADING"}
                        className="rt-btn rt-btn-primary"
                        style={{ width: "100%", padding: "0.95rem", marginTop: "0.6rem" }}
                    >
                        {status === "LOADING" ? "Creating Account..." : status === "SUCCESS" ? "Account Created ✓" : "Create Account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.88rem", color: "#94A3B8" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#8B5CF6", fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
