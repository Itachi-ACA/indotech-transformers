import { motion } from 'framer-motion';

export default function SuccessOverlay({ countdown, message }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(5, 5, 5, 0.95)' }}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center"
            >
                {/* Animated Checkmark */}
                <div className="mx-auto mb-6" style={{ width: 80, height: 80 }}>
                    <svg viewBox="0 0 52 52" className="w-full h-full">
                        <circle
                            className="checkmark-circle"
                            cx="26" cy="26" r="24"
                        />
                        <path
                            className="checkmark-check"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            fill="none"
                        />
                    </svg>
                </div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-semibold mb-3"
                    style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Sora, Inter, sans-serif' }}
                >
                    {message || 'Data Saved Successfully'}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-500 mb-6"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    Redirecting to homepage in {countdown} seconds
                </motion.p>

                {/* Countdown ring */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mx-auto"
                    style={{ width: 50, height: 50 }}
                >
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                        <circle
                            cx="30" cy="30" r="26"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="2"
                        />
                        <circle
                            cx="30" cy="30" r="26"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.45)"
                            strokeWidth="2"
                            strokeDasharray={`${(countdown / 5) * 163.36} 163.36`}
                            strokeLinecap="round"
                            transform="rotate(-90 30 30)"
                            style={{ transition: 'stroke-dasharray 1s linear' }}
                        />
                        <text x="30" y="35" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="16" fontWeight="500">
                            {countdown}
                        </text>
                    </svg>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
