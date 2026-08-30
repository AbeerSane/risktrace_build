import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, ShieldAlert, FileText, ChevronRight, Zap } from "lucide-react";

export default function FinalWorkspace({ dispute, payload }) {
    const ai = payload?.aiRecommendation || {};
    const pkg = payload?.casePackage || {};
    const assessment = pkg?.assessment || {};
    const invResult = pkg?.investigationResult || {};

    const [stage, setStage] = useState(0);

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
    const isContest = ai.recommendedDecision === 'CONTEST';
    const accentColor = isContest ? '#2ecc71' : '#e74c3c';

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#f1f2f6', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
                
                {/* Left Sidebar: Case Meta (STAGE 1) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: stage >= 1 ? 1 : 0, transition: 'opacity 0.8s', transform: stage >= 1 ? 'translateY(0)' : 'translateY(20px)' }}>
                    <div style={{ background: 'rgba(20, 18, 25, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#747d8c', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>1. System Context</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>{formatter.format(dispute.amount)}</div>
                        <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>{dispute.reason}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem', fontSize: '0.8rem' }}>
                            <span style={{ color: '#747d8c' }}>Deadline</span>
                            <span style={{ color: '#ff4757' }}>{deadline}</span>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(20, 18, 25, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                <span>Strength</span>
                                <span style={{ color: assessment.overallStrengthScore > 70 ? '#2ecc71' : '#f39c12' }}>{assessment.overallStrengthScore}%</span>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
                                <motion.div animate={{ width: stage >= 1 ? `${assessment.overallStrengthScore}%` : '0%' }} transition={{ duration: 1 }} style={{ height: '100%', background: assessment.overallStrengthScore > 70 ? '#2ecc71' : '#f39c12', borderRadius: '2px' }} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                <span>Completeness</span>
                                <span style={{ color: '#3498db' }}>{assessment.evidenceCompletenessScore}%</span>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
                                <motion.div animate={{ width: stage >= 1 ? `${assessment.evidenceCompletenessScore}%` : '0%' }} transition={{ duration: 1 }} style={{ height: '100%', background: '#3498db', borderRadius: '2px' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                    
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
                    <div style={{ 
                        background: 'rgba(20, 18, 25, 0.9)', padding: '2rem', borderRadius: '12px', 
                        border: stage >= 5 ? '1px solid #a55eea' : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: stage >= 5 ? '0 0 30px rgba(170, 59, 255, 0.1)' : 'none',
                        transition: 'all 1s',
                        zIndex: 10,
                        opacity: stage >= 5 ? 1 : 0,
                        transform: stage >= 5 ? 'translateY(0)' : 'translateY(20px)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a55eea' }}>
                            <Zap size={18} /> 5. AI Risk Interpretation
                        </h3>
                        <div style={{ lineHeight: '1.8', color: '#f1f2f6', fontSize: '1.1rem', fontWeight: 300, minHeight: '100px' }}>
                            {stage >= 5 && sentences.map((sentence, i) => {
                                // Super rough keyword logic to figure out which evidence box to "pulse" while this sentence is read
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
                    </div>

                    {/* Evidence Grid (STAGES 2, 3, 4) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', zIndex: 10 }}>
                        
                        <div id="ev-supporting" style={{ 
                            background: 'rgba(46, 204, 113, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(46, 204, 113, 0.2)',
                            opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s'
                        }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                2. Strongest Evidence
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {assessment.supportingEvidence?.map((ev, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ccc' }}>
                                        <CheckCircle size={14} color="#2ecc71" style={{ marginTop: '2px', flexShrink: 0 }} /> {ev}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div id="ev-missing" style={{ 
                                background: 'rgba(243, 156, 18, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(243, 156, 18, 0.2)',
                                opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s'
                            }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: '#f39c12', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    3. What Is Missing
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {invResult.missingEvidence?.length > 0 ? invResult.missingEvidence.map((ev, i) => (
                                        <li key={i} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ccc' }}><AlertTriangle size={14} color="#f39c12" style={{ marginTop: '2px', flexShrink: 0 }}/> {ev}</li>
                                    )) : <li style={{ fontSize: '0.9rem', color: '#747d8c' }}>No critical evidence missing.</li>}
                                </ul>
                            </div>

                            <div id="ev-conflict" style={{ 
                                background: 'rgba(231, 76, 60, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(231, 76, 60, 0.2)',
                                opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s'
                            }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    4. What Conflicts
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {invResult.contradictionsDetected?.length > 0 ? invResult.contradictionsDetected.map((ev, i) => (
                                        <li key={i} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ccc' }}><XCircle size={14} color="#e74c3c" style={{ marginTop: '2px', flexShrink: 0 }} /> {ev}</li>
                                    )) : <li style={{ fontSize: '0.9rem', color: '#747d8c' }}>No contradictions detected.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Hero Recommendation (STAGE 6) */}
                    <AnimatePresence>
                        {stage >= 6 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                                style={{ 
                                    background: `linear-gradient(135deg, rgba(20, 18, 25, 0.95) 0%, rgba(15, 15, 18, 0.98) 100%)`, 
                                    padding: '3rem 2rem', borderRadius: '12px', 
                                    border: `2px solid ${accentColor}`,
                                    boxShadow: `0 20px 50px -10px ${accentColor}40, inset 0 0 20px ${accentColor}10`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    zIndex: 20, marginTop: '1rem'
                                }}
                            >
                                <div>
                                    <div style={{ color: '#747d8c', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>6. Final Recommendation</div>
                                    <div style={{ fontSize: '4rem', fontWeight: 200, color: accentColor, letterSpacing: '3px', textShadow: `0 0 20px ${accentColor}80` }}>{ai.recommendedDecision}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#747d8c', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Confidence</div>
                                    <div style={{ fontSize: '3rem', fontWeight: 300, color: '#f1f2f6' }}>{ai.confidenceScore}%</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}

function ReasoningSentence({ text, index, isSupporting, isMissing, isConflict }) {
    const [active, setActive] = useState(false);

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
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: active ? 1 : 0, filter: active ? 'blur(0px)' : 'blur(10px)', y: active ? 0 : 10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
                color: active ? '#fff' : 'rgba(255,255,255,0)',
                textShadow: active ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                display: 'inline',
                marginRight: '0.4rem'
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
