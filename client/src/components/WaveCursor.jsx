import { useState, useEffect } from 'react';

export default function WaveCursor() {
    const [waves, setWaves] = useState([]);

    useEffect(() => {
        let lastMove = 0;

        const handleMouseMove = (e) => {
            const now = Date.now();
            // Throttle wave creation to once every 40ms to prevent performance issues
            if (now - lastMove < 40) return;
            lastMove = now;

            const id = now + Math.random();
            const newWave = { id, x: e.clientX, y: e.clientY };

            setWaves((prev) => [...prev, newWave]);

            // Remove the wave after the animation completes (600ms)
            setTimeout(() => {
                setWaves((prev) => prev.filter(w => w.id !== id));
            }, 600);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {waves.map((wave) => (
                <div
                    key={wave.id}
                    className="wave-cursor-effect"
                    style={{
                        left: wave.x,
                        top: wave.y,
                    }}
                />
            ))}
        </div>
    );
}
