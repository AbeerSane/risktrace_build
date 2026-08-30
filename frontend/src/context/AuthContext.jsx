import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session in localStorage
        const storedUser = localStorage.getItem('risktrace_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simple hackathon mock login
        if (email && password) {
            const userData = { email, role: 'merchant' };
            setUser(userData);
            localStorage.setItem('risktrace_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const demoLogin = () => {
        // Immediately opens the seeded demo merchant environment
        const demoUser = { email: 'demo@razorpay.com', role: 'merchant', isDemo: true };
        setUser(demoUser);
        localStorage.setItem('risktrace_user', JSON.stringify(demoUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('risktrace_user');
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, demoLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
