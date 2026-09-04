import { useEffect, useState, useMemo } from "react";
import { fetchPatterns } from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle, TrendingUp, Network, Scan, ChevronRight, X, ShieldAlert, Crosshair } from "lucide-react";

export default function Patterns() {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState(0); 
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [explanationStage, setExplanationStage] = useState(0);
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    // 0 = SCANNING, 1 = CLUSTERING, 2 = ASSESSMENT, 3 = ROOT CAUSE

    useEffect(() => {
        fetchPatterns().then(data => {
            setPatterns(data);
            setLoading(false);
            
            // Sequence choreography
            setTimeout(() => setStage(1), 2500); // Trigger clustering
            setTimeout(() => setStage(2), 4500); // Trigger financial exposure
            setTimeout(() => setStage(3), 6000); // Trigger root cause reveal
        });
    }, []);

    useEffect(() => {
        if (selectedPattern) {
            setExplanationStage(0);
            const t1 = setTimeout(() => setExplanationStage(1), 1000); // Evidence
            const t2 = setTimeout(() => setExplanationStage(2), 2500); // AI Interpretation
            const t3 = setTimeout(() => setExplanationStage(3), 4500); // Root Cause
            return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
        }
    }, [selectedPattern]);

    // Generate deterministic coordinates for disputes
    const nodes = useMemo(() => {
        const n = [];
        patterns.forEach((p, pIndex) => {
            // Centers for patterns: Pattern 1 at (30%, 45%), Pattern 2 at (70%, 55%)
            const cx = pIndex === 0 ? 30 : pIndex === 1 ? 70 : 50;
            const cy = pIndex === 0 ? 45 : pIndex === 1 ? 55 : 50;

            p.affectedDisputeIds.forEach((id, dIndex) => {
                // Scatter chaos coordinates
                const sx = 10 + Math.random() * 80;
                const sy = 10 + Math.random() * 80;

                // Cluster circle coordinates
                const angle = (dIndex / p.affectedDisputeIds.length) * Math.PI * 2;
                const radiusX = 8;
                const radiusY = 12; // Compensate for aspect ratio roughly
                
                n.push({
                    id, 
                    patternId: p.id,
                    sx, sy,
                    cx: cx + Math.cos(angle) * radiusX,
                    cy: cy + Math.sin(angle) * radiusY,
                    center: { x: cx, y: cy }
                });
            });
        });
        return n;
    }, [patterns]);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const totalExposure = patterns.reduce((sum, p) => sum + p.moneyExposed, 0);

    if (loading) return (
        <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Scan size={40} color="var(--accent-violet)" />
            </motion.div>
            <h2 style={{ color: 'var(--text-main)', marginTop: '1.25rem', fontWeight: 600, letterSpacing: '0.1em', fontSize: '1rem', textTransform: 'uppercase' }}>Synthesizing Pattern Intelligence...</h2>
        </div>
    );

    if (patterns.length === 0) {
        return (
            <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ShieldAlert size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h2 style={{ fontWeight: 600, letterSpacing: '0.08em', fontSize: '1.1rem', color: 'var(--text-main)' }}>NO SYSTEMIC ANOMALIES DETECTED</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All payment disputes appear isolated without correlated fraud rings.</p>
            </div>
        );
    }

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: 'calc(100vh - 5rem)', 
            background: 'var(--bg-base)', 
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            overflow: 'hidden', 
            borderRadius: '12px', 
            border: '1px solid var(--border-subtle)' 
        }}>
            
            {/* Header Overlay */}
            <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem 2rem', zIndex: 10, 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'linear-gradient(180deg, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.6) 80%, transparent 100%)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <Network size={18} color="var(--accent-violet)" />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                            Systemic Pattern Surveillance
                        </h1>
                        <span className="rt-badge rt-badge-violet">GRAPH AI</span>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ color: 'var(--accent-violet)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                    >
                        {stage === 0 && <><Scan size={13} /> Scanning cross-merchant dispute topology...</>}
                        {stage === 1 && <><Crosshair size={13} /> Correlating coordinated chargeback clusters...</>}
                        {stage >= 2 && <><ShieldAlert size={13} color="var(--accent-red)" /> Systemic syndicate anomalies detected</>}
                    </motion.div>
                </div>
                {stage >= 2 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--accent-red)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>{formatter.format(totalExposure)}</div>
                        <div style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', fontWeight: 600 }}>Total Correlated Exposure</div>
                    </motion.div>
                )}
            </div>

            {/* SVG Connecting Lines (Stage 1+) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                {stage >= 1 && nodes.map((n, i) => (
                    <motion.line
                        key={`line-${i}`}
                        x1={`${n.center.x}%`} y1={`${n.center.y}%`}
                        x2={`${n.cx}%`} y2={`${n.cy}%`}
                        stroke={n.patternId.includes("FRAUD") ? "rgba(231, 76, 60, 0.4)" : "rgba(243, 156, 18, 0.4)"}
                        strokeWidth="1"
                        initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                ))}
            </svg>

            {/* Central Pattern Nodes (Stage 1+) */}
            {stage >= 1 && patterns.map((p, i) => {
                const cx = i === 0 ? 30 : i === 1 ? 70 : 50;
                const cy = i === 0 ? 45 : i === 1 ? 55 : 50;
                const isFraud = p.title.toLowerCase().includes("fraud");
                const color = isFraud ? '#e74c3c' : '#f39c12';
                
                return (
                    <motion.div
                        key={`center-${p.id}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={
                            (stage >= 3 && isFraud && !selectedPattern) 
                            ? { scale: [1, 1.15, 1], boxShadow: [`0 0 30px ${color}40`, `0 0 80px ${color}`, `0 0 30px ${color}40`] }
                            : { scale: 1, opacity: 1, boxShadow: `0 0 30px ${color}40` }
                        }
                        transition={
                            (stage >= 3 && isFraud && !selectedPattern)
                            ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                            : { type: "spring", bounce: 0.5, duration: 1 }
                        }
                        onClick={() => setSelectedPattern(p)}
                        style={{
                            position: 'absolute', top: `${cy}%`, left: `${cx}%`, transform: 'translate(-50%, -50%)',
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                            border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 5, cursor: 'pointer'
                        }}
                    >
                        {isFraud ? <AlertTriangle size={32} color={color} /> : <TrendingUp size={32} color={color} />}
                        
                        {/* Stage 2: Assessment Ring */}
                        {stage >= 2 && (
                            <motion.svg style={{ position: 'absolute', width: '120px', height: '120px' }} initial={{ rotate: -90 }}>
                                <motion.circle cx="60" cy="60" r="50" stroke={color} strokeWidth="2" fill="none" strokeDasharray="314"
                                    initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 * (1 - p.confidenceScore / 100) }} transition={{ duration: 1.5 }}
                                />
                            </motion.svg>
                        )}

                        {/* Stage 3: Root Cause Tooltip */}
                        {stage >= 3 && !selectedPattern && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, 20px)',
                                    width: '250px', background: 'rgba(20, 18, 25, 0.9)', border: `1px solid ${color}50`,
                                    padding: '1rem', borderRadius: '8px', textAlign: 'center', zIndex: 10
                                }}
                            >
                                <div style={{ color: color, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>{p.title}</div>
                                <div style={{ color: '#f1f2f6', fontSize: '1.2rem', fontWeight: 300, marginBottom: '0.5rem' }}>{formatter.format(p.moneyExposed)}</div>
                                <div style={{ color: '#747d8c', fontSize: '0.75rem' }}>Confidence: {p.confidenceScore}%</div>
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}

            {/* Dispute Nodes (Stage 0 Chaos -> Stage 1 Cluster) */}
            {nodes.map(n => (
                <motion.div
                    key={n.id}
                    initial={shouldReduceMotion ? { top: `${n.cy}%`, left: `${n.cx}%`, opacity: 0 } : { top: `${n.sx}%`, left: `${n.sx}%`, opacity: 0 }}
                    animate={{ 
                        top: (stage >= 1 || shouldReduceMotion) ? `${n.cy}%` : `${n.sy}%`, 
                        left: (stage >= 1 || shouldReduceMotion) ? `${n.cx}%` : `${n.sx}%`,
                        opacity: 1,
                        scale: selectedPattern ? (selectedPattern.id === n.patternId ? 1.2 : 0.2) : 1
                    }}
                    transition={shouldReduceMotion ? { duration: 0.5 } : { type: "spring", stiffness: 50, damping: 15 }}
                    style={{
                        position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
                        background: '#f1f2f6', transform: 'translate(-50%, -50%)', zIndex: 2,
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                        willChange: 'transform'
                    }}
                />
            ))}

            {/* Focus Overlay & Details Panel */}
            <AnimatePresence>
                {selectedPattern && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(8, 8, 10, 0.7)', backdropFilter: 'blur(4px)', zIndex: 20 }}
                    >
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            style={{ 
                                position: 'absolute', top: 0, right: 0, width: '440px', height: '100%', 
                                background: 'var(--bg-surface-1)', 
                                borderLeft: `1px solid var(--border-subtle)`, 
                                padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column',
                                boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span className="rt-badge rt-badge-neutral">CLUSTER INTEL</span>
                                <button onClick={() => setSelectedPattern(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontWeight: 700, letterSpacing: '-0.02em' }}>{selectedPattern.title}</h2>
                            <div style={{ fontSize: '2rem', color: selectedPattern.title.toLowerCase().includes("fraud") ? 'var(--accent-red)' : 'var(--accent-amber)', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>
                                {formatter.format(selectedPattern.moneyExposed)}
                            </div>

                            <AnimatePresence>
                                {/* Stage 0 & 1: Common Attributes & Evidence */}
                                {explanationStage >= 1 && (
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600 }}>Supporting Evidence</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            {selectedPattern.aiExplanation?.supportingEvidence?.map((ev, idx) => (
                                                <div key={idx} className="rt-card" style={{ padding: '0.85rem 1rem', borderLeft: '3px solid var(--accent-violet)' }}>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{ev}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stage 2: AI Interpretation */}
                                {explanationStage >= 2 && (
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-violet)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                            <Scan size={13} /> AI Correlation Analysis
                                        </div>
                                        <div className="rt-card" style={{ padding: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)', background: 'rgba(139, 92, 246, 0.05)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                            <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}><strong>Pattern Linkage:</strong> {selectedPattern.aiExplanation?.connectionReason}</p>
                                            <p style={{ margin: '0 0 0.75rem 0', color: 'var(--accent-amber)' }}><strong>Syndicate Vector:</strong> {selectedPattern.aiExplanation?.likelyProblem}</p>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}><em>Confidence bounds: {selectedPattern.aiExplanation?.uncertainty}</em></p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stage 3: Root Cause / Recommendation */}
                                {explanationStage >= 3 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: '1.75rem' }}>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                            <ShieldAlert size={13} /> Recommended Defensive Countermeasure
                                        </div>
                                        <div className="rt-card" style={{ border: '1px solid var(--accent-green)', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>
                                            {selectedPattern.aiExplanation?.recommendedInvestigation}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600, borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                                Linked Disputes ({selectedPattern.affectedDisputeIds.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedPattern.affectedDisputeIds.map((id) => (
                                    <button 
                                        key={id}
                                        onClick={() => navigate(`/disputes/${id}`)}
                                        className="rt-btn-secondary"
                                        style={{ justifyContent: 'space-between', padding: '0.65rem 1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                                    >
                                        <span>{id.substring(0, 16)}...</span>
                                        <ChevronRight size={14} color="var(--text-muted)" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
