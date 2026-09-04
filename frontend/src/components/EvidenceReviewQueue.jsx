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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            <h4 style={{ margin: 0, color: '#f39c12', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Sparkles size={16} /> AI-EXTRACTED INFORMATION
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#747d8c', marginBottom: '0.5rem' }}>
                Review AI-extracted facts before injecting into VERIFIED DATABASE DATA.
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 50 }}
                            style={{
                                background: isFailed ? 'rgba(231, 76, 60, 0.05)' : 'rgba(243, 156, 18, 0.05)',
                                border: isFailed ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid rgba(243, 156, 18, 0.3)',
                                borderRadius: '12px', padding: '1.5rem',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {processingId === ev.id && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                    <Loader2 size={24} color="#f39c12" style={{ animation: 'spin 1s linear infinite' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                                    <FileText size={32} color={isFailed ? "#e74c3c" : "#f39c12"} />
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: isFailed ? '#e74c3c' : '#f1f2f6' }}>
                                        {isFailed ? "Extraction Failed" : "Extracted Facts"}
                                    </h5>
                                    
                                    {isFailed ? (
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <AlertCircle size={16} color="#e74c3c" /> {parsedContent.error || "The AI could not read this document."}
                                        </p>
                                    ) : (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {parsedContent.facts?.map((fact, i) => (
                                                <li key={i} style={{ fontSize: '0.9rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f39c12' }} />
                                                    {fact}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        {!isFailed && (
                                            <button 
                                                onClick={() => handleAccept(ev)}
                                                style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <CheckCircle size={16} /> ACCEPT & INJECT
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onReject(ev.id)}
                                            style={{ background: 'transparent', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.5)', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <XCircle size={16} /> {isFailed ? "DISMISS" : "REJECT"}
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
