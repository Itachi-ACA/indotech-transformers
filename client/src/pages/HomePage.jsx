import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const departments = [
    {
        id: 'inspector',
        title: 'Inspector',
        desc: 'Inspector Details and Information',
        gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        accent: 'rgba(200,200,200,0.3)',
    },
    {
        id: 'customer',
        title: 'Customer',
        desc: 'Customer Details and Information',
        gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        accent: 'rgba(200,200,200,0.3)',
    },
    {
        id: 'marketing',
        title: 'Marketing',
        desc: 'Marketing Department — Orders and Enquiries',
        gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        accent: 'rgba(200,200,200,0.3)',
    },
    {
        id: 'design',
        title: 'Design',
        desc: 'Design Department — Technical Parameters',
        gradient: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        accent: 'rgba(200,200,200,0.3)',
    },
];

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage-root">
            {/* ─── Glass Header Bar ─── */}
            <header className="glass-header">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.svg" alt="Indo Tech" className="header-logo" />
                    <span className="header-brand">Transformers Ltd</span>
                </div>
                <button
                    onClick={() => navigate('/internal')}
                    className="header-admin-btn"
                >
                    Admin Access
                </button>
            </header>

            {/* ─── Hero Section ─── */}
            <section className="hero-section">
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="hero-text"
                >
                    <h1 className="hero-title">INDOTECH</h1>
                    <h2 className="hero-subtitle">TRANSFORMERS LTD</h2>
                    <div className="hero-divider" />
                    <p className="hero-tagline">Industrial Data Collection System</p>
                </motion.div>

                {/* Department Grid */}
                <div className="dept-grid">
                    {departments.map((dept, i) => (
                        <DepartmentCard
                            key={dept.id}
                            dept={dept}
                            index={i}
                            onClick={() => navigate(`/form/${dept.id}`)}
                        />
                    ))}
                </div>
            </section>

            {/* ─── Scroll sections for assembly animation ─── */}
            <section className="scroll-section">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="scroll-content"
                >
                    <h3 className="scroll-heading">Precision Engineering</h3>
                    <p className="scroll-body">
                        Every transformer begins with a meticulously designed magnetic core,
                        precision-wound copper conductors, and laminated steel assemblies
                        engineered for optimal flux performance.
                    </p>
                </motion.div>
            </section>

            <section className="scroll-section">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="scroll-content"
                >
                    <h3 className="scroll-heading">Thermal Management</h3>
                    <p className="scroll-body">
                        Advanced radiator systems and oil channels ensure long-duration
                        load stability, maintaining operational integrity across
                        demanding industrial environments.
                    </p>
                </motion.div>
            </section>

            <section className="scroll-section">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="scroll-content"
                >
                    <h3 className="scroll-heading">Sealed. Operational.</h3>
                    <p className="scroll-body">
                        A unified power system engineered to deliver decades of
                        reliable, uninterrupted service across critical infrastructure
                        and industrial installations worldwide.
                    </p>
                </motion.div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="site-footer">
                <p>&copy; {new Date().getFullYear()} Indotech Transformers Ltd. All rights reserved.</p>
            </footer>
        </div>
    );
}

function DepartmentCard({ dept, index, onClick }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    function handleMouseMove(e) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -8, y: x * 8 });
    }

    function handleMouseLeave() {
        setTilt({ x: 0, y: 0 });
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.6, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="dept-card"
            style={{
                background: dept.gradient,
                transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
        >
            <h3 className="dept-card-title">{dept.title}</h3>
            <p className="dept-card-desc">{dept.desc}</p>
            <span className="dept-card-arrow">&rarr;</span>
        </motion.div>
    );
}
