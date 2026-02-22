import { useState, useCallback, useEffect } from 'react';
import TransformerReveal from '../components/TransformerReveal';
import PremiumCursor from '../components/PremiumCursor';

export default function LandingPage() {
    const [loadProgress, setLoadProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const onLoadProgress = useCallback((pct) => {
        setLoadProgress(pct);
    }, []);

    const onLoadComplete = useCallback(() => {
        setTimeout(() => {
            setLoaded(true);
            setTimeout(() => setShowContent(true), 900);
        }, 400);
    }, []);

    // Force ALL backgrounds dark on this page
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById('root');

        html.style.cssText += '; background-color: #050505 !important;';
        body.style.cssText += '; background-color: #050505 !important;';
        if (root) root.style.cssText += '; background-color: #050505 !important;';

        return () => {
            html.style.backgroundColor = '';
            body.style.backgroundColor = '';
            if (root) root.style.backgroundColor = '';
        };
    }, []);

    return (
        <>
            {/* Full-page dark background layer — sits behind everything */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    backgroundColor: '#050505',
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, background: '#050505' }}>
                <PremiumCursor />

                {/* Loading Screen */}
                {!showContent && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 9999,
                            backgroundColor: '#050505',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: loaded ? 0 : 1,
                            transition: 'opacity 0.8s ease',
                            pointerEvents: loaded ? 'none' : 'auto',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <h1
                                style={{
                                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                    fontWeight: 300,
                                    letterSpacing: '0.3em',
                                    color: 'rgba(255,255,255,0.9)',
                                    marginBottom: 24,
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}
                            >
                                ENGINEERED POWER
                            </h1>
                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 400,
                                    letterSpacing: '0.15em',
                                    color: 'rgba(255,255,255,0.4)',
                                    marginBottom: 32,
                                    fontVariantNumeric: 'tabular-nums',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                }}
                            >
                                Loading {loadProgress}%
                            </p>
                            <div
                                style={{
                                    width: 200,
                                    height: 1,
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    margin: '0 auto',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${loadProgress}%`,
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        transition: 'width 0.15s linear',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Scroll Indicator */}
                {showContent && (
                    <div className="scroll-indicator si-visible">
                        <span>Scroll to Explore</span>
                        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                            <path
                                d="M8 4V20M8 20L2 14M8 20L14 14"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}

                {/* Main scroll content */}
                <TransformerReveal
                    onLoadProgress={onLoadProgress}
                    onLoadComplete={onLoadComplete}
                />

                {/* End section */}
                <section
                    style={{
                        position: 'relative',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#050505',
                    }}
                >
                    <div style={{ textAlign: 'center', padding: '48px 32px' }}>
                        <h2
                            style={{
                                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                                fontWeight: 300,
                                letterSpacing: '0.25em',
                                color: 'rgba(255,255,255,0.85)',
                                marginBottom: 12,
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                        >
                            INDOTECH TRANSFORMERS LTD
                        </h2>
                        <p
                            style={{
                                fontSize: 14,
                                fontWeight: 300,
                                letterSpacing: '0.1em',
                                color: 'rgba(255,255,255,0.4)',
                                marginBottom: 40,
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                        >
                            Engineering Excellence Since Inception
                        </p>
                        <div
                            style={{
                                width: 60,
                                height: 1,
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                margin: '0 auto 40px',
                            }}
                        />
                        <a
                            href="/"
                            style={{
                                display: 'inline-block',
                                padding: '14px 40px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: 13,
                                letterSpacing: '0.15em',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                        >
                            Enter Data Portal →
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
}
