import { useEffect, useRef, useState } from 'react';

/**
 * SparkleCursor — spawns tiny sparkle particles as the cursor moves.
 * Normal cursor remains visible. Sparkles fade and drift away.
 */
const MAX_SPARKLES = 24;

export default function LightningCursor() {
    const [sparkles, setSparkles] = useState([]);
    const sparklesRef = useRef([]);
    const idRef = useRef(0);
    const lastPos = useRef({ x: -100, y: -100 });
    const rafRef = useRef(null);

    useEffect(() => {
        const mql = window.matchMedia('(pointer: fine)');
        if (!mql.matches) return;

        function onMove(e) {
            const mx = e.clientX;
            const my = e.clientY;

            const dx = mx - lastPos.current.x;
            const dy = my - lastPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 8) {
                lastPos.current = { x: mx, y: my };

                // Spawn 2–3 sparkles per trigger
                const count = 2 + Math.floor(Math.random() * 2);
                const now = Date.now();

                for (let i = 0; i < count; i++) {
                    const id = idRef.current++;
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    const size = 2 + Math.random() * 3;
                    const driftX = (Math.random() - 0.5) * 30;
                    const driftY = -10 - Math.random() * 20;

                    sparklesRef.current.push({
                        id, x: mx + offsetX, y: my + offsetY,
                        size, driftX, driftY, born: now,
                    });
                }

                // Trim to max
                if (sparklesRef.current.length > MAX_SPARKLES) {
                    sparklesRef.current = sparklesRef.current.slice(-MAX_SPARKLES);
                }
            }
        }

        function tick() {
            const now = Date.now();
            const alive = sparklesRef.current.filter(s => now - s.born < 500);
            sparklesRef.current = alive;
            setSparkles([...alive]);
            rafRef.current = requestAnimationFrame(tick);
        }

        window.addEventListener('mousemove', onMove, { passive: true });
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="sparkle-root" aria-hidden="true">
            {sparkles.map(s => {
                const age = Date.now() - s.born;
                const life = Math.max(0, 1 - age / 500);
                const x = s.x + s.driftX * (1 - life);
                const y = s.y + s.driftY * (1 - life);

                return (
                    <div
                        key={s.id}
                        className="sparkle-particle"
                        style={{
                            left: x,
                            top: y,
                            width: s.size * life,
                            height: s.size * life,
                            opacity: life,
                        }}
                    />
                );
            })}
        </div>
    );
}
