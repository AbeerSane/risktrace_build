import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, ShieldAlert, Zap, Server, ChevronRight } from 'lucide-react';

export default function Landing() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    // Graphic Animations (Central transaction node, nodes, lines, vault)
    const txScaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.70, 0.75], [1, 1.4, 1.4, 0.8]);
    const txScale = shouldReduceMotion ? 1 : txScaleRaw;
    const txYRaw = useTransform(scrollYProgress, [0, 0.2, 0.70, 0.75], [0, 40, 40, -80]);
    const txY = shouldReduceMotion ? 0 : txYRaw;
    const txOpacity = useTransform(scrollYProgress, [0, 0.70, 0.75], [1, 1, 0]);

    // Payment sub-nodes (Bank & User)
    const paymentGraphicsOpacity = useTransform(scrollYProgress, [0.15, 0.22, 0.70, 0.75], [0, 1, 1, 0]);
    const paymentYRaw = useTransform(scrollYProgress, [0.15, 0.22], [40, 0]);
    const paymentY = shouldReduceMotion ? 0 : paymentYRaw;

    // Evidence Vault & Anomaly graphics
    const evidenceGraphicsOpacity = useTransform(scrollYProgress, [0.35, 0.42, 0.70, 0.75], [0, 1, 1, 0]);
    const evidenceScaleRaw = useTransform(scrollYProgress, [0.35, 0.42], [0.85, 1]);
    const evidenceScale = shouldReduceMotion ? 1 : evidenceScaleRaw;

    // AI Reasoning card graphic
    const aiGraphicsOpacity = useTransform(scrollYProgress, [0.55, 0.62, 0.70, 0.75], [0, 1, 1, 0]);

    // Mutually Exclusive Scroll Ranges for Top Typography (Strict ZERO Overlap)
    // Stage 0: 0.00 -> 0.15
    const s0Opacity = useTransform(scrollYProgress, [0.00, 0.10, 0.15], [1, 1, 0]);
    const s0Y = useTransform(scrollYProgress, [0.00, 0.15], [0, -25]);

    // Stage 1: 0.15 -> 0.35
    const s1Opacity = useTransform(scrollYProgress, [0.15, 0.20, 0.30, 0.35], [0, 1, 1, 0]);
    const s1Y = useTransform(scrollYProgress, [0.15, 0.20, 0.30, 0.35], [25, 0, 0, -25]);

    // Stage 2: 0.35 -> 0.55
    const s2Opacity = useTransform(scrollYProgress, [0.35, 0.40, 0.50, 0.55], [0, 1, 1, 0]);
    const s2Y = useTransform(scrollYProgress, [0.35, 0.40, 0.50, 0.55], [25, 0, 0, -25]);

    // Stage 3: 0.55 -> 0.75
    const s3Opacity = useTransform(scrollYProgress, [0.55, 0.60, 0.70, 0.75], [0, 1, 1, 0]);
    const s3Y = useTransform(scrollYProgress, [0.55, 0.60, 0.70, 0.75], [25, 0, 0, -25]);

    // Stage 4 (Final Decision Block): 0.75 -> 1.00
    const s4Opacity = useTransform(scrollYProgress, [0.75, 0.82, 1.00], [0, 1, 1]);
    const s4Y = useTransform(scrollYProgress, [0.75, 0.82], [35, 0]);
    const s4Scale = useTransform(scrollYProgress, [0.75, 0.82], [0.95, 1]);

    // Scroll instruction indicator (fades out immediately when scrolling starts)
    const scrollPromptOpacity = useTransform(scrollYProgress, [0.00, 0.03], [1, 0]);

    // Smooth background color shifting
    const bgColors = useTransform(scrollYProgress,
        [0, 0.4, 0.7, 1],
        ['#0a0a0c', '#0f0c1b', '#0c1214', '#08080a']
    );

    return (
        <motion.div 
            ref={containerRef} 
            style={{ 
                height: '500vh',
                backgroundColor: bgColors,
                color: '#fff',
                fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Fixed Canvas Container */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                
                {/* Header */}
                <header style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    padding: '1.75rem 3.5rem', 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center', 
                    zIndex: 100, 
                    pointerEvents: 'auto' 
                }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '3px', color: '#ffffff' }}>
                        RISKTRACE
                    </div>
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ 
                            background: 'transparent', 
                            border: '1px solid rgba(255,255,255,0.25)', 
                            padding: '0.6rem 1.4rem', 
                            color: '#fff', 
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            letterSpacing: '1px',
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            transition: 'all 0.2s ease' 
                        }}
                    >
                        Sign In
                    </button>
                </header>

                {/* Ambient Grid Overlay */}
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
                    backgroundSize: '50px 50px', 
                    zIndex: 0, 
                    maskImage: shouldReduceMotion ? 'none' : 'radial-gradient(circle at center, black, transparent 80%)' 
                }} />

                {/* Main Viewport Workspace */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10 }}>

                    {/* TOP TYPOGRAPHY HEADER (Razorpay Editorial Style: Eyebrow -> Main Title -> Subtitle) */}
                    <div style={{
                        position: 'absolute',
                        top: '110px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '90%',
                        maxWidth: '900px',
                        textAlign: 'center',
                        zIndex: 25,
                        pointerEvents: 'none'
                    }}>
                        {/* STAGE 0: HERO ("FOLLOW THE MONEY.") */}
                        <motion.div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: s0Opacity,
                            y: shouldReduceMotion ? 0 : s0Y,
                            willChange: 'opacity, transform'
                        }}>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', letterSpacing: '3px', fontWeight: 600, color: '#a55eea', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                                DISPUTE INTELLIGENCE ENGINE
                            </span>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 4.8vw, 4.2rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: '1.12', color: '#ffffff', margin: '0 0 0.75rem 0', textShadow: '0 0 30px rgba(255,255,255,0.15)' }}>
                                FOLLOW THE MONEY.
                            </h1>
                            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', fontWeight: 400, color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5', maxWidth: '600px', margin: 0 }}>
                                Every payment leaves evidence. Trace anomalies automatically.
                            </p>
                        </motion.div>

                        {/* STAGE 1: PAYMENT DECONSTRUCTED */}
                        <motion.div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: s1Opacity,
                            y: shouldReduceMotion ? 0 : s1Y,
                            willChange: 'opacity, transform'
                        }}>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', letterSpacing: '3px', fontWeight: 600, color: '#a55eea', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                                TRANSACTION DECONSTRUCTION
                            </span>
                            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: '1.12', color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                                PAYMENT DECONSTRUCTED.
                            </h2>
                            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', fontWeight: 400, color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5', maxWidth: '600px', margin: 0 }}>
                                Isolating network signals across bank, user, and merchant nodes.
                            </p>
                        </motion.div>

                        {/* STAGE 2: ANOMALY DETECTED */}
                        <motion.div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: s2Opacity,
                            y: shouldReduceMotion ? 0 : s2Y,
                            willChange: 'opacity, transform'
                        }}>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', letterSpacing: '3px', fontWeight: 600, color: '#e74c3c', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                                BEHAVIOR & VAULT ANALYSIS
                            </span>
                            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: '1.12', color: '#e74c3c', margin: '0 0 0.75rem 0' }}>
                                ANOMALY DETECTED.
                            </h2>
                            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', fontWeight: 400, color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5', maxWidth: '600px', margin: 0 }}>
                                High velocity pattern flagged inside the evidence vault.
                            </p>
                        </motion.div>

                        {/* STAGE 3: AI REASONING */}
                        <motion.div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: s3Opacity,
                            y: shouldReduceMotion ? 0 : s3Y,
                            willChange: 'opacity, transform'
                        }}>
                            <span style={{ fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', letterSpacing: '3px', fontWeight: 600, color: '#2ecc71', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                                NEURAL RISK ASSESSMENT
                            </span>
                            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: '1.12', color: '#2ecc71', margin: '0 0 0.75rem 0' }}>
                                AI REASONING.
                            </h2>
                            <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', fontWeight: 400, color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.5', maxWidth: '600px', margin: 0 }}>
                                Device mismatch and unverified shipping route detected.
                            </p>
                        </motion.div>
                    </div>

                    {/* CENTRAL GRAPHIC NODE (TXN Server) */}
                    <motion.div style={{ 
                        position: 'absolute', 
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        scale: txScale, 
                        y: txY, 
                        opacity: txOpacity, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        zIndex: 20, 
                        willChange: 'transform, opacity' 
                    }}>
                        <div style={{ 
                            width: '76px', 
                            height: '76px', 
                            borderRadius: '50%', 
                            background: 'rgba(165, 94, 234, 0.1)', 
                            border: '2px solid #a55eea', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            boxShadow: '0 0 40px rgba(165, 94, 234, 0.3)' 
                        }}>
                            <Server size={30} color="#a55eea" />
                        </div>
                        <div style={{ marginTop: '0.75rem', color: '#a55eea', fontWeight: 600, letterSpacing: '2px', fontSize: '0.75rem' }}>
                            TXN_94827
                        </div>
                    </motion.div>

                    {/* STAGE 1 GRAPHICS: BANK & USER SUB-NODES */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: paymentGraphicsOpacity, y: paymentY, zIndex: 15, willChange: 'opacity, transform' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <line x1="50%" y1="50%" x2="35%" y2="65%" stroke="#a55eea" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                            <line x1="50%" y1="50%" x2="65%" y2="65%" stroke="#a55eea" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                        </svg>
                        
                        <div style={{ position: 'absolute', left: '35%', top: '65%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.65rem', color: '#ccc', letterSpacing: '1px' }}>BANK</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', left: '65%', top: '65%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.65rem', color: '#ccc', letterSpacing: '1px' }}>USER</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* STAGE 2 GRAPHICS: EVIDENCE VAULT & ANOMALY DOTS */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: evidenceGraphicsOpacity, scale: evidenceScale, zIndex: 16, willChange: 'opacity, transform' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <line x1="35%" y1="65%" x2="50%" y2="78%" stroke="#e74c3c" strokeWidth="2" opacity="0.8" />
                            <line x1="65%" y1="65%" x2="50%" y2="78%" stroke="#e74c3c" strokeWidth="2" opacity="0.8" />
                        </svg>

                        <div style={{ position: 'absolute', left: '35%', top: '65%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', background: '#e74c3c', right: '-4px', top: '-4px', boxShadow: '0 0 12px #e74c3c' }} />
                        </div>
                        <div style={{ position: 'absolute', left: '65%', top: '65%', transform: 'translate(-50%, -50%)' }}>
                            <div style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', background: '#e74c3c', right: '-4px', top: '-4px', boxShadow: '0 0 12px #e74c3c' }} />
                        </div>

                        <div style={{ position: 'absolute', left: '50%', top: '78%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'rgba(231, 76, 60, 0.1)', border: '2px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(231, 76, 60, 0.3)' }}>
                                <Database size={26} color="#e74c3c" />
                            </div>
                            <div style={{ marginTop: '0.5rem', color: '#e74c3c', fontWeight: 600, letterSpacing: '2px', fontSize: '0.75rem' }}>EVIDENCE VAULT</div>
                        </div>
                    </motion.div>

                    {/* STAGE 3 GRAPHIC CARD: AI REASONING BREAKDOWN */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: aiGraphicsOpacity, zIndex: 17, willChange: 'opacity', pointerEvents: 'none' }}>
                        <div style={{ 
                            position: 'absolute', 
                            left: '12%', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            width: 'clamp(260px, 22vw, 320px)', 
                            background: 'rgba(20, 18, 25, 0.92)', 
                            padding: '1.5rem', 
                            border: '1px solid #2ecc71', 
                            borderRadius: '8px', 
                            boxShadow: '0 0 30px rgba(46, 204, 113, 0.12)' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2ecc71', marginBottom: '0.85rem', letterSpacing: '2px', fontWeight: 600, fontSize: '0.8rem' }}>
                                <Zap size={16}/> <span>LIVE LOGS</span>
                            </div>
                            <div style={{ color: '#ccc', fontSize: '0.8rem', lineHeight: '1.8', letterSpacing: '1px', fontFamily: 'monospace' }}>
                                {'>'} DEVICE MISMATCH<br/>
                                {'>'} UNVERIFIED ROUTE<br/>
                                {'>'} <span style={{ color: '#e74c3c' }}>HIGH RISK ATO PATTERN</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* STAGE 4: FINAL DECISION MODAL CARD ("EVIDENCE → ACTION") */}
                    <motion.div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: s4Opacity,
                        scale: s4Scale,
                        y: s4Y,
                        zIndex: 30,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'auto',
                        willChange: 'opacity, transform'
                    }}>
                        <div style={{ 
                            textAlign: 'center', 
                            background: 'linear-gradient(135deg, rgba(20, 18, 25, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)', 
                            padding: 'clamp(2.5rem, 5vw, 4rem)', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.12)', 
                            boxShadow: '0 30px 60px rgba(0,0,0,0.6)', 
                            maxWidth: '650px',
                            width: '90vw'
                        }}>
                            <ShieldAlert size={44} color="#f39c12" style={{ margin: '0 auto 1.25rem auto' }} />
                            <span style={{ fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 600, color: '#f39c12', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                                DECISION & RECOVERY
                            </span>
                            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 0.75rem 0', color: '#ffffff' }}>
                                EVIDENCE → ACTION
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', marginBottom: '2.5rem', letterSpacing: '1px', fontWeight: 400 }}>
                                Turn dispute evidence into instant automated recovery.
                            </p>
                            
                            <button 
                                onClick={() => navigate('/login')}
                                style={{
                                    background: '#a55eea',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '1rem 2.5rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '1.5px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto',
                                    boxShadow: '0 10px 25px rgba(165, 94, 234, 0.4)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ENTER RISKTRACE <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
            
            {/* Scroll Indicator (Fades out immediately when scrolling > 3%) */}
            <motion.div 
                style={{ 
                    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', 
                    opacity: scrollPromptOpacity,
                    color: '#747d8c', letterSpacing: '2px', fontSize: '0.75rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    zIndex: 40,
                    pointerEvents: 'none'
                }}
            >
                SCROLL TO INVESTIGATE
                <div style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, #747d8c, transparent)' }} />
            </motion.div>

        </motion.div>
    );
}
