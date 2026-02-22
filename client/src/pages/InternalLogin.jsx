import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function InternalLogin() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // login | request-otp | verify-otp | reset
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/login', { username, password }, { withCredentials: true });
            navigate('/internal/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    }

    async function handleRequestOTP(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/auth/request-otp', { username });
            setSuccess(res.data.message);
            setMode('verify-otp');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOTP(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/verify-otp', { username, otp });
            setSuccess('OTP verified! Set your new password.');
            setMode('reset');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/reset-password', { username, newPassword });
            setSuccess('Password reset successfully! You can now login.');
            setMode('login');
            setPassword('');
            setNewPassword('');
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed.');
        } finally {
            setLoading(false);
        }
    }

    function renderForm() {
        switch (mode) {
            case 'request-otp':
                return (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <p className="text-sm text-gray-400 mb-4">Enter your admin username to receive a password reset OTP.</p>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
                            <input className="neon-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
                        </div>
                        <button type="submit" disabled={loading} className="neon-btn w-full mt-4">
                            {loading ? 'Sending OTP...' : '📧 Send OTP'}
                        </button>
                        <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-2">
                            ← Back to Login
                        </button>
                    </form>
                );

            case 'verify-otp':
                return (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <p className="text-sm text-gray-400 mb-4">Enter the 6-digit OTP sent to the registered email.</p>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">OTP Code</label>
                            <input className="neon-input text-center text-2xl tracking-[0.5em]" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} required style={{ letterSpacing: '0.5em' }} />
                        </div>
                        <button type="submit" disabled={loading} className="neon-btn w-full mt-4">
                            {loading ? 'Verifying...' : '✓ Verify OTP'}
                        </button>
                        <button type="button" onClick={() => { setMode('request-otp'); setError(''); }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-2">
                            ← Resend OTP
                        </button>
                    </form>
                );

            case 'reset':
                return (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <p className="text-sm text-gray-400 mb-4">Set your new password (minimum 6 characters).</p>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">New Password</label>
                            <input type="password" className="neon-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" minLength={6} required />
                        </div>
                        <button type="submit" disabled={loading} className="neon-btn w-full mt-4">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                );

            default:
                return (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
                            <input className="neon-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                            <input type="password" className="neon-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                        </div>
                        <button type="submit" disabled={loading} className="neon-btn w-full mt-4">
                            {loading ? 'Logging in...' : '🔐 Login'}
                        </button>
                        <button type="button" onClick={() => { setMode('request-otp'); setError(''); setSuccess(''); }} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-2">
                            Forgot Password?
                        </button>
                    </form>
                );
        }
    }

    const titles = {
        login: 'Admin Login',
        'request-otp': 'Reset Password',
        'verify-otp': 'Verify OTP',
        reset: 'New Password',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="glass-card w-full max-w-md p-8"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>&#x2588;</div>
                    <h1 className="text-2xl font-bold" style={{ color: '#00d4ff' }}>{titles[mode]}</h1>
                    <p className="text-xs text-gray-500 tracking-wider uppercase mt-1">Indotech Transformers — Internal Portal</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-6" />

                {/* Messages */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div key="error" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 overflow-hidden">
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div key="success" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 p-3 rounded-lg border border-green-500/20 bg-green-500/5 overflow-hidden">
                            <p className="text-green-400 text-sm">{success}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderForm()}
            </motion.div>
        </motion.div>
    );
}
