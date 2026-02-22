import { useRef, useEffect, useState, useCallback } from 'react';

const FRAME_COUNT = 224;
const SPRING_CONFIG = { stiffness: 100, damping: 30, mass: 0.2 };

const STORY_BEATS = [
    {
        start: 0, end: 0.20,
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

function getFramePath(index) {
    return `/sequence/frame_${index}.jpg`;
}

export default function TransformerReveal({ onLoadProgress, onLoadComplete }) {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0);
    const springValueRef = useRef(0);
    const springVelocityRef = useRef(0);
    const rafIdRef = useRef(null);
    const scrollProgressRef = useRef(0);

    // Preload all frames
    useEffect(() => {
        let loaded = 0;
        const images = new Array(FRAME_COUNT);

        function onFrameLoad() {
            loaded++;
            const pct = Math.round((loaded / FRAME_COUNT) * 100);
            onLoadProgress?.(pct);
            if (loaded === FRAME_COUNT) {
                imagesRef.current = images;
                onLoadComplete?.();
            }
        }

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = onFrameLoad;
            img.onerror = onFrameLoad; // count errors too so we don't stall
            images[i] = img;
        }

        return () => {
            // cleanup
            images.forEach(img => { img.onload = null; img.onerror = null; });
        };
    }, [onLoadProgress, onLoadComplete]);

    // Draw frame to canvas
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[index];
        if (!canvas || !img || !img.complete || !img.naturalWidth) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        const cw = rect.width;
        const ch = rect.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Contain fit
        const scale = Math.min(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Scroll + Spring animation loop
    useEffect(() => {
        function onScroll() {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const scrollableHeight = rect.height - window.innerHeight;
            const rawProgress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
            scrollProgressRef.current = rawProgress;
        }

        function tick() {
            // Spring physics
            const target = scrollProgressRef.current;
            const current = springValueRef.current;
            const velocity = springVelocityRef.current;

            const force = -SPRING_CONFIG.stiffness * (current - target);
            const dampingForce = -SPRING_CONFIG.damping * velocity;
            const acceleration = (force + dampingForce) / SPRING_CONFIG.mass;

            const newVelocity = velocity + acceleration * (1 / 60);
            const newValue = current + newVelocity * (1 / 60);

            springValueRef.current = newValue;
            springVelocityRef.current = newVelocity;

            // Map spring value to frame
            const clampedProgress = Math.max(0, Math.min(1, newValue));
            const frameIndex = Math.floor(clampedProgress * (FRAME_COUNT - 1));
            const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));

            if (clampedFrame !== currentFrameRef.current) {
                currentFrameRef.current = clampedFrame;
                drawFrame(clampedFrame);
            }

            rafIdRef.current = requestAnimationFrame(tick);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        rafIdRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [drawFrame]);

    // Draw first frame on mount
    useEffect(() => {
        if (imagesRef.current.length > 0) {
            drawFrame(0);
        }
    }, [drawFrame]);

    return (
        <div ref={wrapperRef} className="reveal-wrapper">
            {/* Sticky canvas */}
            <div className="reveal-sticky">
                <canvas ref={canvasRef} className="reveal-canvas" />

                {/* Story beats */}
                {STORY_BEATS.map((beat, i) => (
                    <StoryBeat key={i} beat={beat} wrapperRef={wrapperRef} />
                ))}
            </div>
        </div>
    );
}

function StoryBeat({ beat, wrapperRef }) {
    const ref = useRef(null);
    const [style, setStyle] = useState({ opacity: 0, transform: 'translateY(20px)' });

    useEffect(() => {
        function onScroll() {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const scrollableHeight = rect.height - window.innerHeight;
            const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));

            // [start, start+0.05, end-0.05, end] → [0, 1, 1, 0]
            const fadeIn = beat.start;
            const fullIn = beat.start + 0.05;
            const fullOut = beat.end - 0.05;
            const fadeOut = beat.end;

            let opacity = 0;
            let y = 20;

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

            setStyle({
                opacity,
                transform: `translateY(${y}px)`,
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [beat, wrapperRef]);

    const alignClass = beat.align === 'left'
        ? 'beat-left'
        : beat.align === 'right'
            ? 'beat-right'
            : 'beat-center';

    return (
        <div ref={ref} className={`story-beat ${alignClass}`} style={style}>
            <h2 className="beat-title">{beat.title}</h2>
            <p className="beat-subtitle">{beat.subtitle}</p>
        </div>
    );
}
