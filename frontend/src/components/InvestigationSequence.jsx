import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Server, FileText, CheckCircle, Database, ShieldAlert, Cpu, AlertTriangle } from "lucide-react";

const ANIMATION_PACE_MS = 1800;

const STATES = [
    "INITIALIZING",
    "RECONSTRUCTING_TRANSACTION",
    "GATHERING_EVIDENCE",
    "ANALYZING_EVIDENCE",
    "DETECTING_CONTRADICTIONS",
    "ASSESSING_CASE",
    "AI_REASONING",
    "COMPLETE",
    "FAILED"
];

const STATE_TITLES = {
    INITIALIZING: "Booting Forensic Investigation Pipeline",
    RECONSTRUCTING_TRANSACTION: "Deconstructing Transaction Nodes & Signatures",
    GATHERING_EVIDENCE: "Collecting Telemetry from Evidence Vault",
    ANALYZING_EVIDENCE: "Extracting Verifiable Proof Points",
    DETECTING_CONTRADICTIONS: "Isolating Contradictory Claim Signals",
    ASSESSING_CASE: "Computing Probability & Recovery Strength",
    AI_REASONING: "Synthesizing Final Dispute Recommendation",
    COMPLETE: "Investigation Complete — Transferring to Workspace",
    FAILED: "Investigation Encountered Error"
};

export default function InvestigationSequence({ backendStatus, onAnimationComplete }) {
    const [displayState, setDisplayState] = useState("INITIALIZING");
    const [queue, setQueue] = useState([]);

    // Queue up new backend states
    useEffect(() => {
        if (backendStatus && !queue.includes(backendStatus)) {
            setQueue(prev => [...prev, backendStatus]);
        }
    }, [backendStatus]);

    // Process the queue at a minimum pace
    useEffect(() => {
        if (queue.length > 0) {
            const nextState = queue[0];
            const currentIndex = STATES.indexOf(displayState);
            const targetIndex = STATES.indexOf(nextState);

            if (targetIndex > currentIndex) {
                const stepState = STATES[currentIndex + 1];
                const timer = setTimeout(() => {
                    setDisplayState(stepState);
                    if (stepState === nextState) {
                        setQueue(prev => prev.slice(1));
                    }
                }, ANIMATION_PACE_MS);
                return () => clearTimeout(timer);
            } else {
                setQueue(prev => prev.slice(1));
            }
        }
    }, [queue, displayState]);

    // Once we hit complete, wait a moment and notify parent
    useEffect(() => {
        if (displayState === "COMPLETE" || displayState === "FAILED") {
            const timer = setTimeout(() => {
                onAnimationComplete();
            }, ANIMATION_PACE_MS);
            return () => clearTimeout(timer);
        }
    }, [displayState, onAnimationComplete]);

    const stateIndex = STATES.indexOf(displayState);
    const shouldReduceMotion = useReducedMotion();

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%', background: '#08080A', overflow: 'hidden', color: '#F8FAFC', fontFamily: 'var(--font-sans)' }}>
            
            {/* Ambient Background Grid */}
            <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', 
                backgroundSize: '50px 50px',
                zIndex: 0
            }} />

            {/* Top Telemetry Header */}
            <div style={{ position: 'absolute', top: '2.5rem', left: '3rem', zIndex: 10, maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div className="rt-pulse-live" />
                    <span style={{ fontSize: '0.75rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#8B5CF6', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        STAGE {Math.min(stateIndex + 1, 7)} OF 7
                    </span>
                </div>

                <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
                    {STATE_TITLES[displayState] || displayState}
                </div>
                
                {/* Precision Progress Bar */}
                <div style={{ width: '380px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '1.25rem', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stateIndex / (STATES.length - 2)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #38BDF8)' }}
                    />
                </div>
            </div>

            {/* Center Investigation Graph Canvas */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -45%)', width: '800px', height: '550px', zIndex: 5 }}>
                
                {/* Vector Connection Lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                    {/* Path: Dispute -> Payment */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: 0.8 }}
                            d="M 400 280 L 200 140" stroke={stateIndex >= 4 ? "#EF4444" : "#8B5CF6"} strokeWidth="1.5" fill="none"
                        />
                    )}
                    
                    {/* Path: Dispute -> Order */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: 0.8 }}
                            d="M 400 280 L 600 140" stroke="#8B5CF6" strokeWidth="1.5" fill="none"
                        />
                    )}

                    {/* Path: Dispute -> Customer */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.6 }} transition={{ duration: 0.8 }}
                            d="M 400 280 L 200 420" stroke="#8B5CF6" strokeWidth="1.5" fill="none"
                        />
                    )}

                    {/* Path: Order -> Shipment (Evidence) */}
                    {stateIndex >= 2 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
                            d="M 600 140 L 730 280" stroke="#10B981" strokeWidth="1.5" fill="none" strokeDasharray="4,4"
                        />
                    )}

                    {/* AI Reasoning Beams */}
                    {stateIndex >= 5 && !shouldReduceMotion && (
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ duration: 1.8, repeat: Infinity }}
                            d="M 400 280 L 400 80" stroke="#8B5CF6" strokeWidth="3" fill="none" filter="blur(2px)"
                        />
                    )}
                </svg>

                {/* Nodes */}
                <AnimatePresence>
                    {/* Core: DISPUTE */}
                    <GraphNode id="dispute" label="DISPUTE CORE" x={400} y={280} icon={<AlertTriangle size={24} color="#EF4444" />} delay={0} size={76} pulsing={stateIndex === 4} />
                    
                    {/* Tier 1: Reconstructing */}
                    {stateIndex >= 1 && (
                        <>
                            <GraphNode id="payment" label="PAYMENT" x={200} y={140} icon={<Database size={20} color="#8B5CF6" />} delay={0.15} />
                            <GraphNode id="order" label="ORDER RECORD" x={600} y={140} icon={<Server size={20} color="#8B5CF6" />} delay={0.3} />
                            <GraphNode id="customer" label="CUSTOMER PROFILE" x={200} y={420} icon={<Search size={20} color="#8B5CF6" />} delay={0.45} />
                        </>
                    )}

                    {/* Tier 2: Evidence */}
                    {stateIndex >= 2 && (
                        <>
                            <GraphNode id="shipment" label="SHIPMENT PROOF" x={730} y={280} icon={<CheckCircle size={18} color="#10B981" />} delay={0.2} size={50} />
                            <GraphNode id="auth" label="3DS AUTHENTICATION" x={70} y={280} icon={<ShieldAlert size={18} color={stateIndex >= 4 ? "#EF4444" : "#10B981"} />} delay={0.4} size={50} pulsing={stateIndex === 4} />
                        </>
                    )}

                    {/* Tier 3: AI Brain */}
                    {stateIndex >= 5 && (
                        <GraphNode id="ai" label="AI REASONING CORE" x={400} y={70} icon={<Cpu size={32} color="#8B5CF6" />} delay={0} size={90} glow="#8B5CF6" pulsing={true} />
                    )}
                </AnimatePresence>
            </div>

            {/* Scanning Line Indicator */}
            {stateIndex === 0 && (
                <motion.div 
                    initial={{ top: '-5%' }}
                    animate={{ top: '105%' }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', left: 0, width: '100%', height: '80px', background: 'linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.15))', borderBottom: '2px solid #8B5CF6', zIndex: 40, pointerEvents: 'none' }}
                />
            )}
        </div>
    );
}

function GraphNode({ id, label, x, y, icon, delay, size = 56, glow = 'rgba(255,255,255,0.08)', pulsing = false }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div
            key={id}
            initial={shouldReduceMotion ? { scale: 1, opacity: 0, x: '-50%', y: '-50%' } : { scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            transition={shouldReduceMotion ? { duration: 0.3 } : { type: "spring", stiffness: 220, damping: 22, delay }}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                background: 'rgba(15, 14, 23, 0.95)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                boxShadow: pulsing && !shouldReduceMotion ? `0 0 25px ${icon.props.color}70` : `0 0 15px ${glow}`,
                willChange: 'transform, opacity'
            }}
        >
            {icon}
            
            {/* Label */}
            <div style={{ position: 'absolute', top: '115%', whiteSpace: 'nowrap', fontSize: '0.68rem', letterSpacing: '1px', fontWeight: 600, color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                {label}
            </div>

            {/* Pulsing ring */}
            {pulsing && !shouldReduceMotion && (
                <motion.div
                    animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', inset: -2, border: `2px solid ${icon.props.color}`, borderRadius: '50%' }}
                />
            )}
        </motion.div>
    );
}
