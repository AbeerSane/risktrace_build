import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDashboardMetrics } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Zap, ChevronRight, AlertTriangle } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardMetrics()
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '1.5rem' }}>
                <div className="cyber-loader"></div>
                <h2 style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#a55eea', fontSize: '1.2rem', margin: 0 }}>Initializing Command Center...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel" style={{ color: '#ff4757', padding: '2rem', border: '1px solid rgba(255, 71, 87, 0.4)', backgroundColor: 'rgba(255, 71, 87, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                <AlertTriangle size={48} />
                <h3 style={{ margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>System Failure</h3>
                <p style={{ fontFamily: 'monospace', margin: 0, opacity: 0.8 }}>{error}</p>
            </div>
        );
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 300, margin: 0, letterSpacing: '1px', color: '#f1f2f6' }}>Command Center</h1>
                <p style={{ color: '#747d8c', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                    Welcome back, {user?.email}
                </p>
            </header>

            {/* Hero Metric & Demo Shortcut */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(20, 18, 25, 0.8) 0%, rgba(15, 15, 18, 0.9) 100%)',
                    border: '1px solid rgba(170, 59, 255, 0.2)',
                    borderRadius: '12px', padding: '3rem 2rem',
                    boxShadow: '0 10px 30px -10px rgba(170, 59, 255, 0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ color: '#a55eea', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>Total Money At Risk</span>
                    <span style={{ fontSize: '4rem', fontWeight: 200, color: '#f1f2f6', letterSpacing: '-2px', textShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}>
                        {formatter.format(metrics.moneyAtRisk)}
                    </span>
                </div>

                <div style={{ 
                    background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(20, 18, 25, 0.9) 100%)',
                    border: '1px solid rgba(231, 76, 60, 0.3)',
                    borderRadius: '12px', padding: '2rem',
                    boxShadow: '0 10px 30px -10px rgba(231, 76, 60, 0.2)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e74c3c', marginBottom: '1rem' }}>
                        <AlertTriangle size={20} />
                        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 600 }}>High Priority Demo</span>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 300, margin: '0 0 1rem 0', color: '#f1f2f6' }}>Contradictory Evidence Detected</h2>
                    <p style={{ color: '#ccc', marginBottom: '2rem', lineHeight: '1.5' }}>
                        A seeded case involving 'Item defective' claims contains conflicting evidence. Ideal for demonstrating AI reasoning capabilities.
                    </p>
                    <button 
                        onClick={() => {
                            const target = metrics.recentDisputes?.find(d => d.reason === "Item defective") || metrics.recentDisputes?.[0];
                            if (target) navigate(`/disputes/${target.id}`);
                        }}
                        style={{
                            background: '#e74c3c', color: '#fff', border: 'none', padding: '1rem 2rem',
                            fontSize: '1rem', fontWeight: 600, letterSpacing: '1px', borderRadius: '8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: '0 5px 15px rgba(231, 76, 60, 0.4)', transition: 'all 0.2s', width: 'fit-content'
                        }}
                    >
                        <Zap size={18} /> LAUNCH LIVE DEMO <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Grid Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <MetricCard title="Active Disputes" value={metrics.activeDisputes} color="#3498db" />
                <MetricCard title="High Priority" value={metrics.highPriorityCases} color="#e74c3c" />
                <MetricCard title="Urgent Deadlines" value={metrics.urgentDeadlines} color="#f39c12" />
                <MetricCard title="Avg Strength" value={`${metrics.averageCaseStrength.toFixed(1)}%`} color="#2ecc71" />
                <MetricCard title="AI Requires Attention" value={metrics.aiInvestigationsRequiringAttention} color="#9b59b6" />
            </div>

            {/* Recent Disputes Table */}
            <div>
                <h3 style={{ color: '#f1f2f6', fontWeight: 400, letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Recent Activity</h3>
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#747d8c' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Dispute ID</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>AI Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.recentDisputes?.map(d => (
                                <tr key={d.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem', color: '#a55eea' }}><Link to={`/disputes/${d.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{d.id.substring(0,8)}...</Link></td>
                                    <td style={{ padding: '1rem', color: '#f1f2f6' }}>{formatter.format(d.amount)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#ccc' }}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: d.decision === 'PENDING' ? '#f39c12' : '#2ecc71' }}>{d.decision}</td>
                                </tr>
                            ))}
                            {(!metrics.recentDisputes || metrics.recentDisputes.length === 0) && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#747d8c' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '50%' }}>
                                                <AlertTriangle size={32} opacity={0.5} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1.1rem', color: '#f1f2f6', marginBottom: '0.5rem' }}>No Active Telemetry</div>
                                                <div style={{ fontSize: '0.9rem' }}>The system has not detected any recent dispute activity.</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, color }) {
    const [hover, setHover] = useState(false);
    return (
        <div 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ 
                background: 'rgba(20, 18, 25, 0.6)', 
                border: `1px solid ${hover ? color : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '8px', 
                padding: '1.5rem',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s ease',
                transform: hover ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hover ? `0 10px 20px -10px ${color}40` : 'none'
            }}
        >
            <span style={{ color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{title}</span>
            <span style={{ color: '#f1f2f6', fontSize: '2.5rem', fontWeight: 300 }}>{value}</span>
        </div>
    );
}
