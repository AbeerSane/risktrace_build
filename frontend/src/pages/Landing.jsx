import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Database, ShieldAlert, Zap, Server, ChevronRight, ArrowRight, 
    ShieldCheck, Cpu, AlertTriangle, FileText, CheckCircle2, TrendingUp, 
    Network, Crosshair, Sparkles, CreditCard, ShoppingBag, Truck, Smartphone,
    User, HelpCircle, Lock, Layers
} from 'lucide-react';

const SCENES = [
    {
        id: 'hero',
        eyebrow: 'AUTONOMOUS INVESTIGATION PLATFORM',
        eyebrowColor: '#8B5CF6',
        title: 'FOLLOW THE MONEY.',
        subtitle: 'Every payment leaves evidence. Trace and defend chargebacks automatically.',
        hasCta: true
    },
    {
        id: 'problem',
        eyebrow: 'FRAGMENTED EVIDENCE VECTORS',
        eyebrowColor: '#EF4444',
        title: 'TOO MANY SIGNALS.',
        subtitle: 'One dispute can span payment, order, shipment, device, and customer data.',
        hasCta: false
    },
    {
        id: 'deconstruction',
        eyebrow: 'TRANSACTION DECONSTRUCTION',
        eyebrowColor: '#8B5CF6',
        title: 'PAYMENT DECONSTRUCTED.',
        subtitle: 'Isolating network telemetry across bank, cardholder, and fulfillment nodes.',
        hasCta: false
    },
    {
        id: 'anomaly',
        eyebrow: 'FORENSIC VAULT CORRELATION',
        eyebrowColor: '#EF4444',
        title: 'ANOMALY DETECTED.',
        subtitle: 'Patterns emerge when disputes are viewed together across evidence vaults.',
        hasCta: false
    },
    {
        id: 'reasoning',
        eyebrow: 'NEURAL INVESTIGATION ENGINE',
        eyebrowColor: '#10B981',
        title: 'AI REASONING.',
        subtitle: 'Contradictions isolated. Autonomous case strength assessed with verifiable facts.',
        hasCta: false
    },
    {
        id: 'action',
        eyebrow: 'MERCHANT DECISION LAYER',
        eyebrowColor: '#F59E0B',
        title: 'EVIDENCE → ACTION.',
        subtitle: 'Transform verifiable evidence into high-confidence dispute wins and merchant control.',
        hasCta: false
    },
    {
        id: 'pattern',
        eyebrow: 'CROSS-DISPUTE RADAR',
        eyebrowColor: '#8B5CF6',
        title: 'SEE THE PATTERN.',
        subtitle: 'Multi-dispute correlation exposes coordinated syndicate fraud before chargebacks land.',
        hasCta: false
    },
    {
        id: 'resolution',
        eyebrow: 'AUTONOMOUS DEFENSE',
        eyebrowColor: '#10B981',
        title: 'TRACE THE STORY.',
        subtitle: 'Investigate disputes with evidence, intelligence, and control.',
        hasCta: false
    }
];

export default function Landing() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();

    // Active discrete scene state (0 to 7) - Guarantees ZERO simultaneous text overlap
    const [activeScene, setActiveScene] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        let scene = 0;
        if (latest < 0.125) scene = 0;
        else if (latest < 0.25) scene = 1;
        else if (latest < 0.375) scene = 2;
        else if (latest < 0.50) scene = 3;
        else if (latest < 0.625) scene = 4;
        else if (latest < 0.75) scene = 5;
        else if (latest < 0.875) scene = 6;
        else scene = 7;

        if (scene !== activeScene) {
            setActiveScene(scene);
        }
    });

    // Subtle interactive mouse tracking for ambient depth
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Interactive Navbar scroll styling
    const navBg = useTransform(
        scrollYProgress,
        [0, 0.04],
        ['rgba(8, 8, 10, 0.3)', 'rgba(15, 14, 23, 0.92)']
    );
    const navBorder = useTransform(
        scrollYProgress,
        [0, 0.04],
        ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.12)']
    );

    // Dynamic background illumination based on active scene
    const getEnvOpacity = () => {
        if (activeScene === 0) return 0.75; // Strong presence at Hero
        if (activeScene === 1) return 0.80; // High presence at Problem (illuminates chaotic thought bubble)
        if (activeScene >= 2 && activeScene <= 4) return 0.45; // Controlled background for dense telemetry
        if (activeScene === 5) return 0.60; // Action layer
        if (activeScene === 6) return 0.55; // Pattern intelligence
        return 0.80; // Full resolution at final scene
    };

    // Scroll instruction indicator (fades out immediately when scrolling starts)
    const scrollPromptOpacity = useTransform(scrollYProgress, [0.00, 0.025], [1, 0]);

    const scrollToStage = (progressVal) => {
        if (!containerRef.current) return;
        const targetScroll = progressVal * (containerRef.current.scrollHeight - window.innerHeight);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    const currentData = SCENES[activeScene];

    return (
        <div 
            ref={containerRef} 
            style={{ 
                height: '800vh',
                backgroundColor: '#08080A',
                color: '#fff',
                position: 'relative'
            }}
        >
            {/* ==================================================== */}
            {/* LAYER 1: FULL-SCREEN ILLUSTRATED WORKSPACE CANVAS    */}
            {/* Covers 100% of viewport - Never relegated to corner   */}
            {/* ==================================================== */}
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    overflow: 'hidden', 
                    zIndex: 1, 
                    pointerEvents: 'none' 
                }}
            >
                {/* Full-bleed background image with responsive coverage */}
                <motion.img 
                    src="/assets/risktrace-workspace.png" 
                    alt="RiskTrace Investigation Environment" 
                    animate={{ 
                        opacity: getEnvOpacity(),
                        x: shouldReduceMotion ? 0 : mousePos.x * 0.35,
                        y: shouldReduceMotion ? 0 : mousePos.y * 0.35
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 42%',
                        filter: 'brightness(0.85) contrast(1.10)'
                    }}
                />

                {/* Left Thought Bubble Atmosphere (Merchant Problem / Chaos) */}
                <motion.div 
                    animate={{ opacity: activeScene === 1 ? 0.9 : activeScene === 0 ? 0.3 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        left: '10%',
                        top: '12%',
                        width: 'clamp(280px, 30vw, 480px)',
                        height: 'clamp(280px, 30vw, 480px)',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(239, 68, 68, 0.08) 50%, transparent 75%)',
                        filter: 'blur(45px)',
                        pointerEvents: 'none'
                    }}
                />

                {/* Right Thought Bubble Atmosphere (RiskTrace Shield / Resolution) */}
                <motion.div 
                    animate={{ opacity: activeScene >= 5 ? 0.9 : activeScene === 0 ? 0.35 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        right: '10%',
                        top: '12%',
                        width: 'clamp(280px, 30vw, 480px)',
                        height: 'clamp(280px, 30vw, 480px)',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.38) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
                        filter: 'blur(45px)',
                        pointerEvents: 'none'
                    }}
                />

                {/* Atmospheric Vignette & Contrast Control (Ensures typography pop) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0.20) 35%, rgba(8, 8, 10, 0.45) 70%, rgba(8, 8, 10, 0.88) 100%)',
                    pointerEvents: 'none'
                }} />

                {/* Radial edge frame vignette */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(8, 8, 10, 0.7) 95%)',
                    pointerEvents: 'none'
                }} />

                {/* Subtle Grid Overlay */}
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', 
                    backgroundSize: '48px 48px', 
                    maskImage: shouldReduceMotion ? 'none' : 'radial-gradient(circle at center, black 40%, transparent 85%)',
                    pointerEvents: 'none'
                }} />
            </div>

            {/* ==================================================== */}
            {/* LAYER 5: MINIMALIST CINEMATIC NAVBAR                 */}
            {/* ==================================================== */}
            <motion.header 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    padding: '1.25rem 4vw', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    zIndex: 100, 
                    pointerEvents: 'auto',
                    backgroundColor: navBg,
                    borderBottom: '1px solid',
                    borderColor: navBorder,
                    backdropFilter: 'blur(16px)',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease'
                }}
            >
                {/* Left Wordmark */}
                <div 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
                >
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <ShieldCheck size={16} color="#fff" />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '2px', color: '#ffffff' }}>
                        RISKTRACE
                    </span>
                </div>

                {/* Middle Nav Links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {[
                        { label: 'The Problem', stage: 0.18, sceneIdx: 1 },
                        { label: 'Deconstruction', stage: 0.31, sceneIdx: 2 },
                        { label: 'AI Reasoning', stage: 0.56, sceneIdx: 4 },
                        { label: 'Action', stage: 0.68, sceneIdx: 5 },
                        { label: 'Pattern Intel', stage: 0.81, sceneIdx: 6 }
                    ].map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => scrollToStage(item.stage)} 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: activeScene === item.sceneIdx ? '#FFFFFF' : '#94A3B8', 
                                fontSize: '0.88rem', 
                                fontWeight: activeScene === item.sceneIdx ? 600 : 400,
                                cursor: 'pointer', 
                                transition: 'color 0.2s',
                                position: 'relative'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#fff'}
                            onMouseOut={e => e.currentTarget.style.color = activeScene === item.sceneIdx ? '#FFFFFF' : '#94A3B8'}
                        >
                            {item.label}
                            {activeScene === item.sceneIdx && (
                                <motion.div 
                                    layoutId="navDot"
                                    style={{
                                        position: 'absolute',
                                        bottom: '-6px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: '#8B5CF6'
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Right Action Group */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate('/login')} 
                        style={{ 
                            background: 'transparent', 
                            border: '1px solid rgba(255,255,255,0.14)', 
                            padding: '0.55rem 1.25rem', 
                            color: '#F8FAFC', 
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            transition: 'all 0.2s ease' 
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/register')} 
                        style={{ 
                            background: 'var(--accent-primary)', 
                            border: 'none', 
                            padding: '0.55rem 1.4rem', 
                            color: '#ffffff', 
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.45)',
                            transition: 'all 0.2s ease' 
                        }}
                        onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Get Started
                    </button>
                </div>
            </motion.header>

            {/* ==================================================== */}
            {/* LAYER 4: TOP EDITORIAL TYPOGRAPHY CONTROLLER         */}
            {/* AnimatePresence mode="wait" guarantees ONE scene in DOM */}
            {/* ==================================================== */}
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 'clamp(82px, 11vh, 110px)', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '92%', 
                    maxWidth: '840px', 
                    textAlign: 'center', 
                    zIndex: 40, 
                    pointerEvents: 'none' 
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentData.id}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <span style={{ 
                            fontSize: 'clamp(0.72rem, 0.8vw, 0.78rem)', 
                            letterSpacing: '2.5px', 
                            fontWeight: 600, 
                            color: currentData.eyebrowColor, 
                            textTransform: 'uppercase', 
                            marginBottom: '0.45rem' 
                        }}>
                            {currentData.eyebrow}
                        </span>

                        <h1 style={{ 
                            fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)', 
                            fontWeight: 700, 
                            letterSpacing: '-0.025em', 
                            lineHeight: '1.14', 
                            color: '#F8FAFC', 
                            margin: '0 0 0.55rem 0', 
                            textShadow: '0 0 40px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)' 
                        }}>
                            {currentData.title}
                        </h1>

                        <p style={{ 
                            fontSize: 'clamp(0.88rem, 1vw, 1.05rem)', 
                            fontWeight: 400, 
                            color: 'rgba(255, 255, 255, 0.78)', 
                            lineHeight: '1.5', 
                            maxWidth: '560px', 
                            margin: currentData.hasCta ? '0 0 1.25rem 0' : '0',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                        }}>
                            {currentData.subtitle}
                        </p>

                        {currentData.hasCta && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.25 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', pointerEvents: 'auto' }}
                            >
                                <button 
                                    onClick={() => navigate('/register')}
                                    style={{
                                        background: 'var(--accent-primary)',
                                        border: 'none',
                                        padding: '0.65rem 1.6rem',
                                        color: '#ffffff',
                                        fontSize: '0.88rem',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 18px rgba(139, 92, 246, 0.45)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Get Started <ArrowRight size={15} />
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    style={{
                                        background: 'rgba(15, 14, 23, 0.75)',
                                        border: '1px solid rgba(255, 255, 255, 0.18)',
                                        padding: '0.65rem 1.4rem',
                                        color: '#F8FAFC',
                                        fontSize: '0.88rem',
                                        fontWeight: 500,
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(15, 14, 23, 0.75)'}
                                >
                                    Sign In
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ==================================================== */}
            {/* LAYER 3: DEDICATED VISUAL STAGE                      */}
            {/* Positioned comfortably below typography and laptop   */}
            {/* ==================================================== */}
            <div 
                style={{ 
                    position: 'fixed', 
                    top: 'clamp(380px, 61vh, 580px)', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: '100%', 
                    maxWidth: '960px', 
                    height: '380px', 
                    pointerEvents: 'none', 
                    zIndex: 30 
                }}
            >
                <AnimatePresence mode="wait">
                    {/* SCENE 0: HERO - Minimal breathing space, letting full workspace shine */}
                    {activeScene === 0 && (
                        <motion.div
                            key="scene-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    )}

                    {/* SCENE 1: THE PROBLEM - 6 Fragmented Evidence Vectors */}
                    {activeScene === 1 && (
                        <motion.div
                            key="scene-1"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1rem',
                                width: 'min(660px, 92%)'
                            }}>
                                {[
                                    { icon: CreditCard, label: 'PAYMENT', val: 'Card 4242 • $2,490', alert: false },
                                    { icon: User, label: 'CUSTOMER', val: 'Sarah Jenkins (3 Disputes)', alert: true },
                                    { icon: ShoppingBag, label: 'ORDER', val: 'Apple MacBook Pro M3', alert: false },
                                    { icon: Truck, label: 'SHIPMENT', val: 'FedEx Signed POD', alert: false },
                                    { icon: Smartphone, label: 'DEVICE', val: 'IP Mismatch (+480km)', alert: true },
                                    { icon: HelpCircle, label: 'CLAIM', val: 'Unrecognized Charge', alert: true }
                                ].map((item, idx) => (
                                    <div 
                                        key={idx}
                                        style={{
                                            background: 'rgba(15, 14, 23, 0.92)',
                                            border: `1px solid ${item.alert ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.12)'}`,
                                            borderRadius: '10px',
                                            padding: '0.85rem 1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.35rem',
                                            boxShadow: item.alert ? '0 0 25px rgba(239, 68, 68, 0.2)' : '0 12px 30px rgba(0,0,0,0.6)',
                                            backdropFilter: 'blur(12px)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.68rem', letterSpacing: '1.5px', color: item.alert ? '#EF4444' : '#94A3B8', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                                {item.label}
                                            </span>
                                            <item.icon size={15} color={item.alert ? '#EF4444' : '#A78BFA'} />
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: '#F8FAFC', fontWeight: 500 }}>
                                            {item.val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 2: DECONSTRUCTION - Bank & User Network Nodes */}
                    {activeScene === 2 && (
                        <motion.div
                            key="scene-2"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            style={{ position: 'relative', width: '100%', height: '100%' }}
                        >
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                <line x1="32%" y1="50%" x2="68%" y2="50%" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.65" />
                            </svg>
                            
                            <div style={{ position: 'absolute', left: '32%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(15, 14, 23, 0.92)', border: '1.5px solid #8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}>
                                    <Server size={22} color="#A78BFA" />
                                </div>
                                <span style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#CBD5E1', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>BANK_NODE</span>
                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>AUTH_APPROVED</span>
                            </div>

                            <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid #8B5CF6', padding: '0.35rem 0.9rem', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>
                                <span style={{ fontSize: '0.7rem', color: '#A78BFA', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '1px' }}>3DS VERIFIED</span>
                            </div>

                            <div style={{ position: 'absolute', left: '68%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(15, 14, 23, 0.92)', border: '1.5px solid #8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}>
                                    <Smartphone size={22} color="#A78BFA" />
                                </div>
                                <span style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#CBD5E1', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>USER_NODE</span>
                                <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>IP: 142.250.190.46</span>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 3: ANOMALY DETECTION - Evidence Vault Correlation */}
                    {activeScene === 3 && (
                        <motion.div
                            key="scene-3"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            style={{ position: 'relative', width: '100%', height: '100%' }}
                        >
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                <line x1="32%" y1="35%" x2="50%" y2="70%" stroke="#EF4444" strokeWidth="1.5" opacity="0.65" />
                                <line x1="68%" y1="35%" x2="50%" y2="70%" stroke="#EF4444" strokeWidth="1.5" opacity="0.65" />
                            </svg>

                            <div style={{ position: 'absolute', left: '32%', top: '35%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', background: 'rgba(15, 14, 23, 0.92)', border: '1px solid #EF4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)' }}>
                                    <span style={{ fontSize: '0.68rem', color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>+480KM ROUTE DEVIATION</span>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', left: '68%', top: '35%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', background: 'rgba(15, 14, 23, 0.92)', border: '1px solid #EF4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.25)' }}>
                                    <span style={{ fontSize: '0.68rem', color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>DEVICE MISMATCH DETECTED</span>
                                </div>
                            </div>

                            <div style={{ position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(15, 14, 23, 0.92)', border: '1.5px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 35px rgba(239, 68, 68, 0.4)' }}>
                                    <Database size={26} color="#EF4444" />
                                </div>
                                <span style={{ marginTop: '0.45rem', color: '#EF4444', fontWeight: 600, letterSpacing: '2px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                                    EVIDENCE VAULT
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 4: AI REASONING - Neural Investigation Engine Telemetry */}
                    {activeScene === 4 && (
                        <motion.div
                            key="scene-4"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ 
                                width: 'min(580px, 92%)', 
                                background: 'rgba(15, 14, 23, 0.95)', 
                                padding: '1.4rem 1.6rem', 
                                border: '1px solid rgba(16, 185, 129, 0.45)', 
                                borderRadius: '12px', 
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)',
                                backdropFilter: 'blur(16px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.65rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', letterSpacing: '2px', fontWeight: 600, fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                                        <Zap size={15}/> <span>NEURAL INVESTIGATION ENGINE</span>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                        84% WIN PROBABILITY
                                    </span>
                                </div>
                                <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: '1.8', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>
                                    <div>{'>'} <span style={{ color: '#F8FAFC' }}>CONTRADICTION ISOLATED:</span> Buyer claims item not delivered.</div>
                                    <div>{'>'} <span style={{ color: '#10B981' }}>PROOF OF DELIVERY:</span> Signed POD matches billing name + GPS coords.</div>
                                    <div>{'>'} <span style={{ color: '#10B981' }}>STRONG DEFENSE PACKAGE:</span> 4 independent evidence vectors matched.</div>
                                    <div style={{ marginTop: '0.45rem', paddingTop: '0.45rem', borderTop: '1px dashed rgba(255,255,255,0.1)', color: '#A78BFA' }}>
                                        {'>'} RECOMMENDATION: CONTEST DISPUTE WITH COMPILED EVIDENCE PACK.
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 5: EVIDENCE -> ACTION - 3 Merchant Decision Cards */}
                    {activeScene === 5 && (
                        <motion.div
                            key="scene-5"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: 'min(680px, 92%)' }}>
                                <div style={{ background: 'rgba(15, 14, 23, 0.94)', border: '1.5px solid #10B981', borderRadius: '12px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)', backdropFilter: 'blur(16px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#10B981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>RECOMMENDED</span>
                                        <CheckCircle2 size={16} color="#10B981" />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>CONTEST</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4' }}>Autonomous evidence bundle ready for payment gateway submission.</span>
                                </div>

                                <div style={{ background: 'rgba(15, 14, 23, 0.94)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', backdropFilter: 'blur(16px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#F59E0B', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>OPTIONAL</span>
                                        <FileText size={16} color="#F59E0B" />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>REQUEST PROOF</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4' }}>Poll carrier API for supplementary delivery photographs and signature.</span>
                                </div>

                                <div style={{ background: 'rgba(15, 14, 23, 0.94)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', backdropFilter: 'blur(16px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#64748B', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>FALLBACK</span>
                                        <ShieldAlert size={16} color="#64748B" />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#CBD5E1' }}>CONCEDE</span>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: '1.4' }}>Safeguard merchant standing when dispute viability is below margin.</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 6: PATTERN INTELLIGENCE - Cross-Dispute Syndicate Radar */}
                    {activeScene === 6 && (
                        <motion.div
                            key="scene-6"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ width: 'min(600px, 92%)', background: 'rgba(15, 14, 23, 0.95)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '14px', padding: '1.4rem 1.6rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(139, 92, 246, 0.25)', backdropFilter: 'blur(16px)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontWeight: 600, fontSize: '0.76rem', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
                                        <Network size={16}/> <span>CROSS-MERCHANT SYNDICATE RADAR</span>
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                        CLUSTER ACTIVE
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    {[
                                        { id: 'DSP_9482', risk: 'HIGH', match: 'Shared Device Hash (dev_8f29c4)', merchant: 'Storefront A' },
                                        { id: 'DSP_9487', risk: 'HIGH', match: 'Burner Phone Number Correlation', merchant: 'Storefront B' },
                                        { id: 'DSP_9501', risk: 'CRITICAL', match: 'Recurring Proxy IP Range (+480km)', merchant: 'Storefront C' }
                                    ].map((dsp, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#F8FAFC', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{dsp.id} • {dsp.merchant}</span>
                                                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{dsp.match}</span>
                                            </div>
                                            <span style={{ fontSize: '0.68rem', color: '#EF4444', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{dsp.risk}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* SCENE 7: FINAL RESOLUTION - Glowing Shield & Final CTA */}
                    {activeScene === 7 && (
                        <motion.div
                            key="scene-7"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.28 }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1.75rem',
                                pointerEvents: 'auto'
                            }}
                        >
                            <div style={{
                                width: '68px',
                                height: '68px',
                                borderRadius: '18px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1.5px solid rgba(16, 185, 129, 0.45)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 40px rgba(16, 185, 129, 0.35)',
                                backdropFilter: 'blur(12px)'
                            }}>
                                <ShieldCheck size={36} color="#10B981" />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="rt-btn rt-btn-primary"
                                    style={{ padding: '0.95rem 2.4rem', fontSize: '0.95rem' }}
                                >
                                    ENTER RISKTRACE <ArrowRight size={18} />
                                </button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="rt-btn rt-btn-secondary"
                                    style={{ padding: '0.95rem 2.2rem', fontSize: '0.95rem' }}
                                >
                                    Sign In
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.74rem', color: '#94A3B8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Lock size={13} color="#10B981" /> BANK-GRADE SECURITY
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#94A3B8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <CheckCircle2 size={13} color="#10B981" /> 100% AUDIT TRAIL
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#94A3B8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Layers size={13} color="#10B981" /> EXPLAINABLE AI
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scroll Indicator (Fades out immediately when scrolling > 2.5%) */}
            <motion.div 
                style={{ 
                    position: 'fixed', 
                    bottom: '2rem', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    opacity: scrollPromptOpacity,
                    color: '#64748B', 
                    letterSpacing: '2px', 
                    fontSize: '0.75rem',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    zIndex: 40,
                    pointerEvents: 'none'
                }}
            >
                SCROLL TO INVESTIGATE
                <div style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, #64748B, transparent)' }} />
            </motion.div>
        </div>
    );
}
