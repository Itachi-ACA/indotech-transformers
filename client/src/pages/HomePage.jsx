import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const departments = [
    {
        id: 'inspector',
        title: 'Inspector',
        icon: '🔍',
        desc: 'Inspector Details & Information',
        gradient: 'from-cyan-500/20 to-blue-600/20',
        borderColor: 'rgba(0, 212, 255, 0.4)',
        glowColor: 'rgba(0, 212, 255, 0.3)',
    },
    {
        id: 'customer',
        title: 'Customer',
        icon: '🏢',
        desc: 'Customer Details & Information',
        gradient: 'from-purple-500/20 to-indigo-600/20',
        borderColor: 'rgba(123, 47, 247, 0.4)',
        glowColor: 'rgba(123, 47, 247, 0.3)',
    },
    {
        id: 'marketing',
        title: 'Marketing',
        icon: '📊',
        desc: 'Marketing Dept — Orders & Enquiries',
        gradient: 'from-emerald-500/20 to-teal-600/20',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        glowColor: 'rgba(16, 185, 129, 0.3)',
    },
    {
        id: 'design',
        title: 'Design',
        icon: '⚙️',
        desc: 'Design Dept — Technical Parameters',
        gradient: 'from-orange-500/20 to-amber-600/20',
        borderColor: 'rgba(249, 115, 22, 0.4)',
        glowColor: 'rgba(249, 115, 22, 0.3)',
    },
];

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
        >
            {/* ─── Glass Header Bar ─── */}
            <header className="glass-header">
                {/* Left: Logo + Company Name */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img
                        src="/logo.svg"
                        alt="Indo Tech"
                        className="header-logo"
                    />
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold tracking-wide" style={{ color: '#00d4ff' }}>
                            Transformers Ltd
                        </span>
                    </div>
                </div>

                {/* Right: Admin Access */}
                <button
                    onClick={() => navigate('/internal')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-sm"
                >
                    <span className="text-base">🔒</span>
                    <span className="hidden sm:inline">Admin Access</span>
                </button>
            </header>

            {/* ─── Main Content (with top padding for fixed header) ─── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 pt-24">
                {/* Company Title Section */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: '#00d4ff' }}>
                        INDOTECH
                    </h1>
                    <h2 className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-400 mt-1">
                        Transformers Ltd
                    </h2>
                    <div className="mt-4 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                    <p className="mt-4 text-sm text-gray-500 tracking-wider uppercase">
                        Industrial Data Collection System
                    </p>
                </motion.div>

                {/* Department Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                    {departments.map((dept, i) => (
                        <DepartmentCard
                            key={dept.id}
                            dept={dept}
                            index={i}
                            onClick={() => navigate(`/form/${dept.id}`)}
                        />
                    ))}
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-12 text-xs text-gray-600 tracking-wider"
                >
                    © {new Date().getFullYear()} Indotech Transformers Ltd. All rights reserved.
                </motion.p>
            </div>
        </motion.div>
    );
}

function DepartmentCard({ dept, index, onClick }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const [ripples, setRipples] = useState([]);

    function handleMouseMove(e) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -15, y: x * 15 });
    }

    function handleMouseLeave() {
        setTilt({ x: 0, y: 0 });
    }

    function handleClick(e) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
        setTimeout(() => onClick(), 300);
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={`glass-card ripple-container cursor-pointer p-8 bg-gradient-to-br ${dept.gradient} relative overflow-hidden`}
            style={{
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                borderColor: dept.borderColor,
            }}
            whileHover={{
                boxShadow: `0 0 30px ${dept.glowColor}, 0 0 60px ${dept.glowColor}`,
                borderColor: dept.borderColor,
            }}
        >
            {ripples.map(r => (
                <span key={r.id} className="ripple-effect" style={{ left: r.x, top: r.y }} />
            ))}

            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${dept.borderColor}, transparent)` }} />

            <div className="relative z-10 text-center">
                <div className="text-5xl mb-4">{dept.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{dept.title}</h3>
                <p className="text-sm text-gray-400">{dept.desc}</p>
            </div>

            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: dept.borderColor, opacity: 0.5 }} />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: dept.borderColor, opacity: 0.5 }} />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: dept.borderColor, opacity: 0.5 }} />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: dept.borderColor, opacity: 0.5 }} />
        </motion.div>
    );
}
