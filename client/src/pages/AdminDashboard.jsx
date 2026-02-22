import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const TABS = [
    { id: 'inspectors', label: 'Inspector Data', color: '#64748b' },
    { id: 'customers', label: 'Customer Data', color: '#64748b' },
    { id: 'marketing', label: 'Marketing Data', color: '#64748b' },
    { id: 'design', label: 'Design Data', color: '#64748b' },
];

const COLUMN_LABELS = {
    // Customer
    name: 'Name',
    address: 'Address',
    country: 'Country',
    state: 'State',
    // Inspector
    first_name: 'First Name',
    last_name: 'Last Name',
    designation: 'Designation',
    organization: 'Organization',
    email: 'Email',
    mobile_number: 'Mobile No.',
    // Marketing
    work_order_no: 'W.O No.',
    serial_no: 'Serial No.',
    project_name: 'Project Name',
    project_location: 'Project Location',
    customer_name: 'Customer Name',
    purchase_order_no: 'Purchase Order No.',
    contractor_name: 'Contractor',
    epc_contractor_name: 'EPC Contractor',
    sub_contractor_name: 'Sub Contractor',
    consultant_name: 'Consultant',
    end_customer_name: 'End Customer',
    loa_no: 'LOA No.',
    order_receipt_date: 'Order Receipt Date',
    // Design basic
    no_of_phase: 'No. of Phase',
    vector_group: 'Vector Group',
    frequency: 'Frequency',
    phase_marking: 'Phase Marking',
    reference_standard: 'Ref. Standard',
    winding_material: 'Winding Material',
    // Design - Rating
    mva_rating_1: 'MVA Rating 1',
    mva_rating_2: 'MVA Rating 2',
    mva_rating_3: 'MVA Rating 3',
    cooling_type_1: 'Cooling Type 1',
    cooling_type_2: 'Cooling Type 2',
    cooling_type_3: 'Cooling Type 3',
    voltage_rating_wdg1: 'Voltage Wdg1',
    voltage_rating_wdg2: 'Voltage Wdg2',
    voltage_rating_wdg3: 'Voltage Wdg3',
    // Design - HR Test
    hr_test_oil: 'HR Oil',
    hr_test_wdg1: 'HR Wdg1',
    hr_test_wdg2: 'HR Wdg2',
    hr_test_wdg3: 'HR Wdg3',
    // Design - Insulation
    ins_wdg1_line_li: 'W1 Line LI',
    ins_wdg1_line_av: 'W1 Line AV',
    ins_wdg1_line_iov: 'W1 Line IOV',
    ins_wdg1_neutral_li: 'W1 Neut LI',
    ins_wdg1_neutral_av: 'W1 Neut AV',
    ins_wdg1_neutral_iov: 'W1 Neut IOV',
    ins_wdg2_line_li: 'W2 Line LI',
    ins_wdg2_line_av: 'W2 Line AV',
    ins_wdg2_line_iov: 'W2 Line IOV',
    ins_wdg2_neutral_li: 'W2 Neut LI',
    ins_wdg2_neutral_av: 'W2 Neut AV',
    ins_wdg2_neutral_iov: 'W2 Neut IOV',
    ins_wdg3_line_li: 'W3 Line LI',
    ins_wdg3_line_av: 'W3 Line AV',
    ins_wdg3_line_iov: 'W3 Line IOV',
    ins_wdg3_neutral_li: 'W3 Neut LI',
    ins_wdg3_neutral_av: 'W3 Neut AV',
    ins_wdg3_neutral_iov: 'W3 Neut IOV',
    // Design - Voltage Variation
    volt_var_pos_tap_wdg1: '+Tap Wdg1',
    volt_var_pos_tap_wdg2: '+Tap Wdg2',
    volt_var_pos_tap_wdg3: '+Tap Wdg3',
    volt_var_neg_tap_wdg1: '-Tap Wdg1',
    volt_var_neg_tap_wdg2: '-Tap Wdg2',
    volt_var_neg_tap_wdg3: '-Tap Wdg3',
    volt_var_tap_ins_pct_wdg1: 'Tap% Wdg1',
    volt_var_tap_ins_pct_wdg2: 'Tap% Wdg2',
    volt_var_tap_ins_pct_wdg3: 'Tap% Wdg3',
    // Common
    created_at: 'Created At',
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inspectors');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        axios.get('/api/auth/check', { withCredentials: true })
            .then(res => {
                if (res.data.authenticated) {
                    setAuthenticated(true);
                } else {
                    navigate('/internal');
                }
            })
            .catch(() => navigate('/internal'))
            .finally(() => setChecking(false));
    }, [navigate]);

    const fetchData = useCallback(async () => {
        if (!authenticated) return;
        setLoading(true);
        try {
            const params = search ? { search } : {};
            const res = await axios.get(`/api/admin/data/${activeTab}`, { params, withCredentials: true });
            setData(res.data.data || []);
        } catch (err) {
            if (err.response?.status === 401) navigate('/internal');
        } finally {
            setLoading(false);
        }
    }, [activeTab, search, authenticated, navigate]);

    useEffect(() => {
        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    async function handleExport() {
        setExporting(true);
        try {
            const params = search ? `?search=${encodeURIComponent(search)}` : '';
            const res = await axios.get(`/api/admin/export${params}`, {
                responseType: 'blob',
                withCredentials: true,
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Indotech_Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    }

    async function handleLogout() {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
        } catch { }
        navigate('/internal');
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Checking authentication...</div>
            </div>
        );
    }

    const columns = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id') : [];
    const currentTab = TABS.find(t => t.id === activeTab);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen p-4 md:p-6"
        >
            {/* Top Bar */}
            <div className="glass-card p-4 mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>INDOTECH</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Dashboard</p>
                    </div>
                </div>

                {/* Global Search */}
                <div className="flex-1 w-full md:max-w-lg relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Search</span>
                    <input
                        type="text"
                        className="neon-input pl-10"
                        placeholder="Search by W.O No, Serial No, Name, Project..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm"
                    >
                        Home
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="neon-btn flex items-center gap-2 text-sm py-2 px-4"
                    >
                        {exporting ? 'Exporting...' : 'Export Excel'}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'tab-active'
                            : 'border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                            }`}
                        style={activeTab === tab.id ? { borderColor: tab.color, color: tab.color, boxShadow: `0 0 15px ${tab.color}33` } : {}}
                    >
                        <span>{tab.label}</span>
                        {activeTab === tab.id && data.length > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs" style={{ background: tab.color + '22' }}>
                                {data.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-gray-400 flex items-center gap-3">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                                </svg>
                                Loading data...
                            </div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="text-4xl mb-3 opacity-30">—</div>
                            <p className="text-gray-500">No records found</p>
                            {search && <p className="text-gray-600 text-sm mt-1">Try adjusting your search query</p>}
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    {columns.map(col => (
                                        <th key={col}>{COLUMN_LABELS[col] || col.replace(/_/g, ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {data.map((row, i) => (
                                        <motion.tr
                                            key={row.id || i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                        >
                                            <td className="text-center text-gray-500">{i + 1}</td>
                                            {columns.map(col => (
                                                <td key={col}>
                                                    {col === 'work_order_no' ? (
                                                        <span className="font-mono font-semibold" style={{ color: currentTab?.color }}>
                                                            {row[col]}
                                                        </span>
                                                    ) : (
                                                        row[col] ?? '—'
                                                    )}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>

                {data.length > 0 && (
                    <div className="border-t border-gray-800 px-4 py-3 flex justify-between items-center text-xs text-gray-500">
                        <span>Showing {data.length} record{data.length !== 1 ? 's' : ''}</span>
                        <span>{currentTab?.label}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
