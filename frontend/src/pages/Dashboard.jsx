import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDashboardMetrics } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Zap, ChevronRight, AlertTriangle, ShieldCheck, ArrowUpRight, TrendingUp, Clock, FileCheck2, Cpu } from "lucide-react";

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

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1.25rem' }}>
                <div className="rt-pulse-live" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8B5CF6', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    SYNCHRONIZING TELEMETRY...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rt-card" style={{ padding: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
                <AlertTriangle size={36} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>Telemetry Stream Disconnected</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>{error}</p>
                <button onClick={() => window.location.reload()} className="rt-btn rt-btn-secondary">
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top Workspace Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <div>
                    <span style={{ fontSize: '0.78rem', color: '#8B5CF6', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        PORTFOLIO RISK SURVEILLANCE
                    </span>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                        Merchant Risk Overview
                    </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button 
                        onClick={() => navigate('/disputes/new')} 
                        className="rt-btn rt-btn-primary"
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                    >
                        Ingest Telemetry <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>

            {/* Hero Section: Financial Exposure & High-Priority Case Launcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                {/* Total Money at Risk Card */}
                <div className="rt-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                    
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                TOTAL DISPUTED EXPOSURE
                            </span>
                            <span className="rt-badge rt-badge-warning">
                                Active Surveillance
                            </span>
                        </div>
                        <div style={{ fontSize: 'clamp(2.8rem, 4vw, 3.8rem)', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-1.5px', fontFamily: 'var(--font-sans)', lineHeight: 1.1 }}>
                            {formatter.format(metrics.moneyAtRisk)}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Active Volume</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>{metrics.activeDisputes} Cases</div>
                        </div>
                        <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-subtle)' }} />
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Average Win Strength</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{metrics.averageCaseStrength.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>

                {/* High Priority Critical Case Launcher */}
                <div className="rt-card" style={{ padding: '2.25rem', borderColor: 'rgba(239, 68, 68, 0.35)', background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.06) 0%, var(--bg-surface-1) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EF4444', marginBottom: '0.75rem' }}>
                            <AlertTriangle size={18} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                CONTRADICTORY EVIDENCE DETECTED
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '0.6rem', letterSpacing: '-0.3px' }}>
                            High-Confidence Defence Ready
                        </h3>
                        <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6' }}>
                            Conflicting facts isolated between tracking coordinates and customer claim. Run the AI engine to generate evidence arbitration packet.
                        </p>
                    </div>

                    <div style={{ marginTop: '1.75rem' }}>
                        <button 
                            onClick={() => {
                                const target = metrics.recentDisputes?.find(d => d.reason === "Item defective") || metrics.recentDisputes?.[0];
                                if (target) navigate(`/disputes/${target.id}`);
                            }}
                            className="rt-btn"
                            style={{ backgroundColor: '#EF4444', color: '#fff', padding: '0.75rem 1.5rem', fontSize: '0.88rem', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)' }}
                        >
                            <Zap size={16} /> Launch Investigation <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Surveillance Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <MetricStatCard 
                    icon={<FileCheck2 size={20} color="#38BDF8" />}
                    title="Active Disputes" 
                    value={metrics.activeDisputes} 
                    detail="Under active review"
                />
                <MetricStatCard 
                    icon={<AlertTriangle size={20} color="#EF4444" />}
                    title="High Priority" 
                    value={metrics.highPriorityCases} 
                    detail="Immediate action needed"
                    badge="CRITICAL"
                />
                <MetricStatCard 
                    icon={<Clock size={20} color="#F59E0B" />}
                    title="Urgent Deadlines" 
                    value={metrics.urgentDeadlines} 
                    detail="< 48h to submit proof"
                />
                <MetricStatCard 
                    icon={<Cpu size={20} color="#8B5CF6" />}
                    title="AI Queue Attention" 
                    value={metrics.aiInvestigationsRequiringAttention} 
                    detail="Review required"
                />
            </div>

            {/* Recent Dispute Stream Table */}
            <div className="rt-card" style={{ padding: '1.75rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F8FAFC', letterSpacing: '-0.2px' }}>
                            Recent Dispute Telemetry
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                            Latest financial challenges received across connected merchant gateways
                        </p>
                    </div>
                    <Link to="/disputes" style={{ fontSize: '0.85rem', color: '#8B5CF6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        View All Disputes <ChevronRight size={16} />
                    </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748B' }}>
                                <th style={{ padding: '0.85rem 1rem' }}>Dispute ID</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Reason</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                <th style={{ padding: '0.85rem 1rem' }}>AI Decision</th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.recentDisputes?.map(d => (
                                <tr 
                                    key={d.id} 
                                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#8B5CF6' }}>
                                        <Link to={`/disputes/${d.id}`} style={{ color: 'inherit' }}>
                                            {d.id.substring(0, 8)}...
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#CBD5E1', fontSize: '0.9rem' }}>
                                        {d.reason}
                                    </td>
                                    <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#F8FAFC' }}>
                                        {formatter.format(d.amount)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="rt-badge rt-badge-info">
                                            {d.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`rt-badge ${d.decision === 'ACCEPT' ? 'rt-badge-success' : d.decision === 'CONTEST' ? 'rt-badge-critical' : 'rt-badge-warning'}`}>
                                            {d.decision}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => navigate(`/disputes/${d.id}`)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                padding: '0.4rem 0.85rem',
                                                color: '#CBD5E1',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.18s ease'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#F8FAFC'; }}
                                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = '#CBD5E1'; }}
                                        >
                                            Investigate →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MetricStatCard({ icon, title, value, detail, badge }) {
    return (
        <div className="rt-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
                    {icon}
                </div>
                {badge && (
                    <span className="rt-badge rt-badge-critical" style={{ fontSize: '0.65rem' }}>
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                    {title}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                    {value}
                </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                {detail}
            </div>
        </div>
    );
}
