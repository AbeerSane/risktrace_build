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
        <div style={{ position: 'relative', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {/* Glowing Vertical Line */}
            <div style={{ position: 'absolute', top: '10px', bottom: '-10px', left: '7px', width: '2px', background: 'linear-gradient(180deg, rgba(165, 94, 234, 0.8) 0%, rgba(52, 152, 219, 0.2) 100%)', borderRadius: '2px' }} />

            <AnimatePresence>
                {audits.map((audit, i) => (
                    <motion.div 
                        key={audit.id}
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Node */}
                        <div style={{ position: 'absolute', left: '-20px', top: '0px', width: '16px', height: '16px', borderRadius: '50%', background: '#1e1e24', border: '2px solid rgba(255,255,255,0.2)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f1f2f6' }} />
                        </div>

                        {/* Content */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {getIconForAction(audit.action)}
                                    <span style={{ fontSize: '0.85rem', color: '#f1f2f6', fontWeight: 600, letterSpacing: '1px' }}>{audit.action.replace(/_/g, ' ')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#747d8c', fontSize: '0.75rem' }}>
                                    <Clock size={12} /> {getFormattedTime(audit.timestamp)}
                                </div>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: '#a4b0be', lineHeight: 1.4 }}>
                                {audit.details.startsWith('{') ? (
                                    <pre style={{ margin: 0, padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontSize: '0.75rem', overflowX: 'auto' }}>
                                        {JSON.stringify(JSON.parse(audit.details), null, 2)}
                                    </pre>
                                ) : (
                                    audit.details
                                )}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#747d8c', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                                Performed by: <span style={{ color: '#a55eea' }}>{audit.performedBy}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {audits.length === 0 && !loading && (
                <div style={{ color: '#747d8c', fontSize: '0.8rem', fontStyle: 'italic' }}>No events recorded yet.</div>
            )}
        </div>
    );
}
