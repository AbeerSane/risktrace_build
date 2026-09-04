import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fetchAudits, submitDecision } from "../api/api";
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert, FileText, ChevronRight, Zap, Loader2, ShieldCheck, Activity } from "lucide-react";
import EvidenceUploadButton from "./EvidenceUploadButton";
import EvidenceReviewQueue from "./EvidenceReviewQueue";
import AuditTimeline from "./AuditTimeline";

export default function FinalWorkspace({ dispute, payload, onReassess }) {
    const ai = payload?.aiRecommendation || {};
    const pkg = payload?.casePackage || {};
    const assessment = pkg?.assessment || {};
    const invResult = pkg?.investigationResult || {};

    const [stage, setStage] = useState(0);
    const [decisionState, setDecisionState] = useState('PENDING'); // PENDING | SUBMITTING | CONCLUDED
    const [auditTrail, setAuditTrail] = useState([]);
    const [finalDecision, setFinalDecision] = useState(null);
    
    const [pendingReviewEvidence, setPendingReviewEvidence] = useState([]);
    const [isReassessing, setIsReassessing] = useState(false);

    // Reset sequence when AI recommendation payload changes (e.g., after reassessment)
    useEffect(() => {
        setStage(0);
        setDecisionState('PENDING');
        setIsReassessing(false);
    }, [payload]);

    // Sequence the stages automatically
    useEffect(() => {
        const timings = [
            500,   // Stage 0 -> 1 (Basics)
            1500,  // Stage 1 -> 2 (Supporting)
            1500,  // Stage 2 -> 3 (Missing)
            1500,  // Stage 3 -> 4 (Conflicts)
            1500,  // Stage 4 -> 5 (Reasoning)
            // Stage 5 -> 6 (Recommendation) depends on text length, handled separately
        ];

        if (stage < 5) {
            const timer = setTimeout(() => {
                setStage(prev => prev + 1);
            }, timings[stage]);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const sentences = ai.reasoning ? ai.reasoning.split(/(?<=\.)\s+/) : [];
    
    // Auto-advance to stage 6 after all text finishes
    useEffect(() => {
        if (stage === 5 && sentences.length > 0) {
            // Give 1.2s per sentence + 1s buffer
            const timer = setTimeout(() => {
                setStage(6);
            }, (sentences.length * 1200) + 1000);
            return () => clearTimeout(timer);
        }
    }, [stage, sentences]);

    const deadline = new Date(new Date(dispute.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const handleDecision = async (decision) => {
        setDecisionState('SUBMITTING');
        setFinalDecision(decision);
        try {
            await submitDecision(dispute.id, decision, ai.recommendedDecision);
            // Simulate 1.5s network delay for dramatic effect
            setTimeout(async () => {
                const audits = await fetchAudits(dispute.id);
                setAuditTrail(audits);
                setDecisionState('CONCLUDED');
            }, 1500);
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to submit decision");
            setDecisionState('PENDING');
        }
    };

    const isContest = ai.recommendedDecision === 'CONTEST';
    const accentColor = isContest ? '#2ecc71' : '#e74c3c';

    return (
        <div style={{ padding: '2rem 0', maxWidth: '1280px', margin: '0 auto', color: 'var(--text-main)', fontFamily: 'var(--font-sans)', position: 'relative' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
                
                {/* Left Sidebar: Case Meta (STAGE 1) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)', transform: stage >= 1 ? 'translateY(0)' : 'translateY(20px)' }}>
                    <div className="rt-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>1. System Context</span>
                            <span className="rt-badge rt-badge-neutral">{dispute.status}</span>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Disputed Amount</div>
                            <div style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{formatter.format(dispute.amount)}</div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            {dispute.reason}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Response Deadline</span>
                            <span style={{ color: 'var(--accent-red)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{deadline}</span>
                        </div>
                    </div>

                    <div className="rt-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Case Strength</span>
                                <span style={{ color: assessment.overallStrengthScore > 70 ? 'var(--accent-green)' : 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{assessment.overallStrengthScore}%</span>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                                <motion.div animate={{ width: stage >= 1 ? `${assessment.overallStrengthScore}%` : '0%' }} transition={{ duration: 1 }} style={{ height: '100%', background: assessment.overallStrengthScore > 70 ? 'var(--accent-green)' : 'var(--accent-amber)', borderRadius: '999px' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Evidence Completeness</span>
                                <span style={{ color: 'var(--accent-violet)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{assessment.evidenceCompletenessScore}%</span>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                                <motion.div animate={{ width: stage >= 1 ? `${assessment.evidenceCompletenessScore}%` : '0%' }} transition={{ duration: 1 }} style={{ height: '100%', background: 'var(--accent-violet)', borderRadius: '999px' }} />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <EvidenceUploadButton 
                                disputeId={dispute.id} 
                                onUploadSuccess={(ev) => {
                                    setPendingReviewEvidence(prev => [...prev, ev]);
                                }} 
                            />

                            <EvidenceReviewQueue 
                                disputeId={dispute.id}
                                pendingEvidence={pendingReviewEvidence}
                                onAcceptSuccess={(evId) => {
                                    setPendingReviewEvidence(prev => prev.filter(e => e.id !== evId));
                                    setIsReassessing(true);
                                    if(onReassess) onReassess();
                                }}
                                onReject={(evId) => {
                                    setPendingReviewEvidence(prev => prev.filter(e => e.id !== evId));
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="rt-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Audit Ledger</span>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }} />
                        </div>
                        <AuditTimeline disputeId={dispute.id} refreshTrigger={stage} />
                    </div>
                </div>

                {/* Right Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                    
                    {/* Reassessment Overlay */}
                    <AnimatePresence>
                        {isReassessing && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                    background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(4px)',
                                    zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '12px', border: '1px solid #a55eea'
                                }}
                            >
                                <Loader2 size={48} color="#a55eea" style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
                                <h2 style={{ color: '#f1f2f6', fontWeight: 300, letterSpacing: '2px', margin: 0 }}>Dynamically Reassessing Case</h2>
                                <p style={{ color: '#a55eea' }}>Incorporating newly uploaded evidence...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* SVG Canvas for connecting lines between Analysis and Evidence */}
                    {stage >= 5 && (
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#a55eea', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
                                </linearGradient>
                            </defs>
                            <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2 }}
                                d="M 150 150 L 150 250" stroke="#2ecc71" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                            <motion.path initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.3 }} transition={{ duration: 2 }}
                                d="M 400 150 L 600 250" stroke="#e74c3c" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                        </svg>
                    )}

                    {/* AI Reasoning Reveal (STAGE 5) */}
                    <div className="rt-card" style={{ 
                        padding: '2rem', 
                        borderColor: stage >= 5 ? (ai.status === 'FAILED' ? 'var(--accent-red)' : 'var(--border-strong)') : 'var(--border-subtle)',
                        boxShadow: stage >= 5 ? (ai.status === 'FAILED' ? '0 0 30px rgba(239, 68, 68, 0.1)' : 'var(--shadow-elevation)') : 'none',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 10,
                        opacity: stage >= 5 ? 1 : 0,
                        transform: stage >= 5 ? 'translateY(0)' : 'translateY(20px)'
                    }}>
                        {ai.status === 'FAILED' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: 'var(--accent-red)' }}>
                                <AlertTriangle size={32} style={{ marginBottom: '0.75rem' }} />
                                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '1.1rem' }}>AI Investigation Unavailable</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{ai.reason || "The AI system failed to generate a reasoning response."} Preserving deterministic case assessment.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                                            <Zap size={15} color="var(--accent-violet)" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-violet)' }}>5. Autonomous Risk Interpretation</span>
                                    </div>
                                    <span className="rt-badge rt-badge-violet">SYNTHESIZED</span>
                                </div>
                                <div style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.125rem', fontWeight: 300, minHeight: '100px' }}>
                                    {stage >= 5 && sentences.map((sentence, i) => {
                                        const s = sentence.toLowerCase();
                                        const isSupporting = s.includes('support') || s.includes('match') || s.includes('valid') || s.includes('verify');
                                        const isMissing = s.includes('miss') || s.includes('fail') || s.includes('lack');
                                        const isConflict = s.includes('conflict') || s.includes('contradict') || s.includes('differ');
                                        
                                        return (
                                            <ReasoningSentence 
                                                key={i} 
                                                text={sentence} 
                                                index={i} 
                                                isSupporting={isSupporting}
                                                isMissing={isMissing}
                                                isConflict={isConflict}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Evidence Grid (STAGES 2, 3, 4) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', zIndex: 10 }}>
                        
                        <div id="ev-supporting" className="rt-card" style={{ 
                            padding: '1.5rem',
                            opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                    <CheckCircle size={15} color="var(--accent-green)" /> 2. Strongest Evidence
                                </span>
                                <span className="rt-badge rt-badge-success">{assessment.supportingEvidence?.length || 0} VERIFIED</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {assessment.supportingEvidence?.map((ev, i) => (
                                    <li key={i} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        <CheckCircle size={14} color="var(--accent-green)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                        <span>{ev}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div id="ev-missing" className="rt-card" style={{ 
                                padding: '1.5rem',
                                opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                        <AlertTriangle size={15} color="var(--accent-amber)" /> 3. What Is Missing
                                    </span>
                                    <span className="rt-badge rt-badge-warning">{invResult.missingEvidence?.length || 0} GAPS</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {invResult.missingEvidence?.length > 0 ? invResult.missingEvidence.map((ev, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            <AlertTriangle size={14} color="var(--accent-amber)" style={{ marginTop: '3px', flexShrink: 0 }}/>
                                            <span>{ev}</span>
                                        </li>
                                    )) : <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No critical evidence missing.</li>}
                                </ul>
                            </div>

                            <div id="ev-conflict" className="rt-card" style={{ 
                                padding: '1.5rem',
                                opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                                        <XCircle size={15} color="var(--accent-red)" /> 4. What Conflicts
                                    </span>
                                    <span className="rt-badge rt-badge-danger">{invResult.contradictionsDetected?.length || 0} CONFLICTS</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {invResult.contradictionsDetected?.length > 0 ? invResult.contradictionsDetected.map((ev, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            <XCircle size={14} color="var(--accent-red)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                            <span>{ev}</span>
                                        </li>
                                    )) : <li style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No contradictions detected.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Hero Recommendation and Decision (STAGE 6) */}
                    <AnimatePresence>
                        {stage >= 6 && decisionState === 'PENDING' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -30 }}
                                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                                className="rt-card"
                                style={{ 
                                    padding: '2.5rem',
                                    border: ai.status === 'FAILED' ? `1px solid var(--border-subtle)` : `1px solid ${accentColor}`,
                                    boxShadow: ai.status === 'FAILED' ? `none` : `0 20px 40px -15px ${accentColor}30`,
                                    display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 20, marginTop: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    {ai.status === 'FAILED' ? (
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>6. Final Recommendation</div>
                                            <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Manual Decision Required</div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>6. Final Recommendation</div>
                                                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: accentColor, letterSpacing: '-0.03em', lineHeight: 1 }}>{ai.recommendedDecision}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>AI Confidence</div>
                                                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{ai.confidenceScore}%</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                            <ShieldCheck size={18} color="var(--accent-violet)" /> Authorize Merchant Action
                                        </h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Action commits immutable audit record</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        <button onClick={() => handleDecision('CONTEST')} className="rt-btn-primary" style={{ background: 'var(--accent-green)', borderColor: 'transparent', color: '#000', justifyContent: 'center', padding: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                                            CONTEST CASE
                                        </button>
                                        <button onClick={() => handleDecision('CONCEDE')} className="rt-btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.3)', justifyContent: 'center', padding: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            CONCEDE (REFUND)
                                        </button>
                                        <button onClick={() => handleDecision('REQUEST_MORE_EVIDENCE')} className="rt-btn-secondary" style={{ color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.3)', justifyContent: 'center', padding: '1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                            REQUEST EVIDENCE
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {decisionState === 'SUBMITTING' && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="rt-card"
                                style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                            >
                                <Loader2 size={40} color="var(--accent-violet)" style={{ animation: 'spin 1.5s linear infinite' }} />
                                <h3 style={{ fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em', margin: 0, fontSize: '1.25rem' }}>Committing Merchant Decision...</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Writing cryptographic audit record to local ledger</p>
                            </motion.div>
                        )}

                        {decisionState === 'CONCLUDED' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                className="rt-card"
                                style={{ padding: '2.5rem', border: '1px solid var(--accent-green)', boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)', marginTop: '1rem' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-green)' }}>
                                        <CheckCircle color="var(--accent-green)" size={28} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h2 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Decision Locked: {finalDecision}</h2>
                                            <span className="rt-badge rt-badge-success">COMMITTED</span>
                                        </div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Action successfully written to immutable audit ledger.</p>
                                    </div>
                                </div>
                                
                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}><Activity size={14}/> Audit Trail Snapshot</h4>
                                    {auditTrail.map((audit) => (
                                        <div key={audit.id} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                                <span>[{new Date(audit.timestamp).toISOString()}]</span>
                                                <span style={{ color: 'var(--accent-violet)' }}>{audit.performedBy}</span>
                                            </div>
                                            <div style={{ color: 'var(--accent-green)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.85rem' }}>{audit.action}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {audit.details}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}

const btnStyle = (color) => ({
    flex: 1, padding: '1rem', background: `linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)`,
    border: `1px solid ${color}`, borderRadius: '8px', color: color,
    fontSize: '1rem', fontWeight: 600, letterSpacing: '1px', cursor: 'pointer',
    transition: 'all 0.2s', textTransform: 'uppercase'
});

function ReasoningSentence({ text, index, isSupporting, isMissing, isConflict }) {
    const [active, setActive] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const appearDelay = index * 1200;
        
        // Become active
        const t1 = setTimeout(() => setActive(true), appearDelay);
        
        // Pulse the corresponding box in the DOM (Hackathon-level direct DOM manipulation for the visual linkage effect!)
        const t2 = setTimeout(() => {
            if (isSupporting) pulseElement('ev-supporting', '#2ecc71');
            else if (isConflict) pulseElement('ev-conflict', '#e74c3c');
            else if (isMissing) pulseElement('ev-missing', '#f39c12');
        }, appearDelay + 300);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [index, isSupporting, isConflict, isMissing]);

    return (
        <motion.span
            initial={{ opacity: 0, filter: shouldReduceMotion ? 'none' : 'blur(10px)', y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: active ? 1 : 0, filter: shouldReduceMotion ? 'none' : (active ? 'blur(0px)' : 'blur(10px)'), y: shouldReduceMotion ? 0 : (active ? 0 : 10) }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.8, ease: "easeOut" }}
            style={{ 
                color: active ? '#fff' : 'rgba(255,255,255,0)',
                textShadow: active && !shouldReduceMotion ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                display: 'inline',
                marginRight: '0.4rem',
                willChange: 'opacity, transform, filter'
            }}
        >
            {text}
        </motion.span>
    );
}

function pulseElement(id, color) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Save original shadow
    const originalShadow = el.style.boxShadow;
    const originalBorder = el.style.border;
    
    // Apply pulse
    el.style.transition = 'all 0.3s ease';
    el.style.boxShadow = `0 0 30px ${color}80, inset 0 0 20px ${color}40`;
    el.style.border = `1px solid ${color}`;
    el.style.transform = 'scale(1.02)';
    
    // Remove pulse
    setTimeout(() => {
        el.style.boxShadow = originalShadow;
        el.style.border = originalBorder;
        el.style.transform = 'scale(1)';
    }, 1000);
}
