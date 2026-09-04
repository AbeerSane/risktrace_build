import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Server, FileText, CheckCircle, Database, ShieldAlert, Cpu } from "lucide-react";

const ANIMATION_PACE_MS = 2000;

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

            // If we are behind, step forward one state at a time
            if (targetIndex > currentIndex) {
                const stepState = STATES[currentIndex + 1];
                const timer = setTimeout(() => {
                    setDisplayState(stepState);
                    // If we reached the target from the queue, pop it
                    if (stepState === nextState) {
                        setQueue(prev => prev.slice(1));
                    }
                }, ANIMATION_PACE_MS);
                return () => clearTimeout(timer);
            } else {
                // If we are already at or past the target, pop it
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
        <div style={{ position: 'relative', height: '100vh', width: '100%', background: '#08060d', overflow: 'hidden', color: '#f1f2f6', fontFamily: 'system-ui, sans-serif' }}>
            
            {/* Status Overlay */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <h2 style={{ fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#747d8c', margin: 0 }}>System Status</h2>
                <div style={{ fontSize: '2rem', fontWeight: 200, color: '#a55eea', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a55eea', boxShadow: '0 0 10px #a55eea', animation: 'pulse 1.5s infinite' }}></div>
                    {displayState.replace('_', ' ')}
                </div>
                
                {/* Progress Bar */}
                <div style={{ width: '300px', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '1rem' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stateIndex / (STATES.length - 2)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ height: '100%', background: '#a55eea' }}
                    />
                </div>
            </div>

            {/* Cinematic Canvas Center */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px' }}>
                
                {/* Connecting Lines Canvas */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                    
                    {/* Path: Dispute -> Payment */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 1 }}
                            d="M 400 300 L 200 150" stroke={stateIndex >= 4 ? "#e74c3c" : "#3498db"} strokeWidth="2" fill="none"
                        />
                    )}
                    
                    {/* Path: Dispute -> Order */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 1 }}
                            d="M 400 300 L 600 150" stroke="#3498db" strokeWidth="2" fill="none"
                        />
                    )}

                    {/* Path: Dispute -> Customer */}
                    {stateIndex >= 1 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 1 }}
                            d="M 400 300 L 200 450" stroke="#3498db" strokeWidth="2" fill="none"
                        />
                    )}

                    {/* Path: Order -> Shipment (Evidence) */}
                    {stateIndex >= 2 && (
                        <motion.path 
                            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }} 
                            animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                            d="M 600 150 L 750 300" stroke="#2ecc71" strokeWidth="2" fill="none" strokeDasharray="5,5"
                        />
                    )}

                    {/* AI Reasoning Beams */}
                    {stateIndex >= 6 && !shouldReduceMotion && (
                        <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ duration: 2, repeat: Infinity }}
                            d="M 400 300 L 400 100" stroke="#a55eea" strokeWidth="4" fill="none" filter="blur(4px)"
                        />
                    )}

                </svg>

                {/* Nodes */}
                <AnimatePresence>
                    
                    {/* Core: DISPUTE */}
                    <GraphNode id="dispute" label="DISPUTE CORE" x={400} y={300} icon={<AlertTriangle color="#ff4757" />} delay={0} size={80} pulsing={stateIndex === 4} />
                    
                    {/* Tier 1: Reconstructing */}
                    {stateIndex >= 1 && (
                        <>
                            <GraphNode id="payment" label="PAYMENT" x={200} y={150} icon={<Database color="#3498db" />} delay={0.2} />
                            <GraphNode id="order" label="ORDER" x={600} y={150} icon={<Server color="#3498db" />} delay={0.4} />
                            <GraphNode id="customer" label="CUSTOMER" x={200} y={450} icon={<Search color="#3498db" />} delay={0.6} />
                        </>
                    )}

                    {/* Tier 2: Evidence */}
                    {stateIndex >= 2 && (
                        <>
                            <GraphNode id="shipment" label="SHIPMENT LOG" x={750} y={300} icon={<CheckCircle color="#2ecc71" />} delay={0.3} size={50} />
                            <GraphNode id="auth" label="3D SECURE" x={50} y={300} icon={<ShieldAlert color={stateIndex >= 4 ? "#e74c3c" : "#2ecc71"} />} delay={0.6} size={50} pulsing={stateIndex === 4} />
                        </>
                    )}

                    {/* Tier 3: AI Brain */}
                    {stateIndex >= 5 && (
                        <GraphNode id="ai" label="AI REASONING ENGINE" x={400} y={50} icon={<Cpu color="#a55eea" size={40} />} delay={0} size={100} glow="#a55eea" pulsing={true} />
                    )}

                </AnimatePresence>

            </div>

            {/* Scanning Overlay (Initializing) */}
            {stateIndex === 0 && (
                <motion.div 
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', left: 0, width: '100%', height: '100px', background: 'linear-gradient(to bottom, transparent, rgba(170, 59, 255, 0.2))', borderBottom: '2px solid #a55eea', zIndex: 50 }}
                />
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

function GraphNode({ id, label, x, y, icon, delay, size = 60, glow = 'rgba(255,255,255,0.1)', pulsing = false }) {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div
            key={id}
            initial={shouldReduceMotion ? { scale: 1, opacity: 0, x: '-50%', y: '-50%' } : { scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            transition={shouldReduceMotion ? { duration: 0.3 } : { type: "spring", stiffness: 200, damping: 20, delay }}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                background: 'rgba(20, 18, 25, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                boxShadow: pulsing && !shouldReduceMotion ? `0 0 30px ${icon.props.color}80` : `0 0 20px ${glow}`,
                willChange: 'transform, opacity'
            }}
        >
            {icon}
            
            {/* Label */}
            <div style={{ position: 'absolute', top: '120%', whiteSpace: 'nowrap', fontSize: '0.7rem', letterSpacing: '1px', color: '#747d8c' }}>
                {label}
            </div>

            {/* Pulsing ring */}
            {pulsing && !shouldReduceMotion && (
                <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ position: 'absolute', inset: 0, border: `2px solid ${icon.props.color}`, borderRadius: '50%' }}
                />
            )}
        </motion.div>
    );
}
