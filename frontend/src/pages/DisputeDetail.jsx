import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDisputeDetails, startInvestigation, pollInvestigation } from "../api/api";
import InvestigationSequence from "../components/InvestigationSequence";
import FinalWorkspace from "../components/FinalWorkspace";
import { PlayCircle, ArrowLeft } from "lucide-react";

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

    // Polling mechanism
    useEffect(() => {
        let interval;
        if (viewState === 'ANIMATING' && sessionId) {
            interval = setInterval(() => {
                pollInvestigation(sessionId)
                    .then(sessionData => {
                        setBackendStatus(sessionData.status);
                        if (sessionData.status === 'COMPLETE' || sessionData.status === 'FAILED') {
                            if (sessionData.resultPayload) {
                                setPayload(JSON.parse(sessionData.resultPayload));
                            }
                            clearInterval(interval);
                        }
                    })
                    .catch(console.error);
            }, 500); // Aggressive polling for snappy updates
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
            alert("System Failure: Unable to initiate AI engine.");
            setViewState('INITIAL');
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#a55eea' }}>Fetching Dispute Telemetry...</div>;
    if (error) return <div style={{ padding: '2rem', color: '#ff4757' }}>Error: {error}</div>;

    if (viewState === 'ANIMATING') {
        return (
            <InvestigationSequence 
                backendStatus={backendStatus} 
                onAnimationComplete={() => setViewState('WORKSPACE')} 
            />
        );
    }

    if (viewState === 'WORKSPACE') {
        return (
            <div>
                <button onClick={() => navigate('/disputes')} style={{ background: 'transparent', border: 'none', color: '#747d8c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '1rem 2rem' }}>
                    <ArrowLeft size={16} /> Back to Command Center
                </button>
                <FinalWorkspace dispute={dispute} payload={payload} />
            </div>
        );
    }

    // INITIAL VIEW
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#f1f2f6', fontFamily: 'system-ui, sans-serif' }}>
            <button onClick={() => navigate('/disputes')} style={{ background: 'transparent', border: 'none', color: '#747d8c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: 0 }}>
                <ArrowLeft size={16} /> Back
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Dispute <span style={{ color: '#a55eea', fontFamily: 'monospace' }}>{dispute.id.substring(0,8)}</span></h1>
            <div style={{ color: '#ccc', marginBottom: '3rem', fontSize: '1.2rem' }}>{dispute.reason} — {formatter.format(dispute.amount)}</div>

            <div style={{ background: 'rgba(20, 18, 25, 0.6)', border: '1px solid rgba(170, 59, 255, 0.3)', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 10px 40px rgba(170, 59, 255, 0.1)' }}>
                <CpuIcon />
                <h2 style={{ fontWeight: 300, marginBottom: '1rem' }}>AI Investigation Engine Ready</h2>
                <p style={{ color: '#747d8c', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                    Initiate the autonomous AI engine to reconstruct the transaction graph, gather related evidence, and detect contradictions.
                </p>
                <button 
                    onClick={handleInitiate}
                    style={{ 
                        background: 'linear-gradient(90deg, #a55eea, #7b2cbf)', 
                        border: 'none', borderRadius: '30px', 
                        padding: '1rem 2.5rem', color: 'white', 
                        fontSize: '1.1rem', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(170, 59, 255, 0.4)',
                        textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600
                    }}
                >
                    <PlayCircle size={20} /> Initialize Investigation
                </button>
            </div>
        </div>
    );
}

function CpuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a55eea" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(170, 59, 255, 0.5))' }}>
            <rect width="16" height="16" x="4" y="4" rx="2" />
            <rect width="6" height="6" x="9" y="9" rx="1" />
            <path d="M15 2v2" /><path d="M15 20v2" />
            <path d="M2 15h2" /><path d="M2 9h2" />
            <path d="M20 15h2" /><path d="M20 9h2" />
            <path d="M9 2v2" /><path d="M9 20v2" />
        </svg>
    );
}
