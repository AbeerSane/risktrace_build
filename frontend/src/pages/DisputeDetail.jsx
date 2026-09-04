import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDisputeDetails, startInvestigation, pollInvestigation } from "../api/api";
import InvestigationSequence from "../components/InvestigationSequence";
import FinalWorkspace from "../components/FinalWorkspace";
import { PlayCircle, ArrowLeft, AlertTriangle, ShieldCheck, Cpu, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DisputeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dispute, setDispute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // View States: 'INITIAL' | 'ANIMATING' | 'WORKSPACE'
    const [viewState, setViewState] = useState('INITIAL');
    const [sessionId, setSessionId] = useState(null);
    const [backendStatus, setBackendStatus] = useState(null);
    const [payload, setPayload] = useState(null);

    useEffect(() => {
        fetchDisputeDetails(id)
            .then(data => {
                setDispute(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Polling mechanism during ANIMATING state
    useEffect(() => {
        let interval;
        if (viewState === 'ANIMATING' && sessionId) {
            interval = setInterval(() => {
                pollInvestigation(sessionId)
                    .then(sessionData => {
                        setBackendStatus(sessionData.status);
                        if (sessionData.status === 'COMPLETE' || sessionData.status === 'FAILED') {
                            if (sessionData.resultPayload) {
                                try {
                                    setPayload(JSON.parse(sessionData.resultPayload));
                                } catch (e) {
                                    console.error("Failed to parse resultPayload", e);
                                }
                            }
                            clearInterval(interval);
                        }
                    })
                    .catch(console.error);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [viewState, sessionId]);

    const handleInitiate = async () => {
        try {
            setViewState('ANIMATING');
            const session = await startInvestigation(id);
            setSessionId(session.id);
            setBackendStatus(session.status);
        } catch (err) {
            console.error("Failed to initiate investigation", err);
            alert("Unable to initiate AI engine. Ensure backend server is running.");
            setViewState('INITIAL');
        }
    };

    if (loading) return (
        <div style={{ padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', justifyContent: 'center' }}>
            <div className="rt-pulse-live" style={{ width: '16px', height: '16px' }} />
            <div style={{ color: '#8B5CF6', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                FETCHING DISPUTE TELEMETRY...
            </div>
        </div>
    );

    if (error) return (
        <div className="rt-card" style={{ padding: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
            <AlertTriangle size={40} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#F8FAFC' }}>Case Telemetry Unavailable</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>{error}</p>
            <button onClick={() => navigate('/disputes')} className="rt-btn rt-btn-secondary">
                ← Return to Registry
            </button>
        </div>
    );

    if (viewState === 'ANIMATING') {
        return (
            <InvestigationSequence 
                backendStatus={backendStatus} 
                onAnimationComplete={() => setViewState('WORKSPACE')} 
            />
        );
    }

    const handleReassess = async () => {
        try {
            const session = await startInvestigation(id);
            setSessionId(session.id);
            setBackendStatus(session.status);
            
            const pollInterval = setInterval(async () => {
                const sessionData = await pollInvestigation(session.id);
                if (sessionData.status === 'COMPLETE' || sessionData.status === 'FAILED') {
                    if (sessionData.resultPayload) {
                        try {
                            setPayload(JSON.parse(sessionData.resultPayload));
                        } catch (e) {
                            console.error("Failed to parse resultPayload on reassess", e);
                        }
                    }
                    clearInterval(pollInterval);
                }
            }, 500);
        } catch (err) {
            console.error("Failed to reassess case", err);
        }
    };

    if (viewState === 'WORKSPACE') {
        return (
            <div>
                <button 
                    onClick={() => navigate('/disputes')} 
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', padding: 0 }}
                    onMouseOver={e => e.currentTarget.style.color = '#F8FAFC'}
                    onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
                >
                    <ArrowLeft size={16} /> Back to Dispute Registry
                </button>
                <FinalWorkspace dispute={dispute} payload={payload} onReassess={handleReassess} />
            </div>
        );
    }

    // INITIAL VIEW: Clean Forensic Launcher
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    return (
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <button 
                onClick={() => navigate('/disputes')} 
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: 0, width: 'fit-content' }}
                onMouseOver={e => e.currentTarget.style.color = '#F8FAFC'}
                onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
            >
                <ArrowLeft size={16} /> Back to Registry
            </button>

            {/* Dispute Dossier Card */}
            <div className="rt-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="rt-badge rt-badge-warning">DISPUTE ACTIVE</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>ID: {dispute.id}</span>
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.35rem' }}>
                        {dispute.reason}
                    </h2>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                        Merchant: <span style={{ color: '#F8FAFC' }}>{dispute.merchantName || "Razorpay Demo Store"}</span>
                    </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Disputed Amount</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#F8FAFC', fontFamily: 'var(--font-mono)' }}>
                        {formatter.format(dispute.amount)}
                    </div>
                </div>
            </div>

            {/* Autonomous AI Engine Trigger Box */}
            <div className="rt-card" style={{ padding: '4rem 3rem', textAlign: 'center', background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.05) 0%, var(--bg-surface-1) 100%)', borderColor: 'rgba(139, 92, 246, 0.25)' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1.5px solid #8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                }}>
                    <Cpu size={32} color="#8B5CF6" />
                </div>

                <span style={{ fontSize: '0.78rem', letterSpacing: '2.5px', fontWeight: 600, color: '#8B5CF6', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    AUTONOMOUS ARBITRATION REASONING
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.75rem', letterSpacing: '-0.3px' }}>
                    AI Investigation Engine Ready
                </h3>
                <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 2.5rem auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Trigger autonomous case reconstruction. The engine will inspect transaction logs, verify shipment tracking, extract proof from the evidence vault, and generate a verifiably sound recommendation.
                </p>

                <motion.button 
                    onClick={handleInitiate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rt-btn rt-btn-primary"
                    style={{ 
                        padding: '1.1rem 3rem', 
                        fontSize: '1.05rem', 
                        borderRadius: '10px',
                        boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)'
                    }}
                >
                    <PlayCircle size={22} /> Initialize AI Investigation
                </motion.button>
            </div>
        </div>
    );
}
