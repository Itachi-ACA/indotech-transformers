import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const departments = [
    {
        id: 'inspector',
        title: 'Inspector',
        desc: 'Inspector Details and Information',
    },
    {
        id: 'customer',
        title: 'Customer',
        desc: 'Customer Details and Information',
    },
    {
        id: 'marketing',
        title: 'Marketing',
        desc: 'Marketing Department — Orders and Enquiries',
    },
    {
        id: 'design',
        title: 'Design',
        desc: 'Design Department — Technical Parameters',
    },
];

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, ease: 'easeOut' },
};

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="homepage-root">
            {/* ─── Header ─── */}
            <header className="glass-header">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.svg" alt="Indo Tech" className="header-logo" />
                    <span className="header-brand">Transformers Ltd</span>
                </div>
                <button onClick={() => navigate('/internal')} className="header-admin-btn">
                    Admin Access
                </button>
            </header>

            {/* ─── Hero ─── */}
            <section className="hero-section">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
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

            {/* ─── Section: Powering India's Grid ─── */}
            <section className="corp-section">
                <motion.div {...fadeIn} className="corp-content">
                    <h3 className="corp-heading">Powering India's Grid Modernization</h3>
                    <p className="corp-body">
                        Indo Tech Transformers Ltd, with decades of engineering experience, stands as one of
                        India's most reliable manufacturers of power and distribution transformers — critical
                        components that enable electricity to flow safely, efficiently, and continuously across
                        the country.
                    </p>
                    <p className="corp-body">
                        Its ability to engineer products for varied applications — utilities, industrial plants,
                        steel mills, cement factories, renewable parks, and transmission systems — positions the
                        company as a system-level partner rather than a single-product manufacturer.
                    </p>
                </motion.div>
            </section>

            {/* ─── Section: Product Portfolio ─── */}
            <section className="corp-section">
                <motion.div {...fadeIn} className="corp-content">
                    <h3 className="corp-heading">Product Portfolio</h3>
                    <div className="corp-grid">
                        <div className="corp-card">
                            <h4 className="corp-card-title">Distribution Transformers</h4>
                            <p className="corp-card-body">100 KVA / 11KV to 5,000 KVA / 33KV — serving residential, commercial, and industrial setups with consistent delivery to utilities and DISCOMs.</p>
                        </div>
                        <div className="corp-card">
                            <h4 className="corp-card-title">Power Transformers</h4>
                            <p className="corp-card-body">5 MVA / 33KV to 31.5 MVA / 132KV — mid-capacity transformers for large industrial users and EPC contractors in 2-winding, 3-winding, and auto configurations.</p>
                        </div>
                        <div className="corp-card">
                            <h4 className="corp-card-title">Large Power Transformers</h4>
                            <p className="corp-card-body">Up to 200 MVA / 230KV — engineered for substations, renewable generation integration, and transmission strengthening projects.</p>
                        </div>
                        <div className="corp-card">
                            <h4 className="corp-card-title">Special Application</h4>
                            <p className="corp-card-body">Inverter-duty, converter-duty, and rectifier transformers tailored for wind, hydro, and solar applications supporting green energy expansion.</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Section: Manufacturing Excellence ─── */}
            <section className="corp-section">
                <motion.div {...fadeIn} className="corp-content">
                    <h3 className="corp-heading">Manufacturing Excellence</h3>
                    <p className="corp-body">
                        The company's manufacturing facility in Kancheepuram, Tamil Nadu is a vertically
                        integrated ecosystem featuring NABL-accredited testing laboratories, high-voltage
                        test bays, and quality systems aligned with global standards.
                    </p>
                    <div className="corp-stats">
                        <div className="corp-stat">
                            <span className="corp-stat-value">9,684</span>
                            <span className="corp-stat-label">MVA Installed Capacity</span>
                        </div>
                        <div className="corp-stat">
                            <span className="corp-stat-value">16,000</span>
                            <span className="corp-stat-label">MVA Planned Capacity</span>
                        </div>
                        <div className="corp-stat">
                            <span className="corp-stat-value">88%</span>
                            <span className="corp-stat-label">Capacity Utilisation (FY25)</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Section: Renewable Energy Integration ─── */}
            <section className="corp-section">
                <motion.div {...fadeIn} className="corp-content">
                    <h3 className="corp-heading">Renewable Energy Integration</h3>
                    <p className="corp-body">
                        India's mission to achieve 500 gigawatts of renewable energy capacity is creating
                        one of the largest transformer demand cycles in the country's history. Every gigawatt
                        of renewable power requires evacuation transformers, pooling substations, inverter-duty
                        transformers, and high-MVA step-up units.
                    </p>
                    <p className="corp-body">
                        With its facility located close to the southern renewable corridors and major industrial
                        hubs, Indo Tech benefits from proximity to wind-turbine OEMs, access to leading EPC
                        contractors, and faster commissioning response times.
                    </p>
                </motion.div>
            </section>

            {/* ─── Section: Industry Alignment ─── */}
            <section className="corp-section">
                <motion.div {...fadeIn} className="corp-content">
                    <h3 className="corp-heading">Industry Alignment</h3>
                    <p className="corp-body">
                        Indo Tech serves India's largest power utilities, EPC contractors, and industrial
                        houses — including organizations that operate in high-reliability environments where
                        transformer performance and long-term engineering quality are non-negotiable.
                    </p>
                    <div className="corp-clients">
                        {['NTPC', 'TNEB', 'NLC', 'DVC', 'Adani', 'Tata Projects', 'L&T', 'ABB', 'Siemens', 'JSW', 'Vestas', 'Suzlon'].map(name => (
                            <span key={name} className="corp-client-tag">{name}</span>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── Disclaimer ─── */}
            <section className="corp-disclaimer">
                <p>Information provided is for general corporate communication purposes. For statutory disclosures, please refer to official regulatory filings.</p>
            </section>

            {/* ─── Footer ─── */}
            <footer className="site-footer">
                <p>&copy; {new Date().getFullYear()} Indotech Transformers Ltd. All rights reserved.</p>
                <p className="footer-credit">Website is made by krishnaraju (Intern)</p>
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
        setTilt({ x: y * -6, y: x * 6 });
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            onClick={onClick}
            className="dept-card"
            style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
            <h3 className="dept-card-title">{dept.title}</h3>
            <p className="dept-card-desc">{dept.desc}</p>
            <span className="dept-card-arrow">&rarr;</span>
        </motion.div>
    );
}
