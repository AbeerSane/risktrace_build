import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, ShieldAlert, Zap, Server, ChevronRight } from 'lucide-react';

export default function Landing() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    // Map scroll progress to different stages (0 to 1)
    const stage = useTransform(scrollYProgress, 
        [0, 0.2, 0.4, 0.6, 0.8, 1], 
        [0, 1, 2, 3, 4, 5]
    );

    // Animations for the central node (Transaction graphic)
    const txScaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.72, 0.78], [1, 1.5, 1.5, 0.8]);
    const txScale = shouldReduceMotion ? 1 : txScaleRaw;
    const txYRaw = useTransform(scrollYProgress, [0, 0.2, 0.72, 0.78], [0, 50, 50, -100]);
    const txY = shouldReduceMotion ? 0 : txYRaw;
    const txOpacity = useTransform(scrollYProgress, [0, 0.72, 0.78], [1, 1, 0]);

    // Animations for Payment Sub-nodes (Bank, Customer, Merchant graphics)
    const paymentOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.72, 0.78], [0, 1, 1, 0]);
    const paymentYRaw = useTransform(scrollYProgress, [0.15, 0.25], [50, 0]);
    const paymentY = shouldReduceMotion ? 0 : paymentYRaw;

    // Animations for Evidence Vault and Anomaly graphics
    const evidenceOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.72, 0.78], [0, 1, 1, 0]);
    const evidenceScaleRaw = useTransform(scrollYProgress, [0.35, 0.45], [0.8, 1]);
    const evidenceScale = shouldReduceMotion ? 1 : evidenceScaleRaw;

    // Animations for AI Grid graphics
    const aiOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.72, 0.78], [0, 1, 1, 0]);

    // Distinct, non-overlapping typography scroll windows

    // 1. Stage 0 Hero ("FOLLOW THE MONEY."): 0.00 -> 0.14
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.14], [1, 1, 0]);
    const heroYRaw = useTransform(scrollYProgress, [0, 0.14], [0, -40]);
    const heroY = shouldReduceMotion ? 0 : heroYRaw;
    const heroScaleRaw = useTransform(scrollYProgress, [0, 0.14], [1, 0.95]);
    const heroScale = shouldReduceMotion ? 1 : heroScaleRaw;

    // 2. Stage 1 ("PAYMENT DECONSTRUCTED"): 0.15 -> 0.35
    const paymentTextOpacity = useTransform(scrollYProgress, [0.15, 0.20, 0.30, 0.35], [0, 1, 1, 0]);
    const paymentTextYRaw = useTransform(scrollYProgress, [0.15, 0.20, 0.30, 0.35], [30, 0, 0, -30]);
    const paymentTextY = shouldReduceMotion ? 0 : paymentTextYRaw;
    const paymentTextScaleRaw = useTransform(scrollYProgress, [0.15, 0.20, 0.30, 0.35], [0.95, 1, 1, 0.95]);
    const paymentTextScale = shouldReduceMotion ? 1 : paymentTextScaleRaw;

    // 3. Stage 2 ("ANOMALY DETECTED"): 0.36 -> 0.55
    const evidenceTextOpacity = useTransform(scrollYProgress, [0.36, 0.41, 0.50, 0.55], [0, 1, 1, 0]);
    const evidenceTextYRaw = useTransform(scrollYProgress, [0.36, 0.41, 0.50, 0.55], [30, 0, 0, -30]);
    const evidenceTextY = shouldReduceMotion ? 0 : evidenceTextYRaw;
    const evidenceTextScaleRaw = useTransform(scrollYProgress, [0.36, 0.41, 0.50, 0.55], [0.95, 1, 1, 0.95]);
    const evidenceTextScale = shouldReduceMotion ? 1 : evidenceTextScaleRaw;

    // 4. Stage 3 ("AI REASONING"): 0.56 -> 0.77
    const aiTextOpacity = useTransform(scrollYProgress, [0.56, 0.61, 0.72, 0.77], [0, 1, 1, 0]);
    const aiTextYRaw = useTransform(scrollYProgress, [0.56, 0.61, 0.72, 0.77], [30, 0, 0, -30]);
    const aiTextY = shouldReduceMotion ? 0 : aiTextYRaw;
    const aiTextScaleRaw = useTransform(scrollYProgress, [0.56, 0.61, 0.72, 0.77], [0.95, 1, 1, 0.95]);
    const aiTextScale = shouldReduceMotion ? 1 : aiTextScaleRaw;

    // 5. Stage 4 ("EVIDENCE → ACTION"): 0.78 -> 1.00
    const decisionTextOpacity = useTransform(scrollYProgress, [0.78, 0.85], [0, 1]);
    const decisionTextYRaw = useTransform(scrollYProgress, [0.78, 0.85], [40, 0]);
    const decisionTextY = shouldReduceMotion ? 0 : decisionTextYRaw;
    const decisionTextScaleRaw = useTransform(scrollYProgress, [0.78, 0.85], [0.95, 1]);
    const decisionTextScale = shouldReduceMotion ? 1 : decisionTextScaleRaw;

    // Background color shifts
    const bgColors = useTransform(scrollYProgress,
        [0, 0.4, 0.7, 1],
        ['#0a0a0c', '#0f0c1b', '#0c1214', '#08080a']
    );

    return (
        <motion.div 
            ref={containerRef} 
            style={{ 
                height: '500vh', // 5 pages of scrolling
                backgroundColor: bgColors,
                color: '#fff',
                fontFamily: '"Inter", sans-serif'
            }}
        >
            {/* Fixed Canvas for interactive visualization */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                
                {/* Fixed Header */}
                <header style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', zIndex: 100, pointerEvents: 'auto' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px' }}>RISKTRACE</div>
                    <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', color: '#fff', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}>Sign In</button>
                </header>

                {/* Grid Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: 0, maskImage: shouldReduceMotion ? 'none' : 'radial-gradient(circle at center, black, transparent 80%)' }} />

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    
                    {/* Stage 0: Hero Text ("FOLLOW THE MONEY.") */}
                    <motion.div style={{
                        position: 'absolute',
                        top: '15vh',
                        left: '50%',
                        x: '-50%',
                        textAlign: 'center',
                        opacity: heroOpacity,
                        y: heroY,
                        scale: heroScale,
                        width: '90%',
                        maxWidth: '1200px',
                        willChange: 'opacity, transform',
                        pointerEvents: 'none'
                    }}>
                        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 200, letterSpacing: '8px', margin: 0, textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>FOLLOW THE MONEY.</h1>
                        <p style={{ color: '#a55eea', fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', letterSpacing: '4px', marginTop: '1rem', fontWeight: 300 }}>Every payment leaves evidence.</p>
                    </motion.div>

                    {/* Central Transaction Node Graphic */}
                    <motion.div style={{ position: 'absolute', scale: txScale, y: txY, opacity: txOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, willChange: 'transform, opacity' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(165, 94, 234, 0.1)', border: '2px solid #a55eea', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(165, 94, 234, 0.3)' }}>
                            <Server size={32} color="#a55eea" />
                        </div>
                        <motion.div style={{ marginTop: '1rem', color: '#a55eea', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem' }}>TXN_94827</motion.div>
                    </motion.div>

                    {/* Stage 1: Payment Sub-nodes Graphic & Heading */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: paymentOpacity, y: paymentY, zIndex: 15, willChange: 'opacity, transform' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <line x1="50%" y1="50%" x2="35%" y2="65%" stroke="#a55eea" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                            <line x1="50%" y1="50%" x2="65%" y2="65%" stroke="#a55eea" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                        </svg>
                        
                        <div style={{ position: 'absolute', left: '35%', top: '65%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#ccc' }}>BANK</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', left: '65%', top: '65%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.7rem', color: '#ccc' }}>USER</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stage 1 Heading ("PAYMENT DECONSTRUCTED") */}
                    <motion.div style={{
                        position: 'absolute',
                        top: '15vh',
                        left: '50%',
                        x: '-50%',
                        textAlign: 'center',
                        opacity: paymentTextOpacity,
                        y: paymentTextY,
                        scale: paymentTextScale,
                        width: '90%',
                        maxWidth: '1200px',
                        willChange: 'opacity, transform',
                        pointerEvents: 'none',
                        zIndex: 25
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, letterSpacing: '6px', margin: 0 }}>PAYMENT DECONSTRUCTED</h2>
                    </motion.div>

                    {/* Stage 2: Evidence & Anomaly Graphic & Heading */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: evidenceOpacity, scale: evidenceScale, zIndex: 16, willChange: 'opacity, transform' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <line x1="35%" y1="65%" x2="50%" y2="80%" stroke="#e74c3c" strokeWidth="2" opacity="0.8" />
                            <line x1="65%" y1="65%" x2="50%" y2="80%" stroke="#e74c3c" strokeWidth="2" opacity="0.8" />
                        </svg>

                        <div style={{ position: 'absolute', left: '35%', top: '65%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: '#e74c3c', right: '-5px', top: '-5px', boxShadow: '0 0 15px #e74c3c' }} />
                        </div>
                        <div style={{ position: 'absolute', left: '65%', top: '65%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: '#e74c3c', right: '-5px', top: '-5px', boxShadow: '0 0 15px #e74c3c' }} />
                        </div>

                        <div style={{ position: 'absolute', left: '50%', top: '80%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '70px', height: '70px', borderRadius: '8px', background: 'rgba(231, 76, 60, 0.1)', border: '2px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(231, 76, 60, 0.3)' }}>
                                <Database size={28} color="#e74c3c" />
                            </div>
                            <div style={{ marginTop: '0.8rem', color: '#e74c3c', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem' }}>EVIDENCE VAULT</div>
                        </div>
                    </motion.div>

                    {/* Stage 2 Heading ("ANOMALY DETECTED") */}
                    <motion.div style={{
                        position: 'absolute',
                        top: '15vh',
                        left: '50%',
                        x: '-50%',
                        textAlign: 'center',
                        opacity: evidenceTextOpacity,
                        y: evidenceTextY,
                        scale: evidenceTextScale,
                        width: '90%',
                        maxWidth: '1200px',
                        willChange: 'opacity, transform',
                        pointerEvents: 'none',
                        zIndex: 25
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, letterSpacing: '6px', margin: 0, color: '#e74c3c' }}>ANOMALY DETECTED</h2>
                    </motion.div>

                    {/* Stage 3: AI Investigation Graphic Card & Heading */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: aiOpacity, zIndex: 17, willChange: 'opacity', pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', left: '15%', top: '52%', transform: 'translateY(-50%)', width: 'clamp(280px, 25vw, 340px)', background: 'rgba(20, 18, 25, 0.9)', padding: '1.75rem', border: '1px solid #2ecc71', borderRadius: '8px', boxShadow: '0 0 30px rgba(46, 204, 113, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2ecc71', marginBottom: '1rem', letterSpacing: '2px', fontWeight: 600, fontSize: '0.85rem' }}>
                                <Zap size={18}/> <span>AI REASONING</span>
                            </div>
                            <div style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.8', letterSpacing: '1px', fontFamily: 'monospace' }}>
                                {'>'} DEVICE MISMATCH<br/>
                                {'>'} UNVERIFIED ROUTE<br/>
                                {'>'} <span style={{ color: '#e74c3c' }}>HIGH RISK ATO PATTERN</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stage 3 Heading ("AI REASONING") */}
                    <motion.div style={{
                        position: 'absolute',
                        top: '15vh',
                        left: '50%',
                        x: '-50%',
                        textAlign: 'center',
                        opacity: aiTextOpacity,
                        y: aiTextY,
                        scale: aiTextScale,
                        width: '90%',
                        maxWidth: '1200px',
                        willChange: 'opacity, transform',
                        pointerEvents: 'none',
                        zIndex: 25
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, letterSpacing: '6px', margin: 0, color: '#2ecc71' }}>AI REASONING</h2>
                    </motion.div>

                    {/* Stage 4: Final Decision Block ("EVIDENCE → ACTION") */}
                    <motion.div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: decisionTextOpacity,
                        scale: decisionTextScale,
                        y: decisionTextY,
                        zIndex: 30,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justify: 'center',
                        pointerEvents: 'auto',
                        willChange: 'opacity, transform'
                    }}>
                        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(20, 18, 25, 0.9) 0%, rgba(10, 10, 12, 0.95) 100%)', padding: 'clamp(2rem, 5vw, 4rem)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', maxWidth: '90vw' }}>
                            <ShieldAlert size={48} color="#f39c12" style={{ margin: '0 auto 1.5rem auto' }} />
                            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 200, letterSpacing: '8px', margin: '0 0 1rem 0' }}>EVIDENCE → ACTION</h2>
                            <p style={{ color: '#747d8c', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '3rem', letterSpacing: '3px', fontWeight: 300 }}>Automated dispute intelligence.</p>
                            
                            <button 
                                onClick={() => navigate('/login')}
                                style={{
                                    background: '#a55eea',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '1.2rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    letterSpacing: '2px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto',
                                    boxShadow: '0 10px 25px rgba(165, 94, 234, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                ENTER RISKTRACE <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
            
            {/* Scroll instruction at bottom of screen when at top */}
            <motion.div 
                style={{ 
                    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', 
                    opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
                    color: '#747d8c', letterSpacing: '2px', fontSize: '0.8rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                }}
            >
                SCROLL TO INVESTIGATE
                <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, #747d8c, transparent)' }} />
            </motion.div>

        </motion.div>
    );
}
