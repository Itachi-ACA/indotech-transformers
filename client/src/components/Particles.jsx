import { useEffect, useState } from 'react';

export default function Particles() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const pts = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 8,
            duration: 6 + Math.random() * 8,
            size: 1 + Math.random() * 3,
        }));
        setParticles(pts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(0, 212, 255, 0.3)`,
                    }}
                />
            ))}
        </div>
    );
}
