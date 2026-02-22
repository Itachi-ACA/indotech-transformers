import { useRef, useEffect, useState, useCallback } from 'react';

const FRAME_COUNT = 224;

const STORY_BEATS = [
    {
        start: 0.0, end: 0.20,
        title: 'ENGINEERED POWER',
        subtitle: 'From Architecture to Operation',
        align: 'center',
    },
    {
        start: 0.25, end: 0.45,
        title: 'MAGNETIC CORE PRECISION',
        subtitle: 'Laminated steel and copper windings aligned for controlled flux performance.',
        align: 'left',
    },
    {
        start: 0.50, end: 0.70,
        title: 'THERMAL MANAGEMENT',
        subtitle: 'Radiators and oil channels engineered for long-duration load stability.',
        align: 'right',
    },
    {
        start: 0.75, end: 0.95,
        title: 'SEALED. OPERATIONAL.',
        subtitle: 'A unified power system engineered for decades.',
        align: 'center',
    },
];

export default function TransformerReveal({ onLoadProgress, onLoadComplete }) {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(-1);
    const rafIdRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Preload all frames
    useEffect(() => {
        let loaded = 0;
        const images = new Array(FRAME_COUNT);
        let cancelled = false;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/sequence/frame_${i}.jpg`;
            img.onload = () => {
                if (cancelled) return;
                loaded++;
                const pct = Math.round((loaded / FRAME_COUNT) * 100);
                onLoadProgress?.(pct);
                if (loaded === FRAME_COUNT) {
                    imagesRef.current = images;
                    setReady(true);
                    onLoadComplete?.();
                }
            };
            img.onerror = () => {
                if (cancelled) return;
                loaded++;
                const pct = Math.round((loaded / FRAME_COUNT) * 100);
                onLoadProgress?.(pct);
                if (loaded === FRAME_COUNT) {
                    imagesRef.current = images;
                    setReady(true);
                    onLoadComplete?.();
                }
            };
            images[i] = img;
        }

        return () => { cancelled = true; };
    }, []); // Only run once

    // Draw frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const img = imagesRef.current[index];
        if (!img || !img.complete || !img.naturalWidth) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const displayW = canvas.clientWidth;
        const displayH = canvas.clientHeight;

        // Only resize canvas buffer if needed
        const bufferW = Math.floor(displayW * dpr);
        const bufferH = Math.floor(displayH * dpr);
        if (canvas.width !== bufferW || canvas.height !== bufferH) {
            canvas.width = bufferW;
            canvas.height = bufferH;
        }

        // Clear
        ctx.clearRect(0, 0, bufferW, bufferH);

        // Contain fit
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.min(bufferW / iw, bufferH / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (bufferW - dw) / 2;
        const dy = (bufferH - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Scroll tracking
    useEffect(() => {
        function onScroll() {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const scrollableHeight = rect.height - window.innerHeight;
            if (scrollableHeight <= 0) return;
            const raw = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
            setScrollProgress(raw);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Animation loop - spring-smoothed frame drawing
    useEffect(() => {
        if (!ready) return;

        let springValue = 0;
        let springVelocity = 0;
        let lastFrame = -1;

        // Draw first frame immediately
        drawFrame(0);

        function tick() {
            // Spring physics
            const target = scrollProgress;
            const force = -100 * (springValue - target); // stiffness
            const damping = -30 * springVelocity;
            const acceleration = (force + damping) / 0.2; // mass

            springVelocity += acceleration * (1 / 60);
            springValue += springVelocity * (1 / 60);

            const clamped = Math.max(0, Math.min(1, springValue));
            const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(clamped * (FRAME_COUNT - 1)));

            if (frameIndex !== lastFrame) {
                lastFrame = frameIndex;
                drawFrame(frameIndex);
            }

            rafIdRef.current = requestAnimationFrame(tick);
        }

        rafIdRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [ready, scrollProgress, drawFrame]);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'relative',
                height: '400vh',
                background: '#050505',
            }}
        >
            {/* Sticky canvas container */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        background: '#050505',
                    }}
                />

                {/* Story beats */}
                {STORY_BEATS.map((beat, i) => (
                    <StoryBeat key={i} beat={beat} progress={scrollProgress} />
                ))}
            </div>
        </div>
    );
}

function StoryBeat({ beat, progress }) {
    // [start, start+0.05, end-0.05, end] → [0, 1, 1, 0]
    let opacity = 0;
    let y = 20;

    const fadeIn = beat.start;
    const fullIn = beat.start + 0.05;
    const fullOut = beat.end - 0.05;
    const fadeOut = beat.end;

    if (progress >= fadeIn && progress <= fullIn) {
        const t = (progress - fadeIn) / (fullIn - fadeIn);
        opacity = t;
        y = 20 * (1 - t);
    } else if (progress > fullIn && progress < fullOut) {
        opacity = 1;
        y = 0;
    } else if (progress >= fullOut && progress <= fadeOut) {
        const t = (progress - fullOut) / (fadeOut - fullOut);
        opacity = 1 - t;
        y = -20 * t;
    }

    const alignStyle =
        beat.align === 'left'
            ? { top: '50%', left: '5%', transform: `translateY(calc(-50% + ${y}px))`, textAlign: 'left' }
            : beat.align === 'right'
                ? { top: '50%', right: '5%', left: 'auto', transform: `translateY(calc(-50% + ${y}px))`, textAlign: 'right' }
                : { top: '50%', left: '50%', transform: `translate(-50%, calc(-50% + ${y}px))`, textAlign: 'center' };

    return (
        <div
            style={{
                position: 'absolute',
                zIndex: 10,
                maxWidth: 600,
                padding: '0 32px',
                pointerEvents: 'none',
                opacity,
                ...alignStyle,
            }}
        >
            <h2
                style={{
                    fontSize: 'clamp(2.5rem, 8vw, 7rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 0.95,
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: 16,
                    fontFamily: 'Inter, system-ui, sans-serif',
                }}
            >
                {beat.title}
            </h2>
            <p
                style={{
                    fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: 420,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    ...(beat.align === 'center' ? { margin: '0 auto' } : {}),
                    ...(beat.align === 'right' ? { marginLeft: 'auto' } : {}),
                }}
            >
                {beat.subtitle}
            </p>
        </div>
    );
}
