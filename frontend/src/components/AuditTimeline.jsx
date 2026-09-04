import { useEffect, useState } from "react";
import { fetchAudits } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, CheckCircle, ShieldAlert, Cpu, Network, Briefcase, RefreshCcw } from "lucide-react";

export default function AuditTimeline({ disputeId, refreshTrigger }) {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetchAudits(disputeId).then(data => {
            if (isMounted) {
                // Ensure they are sorted chronologically
                setAudits(data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
                setLoading(false);
            }
        });
        return () => { isMounted = false; };
    }, [disputeId, refreshTrigger]); // re-fetch when refreshTrigger changes

    if (loading && audits.length === 0) {
        return <div style={{ color: '#747d8c', padding: '1rem', fontSize: '0.9rem' }}>Loading immutable audit trail...</div>;
    }

    const getIconForAction = (action) => {
        switch (action) {
            case "EVIDENCE_ADDED":
            case "EVIDENCE_UPLOADED":
                return <FileText size={16} color="#3498db" />;
            case "INVESTIGATION_STARTED":
                return <Network size={16} color="#a55eea" />;
            case "AI_RECOMMENDATION":
                return <Cpu size={16} color="#e74c3c" />;
            case "INVESTIGATION_COMPLETED":
                return <CheckCircle size={16} color="#2ecc71" />;
            case "MERCHANT_DECISION":
            case "MERCHANT_DECISION_SUBMITTED":
                return <Briefcase size={16} color="#f39c12" />;
            case "EVIDENCE_REASSESSMENT":
                return <RefreshCcw size={16} color="#9b59b6" />;
            default:
                return <ShieldAlert size={16} color="#747d8c" />;
        }
    };

    const getFormattedTime = (timestamp) => {
        const d = new Date(timestamp);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + d.toLocaleDateString();
    };

    return (
        <div style={{ position: 'relative', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            {/* Glowing Vertical Line */}
            <div style={{ position: 'absolute', top: '8px', bottom: '8px', left: '6px', width: '2px', background: 'linear-gradient(180deg, var(--accent-violet) 0%, rgba(139, 92, 246, 0.1) 100%)', borderRadius: '2px' }} />

            <AnimatePresence>
                {audits.map((audit, i) => (
                    <motion.div 
                        key={audit.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Node */}
                        <div style={{ position: 'absolute', left: '-18px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--bg-surface-1)', border: '2px solid var(--accent-violet)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-main)' }} />
                        </div>

                        {/* Content */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {getIconForAction(audit.action)}
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600, letterSpacing: '0.04em' }}>{audit.action.replace(/_/g, ' ')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                                    <Clock size={11} /> {getFormattedTime(audit.timestamp)}
                                </div>
                            </div>

                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                {audit.details.startsWith('{') ? (
                                    <pre style={{ margin: 0, padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', fontSize: '0.7rem', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
                                        {JSON.stringify(JSON.parse(audit.details), null, 2)}
                                    </pre>
                                ) : (
                                    audit.details
                                )}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Performed by: <span style={{ color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>{audit.performedBy}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {audits.length === 0 && !loading && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No ledger events recorded.</div>
            )}
        </div>
    );
}
