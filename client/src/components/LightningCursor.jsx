import { useEffect, useRef, useState } from 'react';

/**
 * LightningCursor — CSS lightning effect with trailing electric sparks.
 * Spawns fading trail particles as the cursor moves.
 */
const MAX_TRAIL = 16;

export default function LightningCursor() {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const trailRef = useRef([]);
    const trailIdRef = useRef(0);
    const [trail, setTrail] = useState([]);
    const lastPos = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const mql = window.matchMedia('(pointer: fine)');
        if (!mql.matches) return;

        const el = containerRef.current;
        if (!el) return;

        let rafId = null;
        let mx = 0, my = 0;
        let cx = 0, cy = 0;

        function onMove(e) {
            mx = e.clientX;
            my = e.clientY;
            if (!visible) setVisible(true);

            // Spawn trail particle if moved enough distance
            const dx = mx - lastPos.current.x;
            const dy = my - lastPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 12) {
                lastPos.current = { x: mx, y: my };
                const id = trailIdRef.current++;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const newParticle = { id, x: mx, y: my, angle, born: Date.now() };

                trailRef.current = [...trailRef.current.slice(-(MAX_TRAIL - 1)), newParticle];
                setTrail([...trailRef.current]);
            }
        }

        function onLeave() {
            setVisible(false);
        }

        function tick() {
            cx += (mx - cx) * 0.18;
            cy += (my - cy) * 0.18;
            el.style.setProperty('--mx', `${mx}px`);
            el.style.setProperty('--my', `${my}px`);
            el.style.setProperty('--cx', `${cx}px`);
            el.style.setProperty('--cy', `${cy}px`);

            // Clean old trail particles (older than 600ms)
            const now = Date.now();
            const alive = trailRef.current.filter(p => now - p.born < 600);
            if (alive.length !== trailRef.current.length) {
                trailRef.current = alive;
                setTrail([...alive]);
            }

            rafId = requestAnimationFrame(tick);
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            cancelAnimationFrame(rafId);
        };
    }, [visible]);

    return (
        <div
            ref={containerRef}
            className={`lightning-cursor-root ${visible ? 'lc-visible' : ''}`}
            aria-hidden="true"
        >
            {/* Core glow dot */}
            <div className="lc-dot" />
            {/* Outer electric ring */}
            <div className="lc-ring" />
            {/* Sparks */}
            <div className="lc-spark lc-spark-1" />
            <div className="lc-spark lc-spark-2" />
            <div className="lc-spark lc-spark-3" />
            <div className="lc-spark lc-spark-4" />

            {/* Lightning trail particles */}
            {trail.map(p => {
                const age = Date.now() - p.born;
                const life = Math.max(0, 1 - age / 600);
                return (
                    <div
                        key={p.id}
                        className="lc-trail"
                        style={{
                            left: p.x,
                            top: p.y,
                            opacity: life * 0.8,
                            transform: `rotate(${p.angle}deg) scaleX(${0.5 + life * 0.5})`,
                        }}
                    />
                );
            })}
        </div>
    );
}
