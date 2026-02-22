import { useState, useCallback } from 'react';
import TransformerReveal from '../components/TransformerReveal';
import PremiumCursor from '../components/PremiumCursor';

export default function LandingPage() {
    const [loadProgress, setLoadProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const onLoadProgress = useCallback((pct) => {
        setLoadProgress(pct);
    }, []);

    const onLoadComplete = useCallback(() => {
        // Small delay then fade in
        setTimeout(() => {
            setFadeIn(true);
            setTimeout(() => setLoaded(true), 800);
        }, 300);
    }, []);

    return (
        <div className="landing-root">
            <PremiumCursor />

            {/* Loading Screen */}
            {!loaded && (
                <div className={`landing-loader ${fadeIn ? 'loader-fade' : ''}`}>
                    <div className="loader-content">
                        <h1 className="loader-title">ENGINEERED POWER</h1>
                        <p className="loader-subtitle">Loading {loadProgress}%</p>
                        <div className="loader-bar-track">
                            <div
                                className="loader-bar-fill"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Indicator */}
            <div className={`scroll-indicator ${loaded ? 'si-visible' : ''}`}>
                <span>Scroll to Explore</span>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <path d="M8 4V20M8 20L2 14M8 20L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Main Content */}
            <TransformerReveal
                onLoadProgress={onLoadProgress}
                onLoadComplete={onLoadComplete}
            />

            {/* End section */}
            <section className="landing-end">
                <div className="end-content">
                    <h2 className="end-title">INDOTECH TRANSFORMERS LTD</h2>
                    <p className="end-subtitle">Engineering Excellence Since Inception</p>
                    <div className="end-divider" />
                    <a href="/" className="end-cta">
                        Enter Data Portal →
                    </a>
                </div>
            </section>
        </div>
    );
}
