import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load active session from localStorage
        const storedUser = localStorage.getItem('risktrace_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('risktrace_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate real asynchronous network validation
        await new Promise(resolve => setTimeout(resolve, 600));

        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        // Check if user is registered in local merchant registry
        const registeredUsers = JSON.parse(localStorage.getItem('risktrace_registered_users') || '[]');
        const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existing) {
            if (existing.password !== password) {
                throw new Error("Invalid password. Please check your credentials.");
            }
            const userData = { name: existing.name, email: existing.email, role: 'merchant' };
            setUser(userData);
            localStorage.setItem('risktrace_user', JSON.stringify(userData));
            return userData;
        }

        // Fallback for default demo / any valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Please enter a valid email address.");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        const fallbackUser = { name: email.split('@')[0], email, role: 'merchant' };
        setUser(fallbackUser);
        localStorage.setItem('risktrace_user', JSON.stringify(fallbackUser));
        return fallbackUser;
    };

    const register = async ({ name, email, password, confirmPassword }) => {
        await new Promise(resolve => setTimeout(resolve, 700));

        if (!name || name.trim().length < 2) {
            throw new Error("Please provide your full name.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error("Please provide a valid work email address.");
        }
        if (!password || password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match. Please verify.");
        }

        const registeredUsers = JSON.parse(localStorage.getItem('risktrace_registered_users') || '[]');
        if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("An account with this email already exists. Please sign in instead.");
        }

        const newUser = { name: name.trim(), email: email.toLowerCase(), password, role: 'merchant' };
        registeredUsers.push(newUser);
        localStorage.setItem('risktrace_registered_users', JSON.stringify(registeredUsers));

        // Auto-login newly registered user
        const userData = { name: newUser.name, email: newUser.email, role: newUser.role };
        setUser(userData);
        localStorage.setItem('risktrace_user', JSON.stringify(userData));
        return userData;
    };

    const demoLogin = () => {
        const demoUser = { name: 'Razorpay Demo Merchant', email: 'demo@razorpay.com', role: 'merchant', isDemo: true };
        setUser(demoUser);
        localStorage.setItem('risktrace_user', JSON.stringify(demoUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('risktrace_user');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#08080A', color: '#8B5CF6' }}>
                <div className="rt-pulse-live" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, demoLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
