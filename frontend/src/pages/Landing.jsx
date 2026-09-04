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
    // 0.0 - 0.2: HERO & TRANSACTION
    // 0.2 - 0.4: PAYMENT (Sub-nodes appear)
    // 0.4 - 0.6: EVIDENCE (Anomaly nodes & vault)
    // 0.6 - 0.8: AI & INVESTIGATION
    // 0.8 - 1.0: DECISION (Final result & CTA)

    const stage = useTransform(scrollYProgress, 
        [0, 0.2, 0.4, 0.6, 0.8, 1], 
        [0, 1, 2, 3, 4, 5]
    );

    // Animations for the central node (Transaction)
    const txScaleRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1.5, 1.5, 0.8]);
    const txScale = shouldReduceMotion ? 1 : txScaleRaw;
    const txYRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 50, 50, -100]);
    const txY = shouldReduceMotion ? 0 : txYRaw;
    const txOpacity = useTransform(scrollYProgress, [0, 0.8, 0.9], [1, 1, 0]);

    // Animations for Payment Sub-nodes (Bank, Customer, Merchant)
    const paymentOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.8, 0.9], [0, 1, 1, 0]);
    const paymentYRaw = useTransform(scrollYProgress, [0.15, 0.25], [50, 0]);
    const paymentY = shouldReduceMotion ? 0 : paymentYRaw;

    // Animations for Evidence Vault and Anomaly
    const evidenceOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.8, 0.9], [0, 1, 1, 0]);
    const evidenceScaleRaw = useTransform(scrollYProgress, [0.35, 0.45], [0.8, 1]);
    const evidenceScale = shouldReduceMotion ? 1 : evidenceScaleRaw;

    // Animations for AI Grid and Reasoning
    const aiOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.9], [0, 1, 1, 0]);

    // Animations for Decision Block
    const decisionOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
    const decisionScaleRaw = useTransform(scrollYProgress, [0.75, 0.85], [0.9, 1]);
    const decisionScale = shouldReduceMotion ? 1 : decisionScaleRaw;

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
                    
                    {/* Hero Text */}
                    <motion.div style={{ position: 'absolute', top: '15%', textAlign: 'center', opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]), y: shouldReduceMotion ? 0 : useTransform(scrollYProgress, [0, 0.15], [0, -50]), willChange: 'opacity, transform' }}>
                        <h1 style={{ fontSize: '6rem', fontWeight: 200, letterSpacing: '8px', margin: 0, textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>FOLLOW THE MONEY.</h1>
                        <p style={{ color: '#a55eea', fontSize: '1.25rem', letterSpacing: '4px', marginTop: '1rem', fontWeight: 300 }}>Every payment leaves evidence.</p>
                    </motion.div>

                    {/* Central Transaction Node */}
                    <motion.div style={{ position: 'absolute', scale: txScale, y: txY, opacity: txOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, willChange: 'transform, opacity' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(165, 94, 234, 0.1)', border: '2px solid #a55eea', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(165, 94, 234, 0.3)' }}>
                            <Server size={32} color="#a55eea" />
                        </div>
                        <motion.div style={{ marginTop: '1rem', color: '#a55eea', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem' }}>TXN_94827</motion.div>
                    </motion.div>

                    {/* Payment Sub-nodes (Stage 1) */}
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

                        <motion.div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, 0)', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 200, letterSpacing: '6px', margin: 0 }}>PAYMENT DECONSTRUCTED</h2>
                        </motion.div>
                    </motion.div>

                    {/* Evidence & Anomaly (Stage 2) */}
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

                        <motion.div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, 0)', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 200, letterSpacing: '6px', margin: 0, color: '#e74c3c' }}>ANOMALY DETECTED</h2>
                        </motion.div>
                    </motion.div>

                    {/* AI Investigation (Stage 3) */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: aiOpacity, zIndex: 17, willChange: 'opacity' }}>
                        <div style={{ position: 'absolute', left: '20%', top: '50%', transform: 'translateY(-50%)', width: '320px', background: 'rgba(20, 18, 25, 0.9)', padding: '1.75rem', border: '1px solid #2ecc71', borderRadius: '8px', boxShadow: '0 0 30px rgba(46, 204, 113, 0.1)' }}>
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

                    {/* Final Decision (Stage 4) */}
                    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', opacity: decisionOpacity, scale: decisionScale, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', willChange: 'opacity, transform' }}>
                        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(20, 18, 25, 0.9) 0%, rgba(10, 10, 12, 0.95) 100%)', padding: '4rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                            <ShieldAlert size={48} color="#f39c12" style={{ margin: '0 auto 1.5rem auto' }} />
                            <h2 style={{ fontSize: '3.5rem', fontWeight: 200, letterSpacing: '8px', margin: '0 0 1rem 0' }}>EVIDENCE → ACTION</h2>
                            <p style={{ color: '#747d8c', fontSize: '1.1rem', marginBottom: '3rem', letterSpacing: '3px', fontWeight: 300 }}>Automated dispute intelligence.</p>
                            
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
