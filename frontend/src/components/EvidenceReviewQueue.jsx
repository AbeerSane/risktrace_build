import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, FileText, Loader2, Sparkles } from "lucide-react";
import { acceptEvidence } from "../api/api";

export default function EvidenceReviewQueue({ disputeId, pendingEvidence, onAcceptSuccess, onReject }) {
    const [processingId, setProcessingId] = useState(null);

    const handleAccept = async (ev) => {
        setProcessingId(ev.id);
        try {
            await acceptEvidence(disputeId, ev.id);
            onAcceptSuccess(ev.id);
        } catch (err) {
            console.error("Failed to accept evidence", err);
            alert("System Failure: Unable to verify evidence.");
        } finally {
            setProcessingId(null);
        }
    };

    if (!pendingEvidence || pendingEvidence.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    <Sparkles size={14} /> AI Extraction Buffer
                </span>
                <span className="rt-badge rt-badge-warning">{pendingEvidence.length} PENDING</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Review and verify autonomous document extraction before writing into the active case record.
            </p>

            <AnimatePresence>
                {pendingEvidence.map(ev => {
                    let parsedContent = { facts: [], url: '', error: null };
                    try {
                        parsedContent = JSON.parse(ev.content);
                    } catch (e) {
                        parsedContent.error = "Malformed extraction data.";
                    }

                    const isFailed = ev.status === 'FAILED' || parsedContent.error;

                    return (
                        <motion.div 
                            key={ev.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            className="rt-card"
                            style={{
                                padding: '1.25rem',
                                borderColor: isFailed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                                background: isFailed ? 'rgba(239, 68, 68, 0.03)' : 'rgba(245, 158, 11, 0.03)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {processingId === ev.id && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(8,8,10,0.7)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                    <Loader2 size={24} color="var(--accent-amber)" style={{ animation: 'spin 1s linear infinite' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                    <FileText size={24} color={isFailed ? "var(--accent-red)" : "var(--accent-amber)"} />
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 600, color: isFailed ? 'var(--accent-red)' : 'var(--text-main)' }}>
                                        {isFailed ? "Extraction Failed" : "Extracted Fact Signals"}
                                    </h5>
                                    
                                    {isFailed ? (
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <AlertCircle size={14} color="var(--accent-red)" /> {parsedContent.error || "The AI model could not read this document format."}
                                        </p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {parsedContent.facts?.map((fact, i) => (
                                                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}>
                                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-amber)', marginTop: '6px', flexShrink: 0 }} />
                                                    <span>{fact}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                        {!isFailed && (
                                            <button 
                                                onClick={() => handleAccept(ev)}
                                                className="rt-btn-primary"
                                                style={{ background: 'var(--accent-green)', borderColor: 'transparent', color: '#000', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700 }}
                                            >
                                                <CheckCircle size={14} /> INJECT INTO DOSSIER
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onReject(ev.id)}
                                            className="rt-btn-secondary"
                                            style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600 }}
                                        >
                                            <XCircle size={14} /> {isFailed ? "DISMISS" : "REJECT"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
