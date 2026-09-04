import { useEffect, useState, useMemo } from "react";
import { fetchPatterns } from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Network, Scan, ChevronRight, X, ShieldAlert, Crosshair } from "lucide-react";

export default function Patterns() {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState(0); 
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [explanationStage, setExplanationStage] = useState(0);
    const navigate = useNavigate();

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <Scan size={48} color="#a55eea" />
            </motion.div>
            <h2 style={{ color: '#f1f2f6', marginTop: '1rem', fontWeight: 300, letterSpacing: '2px' }}>INITIALIZING PATTERN INTEL</h2>
        </div>
    );

    if (patterns.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#747d8c' }}>
                <ShieldAlert size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h2 style={{ fontWeight: 300, letterSpacing: '2px' }}>NO SYSTEMIC ANOMALIES</h2>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 4rem)', background: '#0a0a0c', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Header Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2rem', zIndex: 10, display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(180deg, rgba(10,10,12,0.9) 0%, transparent 100%)' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0, letterSpacing: '2px', color: '#f1f2f6', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Network size={24} color="#a55eea" /> PATTERN INTELLIGENCE
                    </h1>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ color: '#a55eea', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {stage === 0 && <><Scan size={14} /> Scanning unlinked disputes...</>}
                        {stage === 1 && <><Crosshair size={14} /> Clustering shared attributes...</>}
                        {stage >= 2 && <><ShieldAlert size={14} /> Systemic vulnerabilities detected</>}
                    </motion.div>
                </div>
                {stage >= 2 && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'right' }}>
                        <div style={{ color: '#ff4757', fontSize: '1.8rem', fontWeight: 300, letterSpacing: '1px' }}>{formatter.format(totalExposure)}</div>
                        <div style={{ color: '#747d8c', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.7rem' }}>Total Systemic Risk</div>
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
                        initial={{ pathLength: 0, opacity: 0 }}
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
                    initial={{ top: `${n.sx}%`, left: `${n.sx}%`, opacity: 0 }}
                    animate={{ 
                        top: stage >= 1 ? `${n.cy}%` : `${n.sy}%`, 
                        left: stage >= 1 ? `${n.cx}%` : `${n.sx}%`,
                        opacity: 1,
                        scale: selectedPattern ? (selectedPattern.id === n.patternId ? 1.2 : 0.2) : 1
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    style={{
                        position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
                        background: '#f1f2f6', transform: 'translate(-50%, -50%)', zIndex: 2,
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }}
                />
            ))}

            {/* Focus Overlay & Details Panel */}
            <AnimatePresence>
                {selectedPattern && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,12,0.8)', zIndex: 20 }}
                    >
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25 }}
                            style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '100%', background: '#131117', borderLeft: `1px solid ${selectedPattern.title.toLowerCase().includes("fraud") ? '#e74c3c' : '#f39c12'}40`, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
                        >
                            <button onClick={() => setSelectedPattern(null)} style={{ alignSelf: 'flex-end', background: 'transparent', border: 'none', color: '#747d8c', cursor: 'pointer', padding: '0.5rem' }}><X size={24} /></button>
                            
                            <h2 style={{ fontSize: '1.5rem', color: '#f1f2f6', margin: '0 0 0.5rem 0' }}>{selectedPattern.title}</h2>
                            <div style={{ fontSize: '2rem', color: selectedPattern.title.toLowerCase().includes("fraud") ? '#e74c3c' : '#f39c12', fontWeight: 300, marginBottom: '2rem' }}>
                                {formatter.format(selectedPattern.moneyExposed)}
                            </div>

                            <AnimatePresence>
                                {/* Stage 0 & 1: Common Attributes & Evidence */}
                                {explanationStage >= 1 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.8rem', color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Supporting Evidence</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            {selectedPattern.aiExplanation?.supportingEvidence?.map((ev, idx) => (
                                                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '6px', borderLeft: '2px solid #3498db' }}>
                                                    <div style={{ fontSize: '0.9rem', color: '#f1f2f6' }}>{ev}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stage 2: AI Interpretation */}
                                {explanationStage >= 2 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem', position: 'relative' }}>
                                        {/* Visual connection line from evidence */}
                                        <div style={{ position: 'absolute', left: '10px', top: '-20px', width: '2px', height: '20px', background: 'rgba(165, 94, 234, 0.5)' }} />
                                        
                                        <h3 style={{ fontSize: '0.8rem', color: '#a55eea', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(165, 94, 234, 0.3)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Scan size={14} /> AI Interpretation
                                        </h3>
                                        <div style={{ background: 'rgba(165, 94, 234, 0.1)', border: '1px solid rgba(165, 94, 234, 0.5)', padding: '1rem', borderRadius: '6px', color: '#f1f2f6', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                            <p style={{ margin: '0 0 1rem 0' }}><strong>Connection:</strong> {selectedPattern.aiExplanation?.connectionReason}</p>
                                            <p style={{ margin: '0 0 1rem 0', color: '#f39c12' }}><strong>Likely Problem:</strong> {selectedPattern.aiExplanation?.likelyProblem}</p>
                                            <p style={{ margin: 0, color: '#747d8c', fontSize: '0.8rem' }}><em>Uncertainty: {selectedPattern.aiExplanation?.uncertainty}</em></p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stage 3: Root Cause / Recommendation */}
                                {explanationStage >= 3 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '0.8rem', color: '#2ecc71', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(46, 204, 113, 0.3)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ShieldAlert size={14} /> Recommended Next Action
                                        </h3>
                                        <div style={{ background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', padding: '1rem', borderRadius: '6px', color: '#2ecc71', fontSize: '1rem', fontWeight: 'bold' }}>
                                            {selectedPattern.aiExplanation?.recommendedInvestigation}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <h3 style={{ fontSize: '0.8rem', color: '#747d8c', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                Affected Disputes ({selectedPattern.affectedDisputeIds.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedPattern.affectedDisputeIds.map((id) => (
                                    <button 
                                        key={id}
                                        onClick={() => navigate(`/disputes/${id}`)}
                                        style={{ 
                                            background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', border: '1px solid transparent', padding: '0.8rem', borderRadius: '6px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#3498db'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                    >
                                        <span style={{ fontFamily: 'monospace' }}>{id.substring(0, 8)}...</span>
                                        <ChevronRight size={16} />
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
