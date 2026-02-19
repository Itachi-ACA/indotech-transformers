import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SuccessOverlay from '../components/SuccessOverlay';

const FORM_CONFIGS = {
    customer: {
        title: 'Customer Details',
        icon: '🏢',
        color: '#7b2ff7',
        sections: [
            {
                fields: [
                    { name: 'name', label: 'Name' },
                    { name: 'address', label: 'Address', type: 'textarea' },
                    { name: 'country', label: 'Country' },
                    { name: 'state', label: 'State' },
                ],
            },
        ],
    },
    inspector: {
        title: 'Inspector Details',
        icon: '🔍',
        color: '#00d4ff',
        sections: [
            {
                fields: [
                    { name: 'first_name', label: 'First Name' },
                    { name: 'last_name', label: 'Last Name' },
                    { name: 'designation', label: 'Designation' },
                    { name: 'organization', label: 'Organization' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'mobile_number', label: 'Mobile Number', type: 'tel' },
                ],
            },
        ],
    },
    marketing: {
        title: 'Marketing Dept',
        icon: '📊',
        color: '#10b981',
        requiresWO: true,
        sections: [
            {
                fields: [
                    { name: 'work_order_no', label: 'W.O No.', required: true },
                    { name: 'serial_no', label: 'Serial No.' },
                    { name: 'project_name', label: 'Project Name' },
                    { name: 'project_location', label: 'Project Location' },
                    { name: 'customer_name', label: 'Customer Name' },
                    { name: 'purchase_order_no', label: 'Purchase Order No.' },
                    { name: 'contractor_name', label: 'Contractor Name' },
                    { name: 'epc_contractor_name', label: 'EPC Contractor Name' },
                    { name: 'sub_contractor_name', label: 'Sub Contractor Name' },
                    { name: 'consultant_name', label: 'Consultant Name' },
                    { name: 'end_customer_name', label: 'End Customer Name' },
                    { name: 'loa_no', label: 'LOA No.' },
                    { name: 'order_receipt_date', label: 'Order Receipt Date', type: 'date' },
                ],
            },
        ],
    },
    design: {
        title: 'Design Dept',
        icon: '⚙️',
        color: '#f97316',
        requiresWO: true,
        sections: [
            {
                title: 'Basic Information',
                fields: [
                    { name: 'work_order_no', label: 'W.O No.', required: true },
                    { name: 'serial_no', label: 'Serial No.' },
                    { name: 'no_of_phase', label: 'No. of Phase' },
                    { name: 'vector_group', label: 'Vector Group' },
                    { name: 'frequency', label: 'Frequency' },
                    { name: 'phase_marking', label: 'Phase Marking' },
                    { name: 'reference_standard', label: 'Reference Standard' },
                    { name: 'winding_material', label: 'Winding Material' },
                    { name: 'cooling_type', label: 'Cooling Type' },
                ],
            },
            {
                title: 'Rating Table',
                layout: 'table',
                headers: ['', 'Rating 1', 'Rating 2', 'Rating 3'],
                rows: [
                    { label: 'MVA Rating', fields: ['mva_rating_1', 'mva_rating_2', 'mva_rating_3'] },
                    { label: 'Voltage Rating', fields: ['voltage_rating_wdg1', 'voltage_rating_wdg2', 'voltage_rating_wdg3'] },
                ],
            },
            {
                title: 'HR Test Detail',
                layout: 'table',
                headers: ['', 'Oil', 'Wdg 1', 'Wdg 2', 'Wdg 3'],
                rows: [
                    { label: 'HR Test', fields: ['hr_test_oil', 'hr_test_wdg1', 'hr_test_wdg2', 'hr_test_wdg3'] },
                ],
            },
            {
                title: 'Insulation Details',
                layout: 'table',
                headers: ['', 'LI', 'AV', 'IOV'],
                rows: [
                    { label: 'Wdg 1 Line Terminal', fields: ['ins_wdg1_line_li', 'ins_wdg1_line_av', 'ins_wdg1_line_iov'] },
                    { label: 'Wdg 1 Neutral', fields: ['ins_wdg1_neutral_li', 'ins_wdg1_neutral_av', 'ins_wdg1_neutral_iov'] },
                    { label: 'Wdg 2 Line Terminal', fields: ['ins_wdg2_line_li', 'ins_wdg2_line_av', 'ins_wdg2_line_iov'] },
                    { label: 'Wdg 2 Neutral', fields: ['ins_wdg2_neutral_li', 'ins_wdg2_neutral_av', 'ins_wdg2_neutral_iov'] },
                    { label: 'Wdg 3 Line Terminal', fields: ['ins_wdg3_line_li', 'ins_wdg3_line_av', 'ins_wdg3_line_iov'] },
                    { label: 'Wdg 3 Neutral', fields: ['ins_wdg3_neutral_li', 'ins_wdg3_neutral_av', 'ins_wdg3_neutral_iov'] },
                ],
            },
            {
                title: 'Voltage Variation',
                layout: 'table',
                headers: ['', 'Wdg 1', 'Wdg 2', 'Wdg 3'],
                rows: [
                    { label: '+ Pos Tap Range', fields: ['volt_var_pos_tap_wdg1', 'volt_var_pos_tap_wdg2', 'volt_var_pos_tap_wdg3'] },
                    { label: '- Neg Tap Range', fields: ['volt_var_neg_tap_wdg1', 'volt_var_neg_tap_wdg2', 'volt_var_neg_tap_wdg3'] },
                    { label: 'Tap Insertion (%)', fields: ['volt_var_tap_ins_pct_wdg1', 'volt_var_tap_ins_pct_wdg2', 'volt_var_tap_ins_pct_wdg3'] },
                ],
            },
        ],
    },
};

export default function FormPage() {
    const { type } = useParams();
    const navigate = useNavigate();
    const config = FORM_CONFIGS[type];

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!config) navigate('/');
    }, [config, navigate]);

    useEffect(() => {
        if (showSuccess && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (showSuccess && countdown === 0) {
            navigate('/');
        }
    }, [showSuccess, countdown, navigate]);

    if (!config) return null;

    function handleChange(name, value) {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (config.requiresWO && !formData.work_order_no?.trim()) {
            setError('Work Order Number is required.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(`/api/forms/${type}`, formData);
            setShowSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save data. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function renderSection(section, sectionIdx) {
        if (section.layout === 'table') {
            return (
                <motion.div
                    key={sectionIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * sectionIdx }}
                    className="md:col-span-2"
                >
                    {section.title && (
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: config.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                            {section.title}
                        </h3>
                    )}
                    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: `${config.color}22` }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    {section.headers.map((h, i) => (
                                        <th
                                            key={i}
                                            className="px-3 py-2 text-left text-xs uppercase tracking-wider"
                                            style={{ color: config.color, background: `${config.color}0a`, borderBottom: `1px solid ${config.color}22` }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {section.rows.map((row, ri) => (
                                    <tr key={ri}>
                                        <td className="px-3 py-2 text-xs text-gray-400 font-medium whitespace-nowrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            {row.label}
                                        </td>
                                        {row.fields.map((fieldName) => (
                                            <td key={fieldName} className="px-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <input
                                                    type="text"
                                                    className="neon-input text-sm py-1.5 px-2"
                                                    value={formData[fieldName] || ''}
                                                    onChange={e => handleChange(fieldName, e.target.value)}
                                                    placeholder="—"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            );
        }

        // Normal field layout
        return (
            <React.Fragment key={sectionIdx}>
                {section.title && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * sectionIdx }}
                        className="md:col-span-2 mt-2"
                    >
                        <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: config.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
                            {section.title}
                        </h3>
                        <div className="h-px mt-2" style={{ background: `linear-gradient(to right, ${config.color}33, transparent)` }} />
                    </motion.div>
                )}
                {section.fields.map((field, i) => (
                    <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (sectionIdx * 0.1) + (i * 0.02) }}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                        <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                            <textarea
                                className="neon-input"
                                rows={3}
                                placeholder={`Enter ${field.label}`}
                                value={formData[field.name] || ''}
                                onChange={e => handleChange(field.name, e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                className="neon-input"
                                placeholder={`Enter ${field.label}`}
                                value={formData[field.name] || ''}
                                onChange={e => handleChange(field.name, e.target.value)}
                                required={field.required}
                            />
                        )}
                    </motion.div>
                ))}
            </React.Fragment>
        );
    }

    return (
        <>
            <AnimatePresence>
                {showSuccess && <SuccessOverlay countdown={countdown} />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="min-h-screen flex items-start justify-center px-4 py-8"
            >
                <div className="glass-card w-full max-w-3xl p-6 md:p-8 my-4">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-white transition-colors text-2xl"
                            title="Back to Home"
                        >
                            ←
                        </button>
                        <div className="flex-1 flex items-center gap-3">
                            <span className="text-3xl">{config.icon}</span>
                            <div>
                                <h1 className="text-2xl font-bold" style={{ color: config.color }}>
                                    {config.title}
                                </h1>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Indotech Transformers Ltd</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent mb-6" style={{ backgroundImage: `linear-gradient(to right, transparent, ${config.color}44, transparent)` }} />

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-4 p-3 rounded-lg border overflow-hidden"
                                style={{ borderColor: '#ef444444', background: '#ef444411' }}
                            >
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {config.sections.map((section, idx) => renderSection(section, idx))}
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="neon-btn flex-1 flex items-center justify-center gap-2"
                                style={{ borderColor: config.color + '66', color: config.color }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>💾 Save Data</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
}

