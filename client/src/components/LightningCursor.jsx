import { useEffect, useRef, useState } from 'react';

/**
 * LightningCursor — pure CSS lightning effect that follows the mouse.
 * Uses CSS custom properties (--mx, --my) to position elements.
 * All visual effects are CSS-only (radial gradients, box-shadows, animations).
 */
export default function LightningCursor() {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show on devices with a pointer (no touch)
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
        }

        function onLeave() {
            setVisible(false);
        }

        function tick() {
            // Smooth lerp for the main dot
            cx += (mx - cx) * 0.18;
            cy += (my - cy) * 0.18;
            el.style.setProperty('--mx', `${mx}px`);
            el.style.setProperty('--my', `${my}px`);
            el.style.setProperty('--cx', `${cx}px`);
            el.style.setProperty('--cy', `${cy}px`);
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
            {/* Lightning arc sparks */}
            <div className="lc-spark lc-spark-1" />
            <div className="lc-spark lc-spark-2" />
            <div className="lc-spark lc-spark-3" />
            <div className="lc-spark lc-spark-4" />
        </div>
    );
}
