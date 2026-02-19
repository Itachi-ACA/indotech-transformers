import { motion } from 'framer-motion';

export default function SuccessOverlay({ countdown, message }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(10, 10, 15, 0.95)' }}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center"
            >
                {/* Animated Checkmark */}
                <div className="mx-auto mb-6" style={{ width: 100, height: 100 }}>
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
                    className="text-3xl font-bold mb-3"
                    style={{ color: '#00d4ff' }}
                >
                    {message || 'Data Saved Successfully!'}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-400 mb-6"
                >
                    Redirecting to homepage in {countdown} seconds...
                </motion.p>

                {/* Countdown ring */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mx-auto"
                    style={{ width: 60, height: 60 }}
                >
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                        <circle
                            cx="30" cy="30" r="26"
                            fill="none"
                            stroke="rgba(0, 212, 255, 0.2)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="30" cy="30" r="26"
                            fill="none"
                            stroke="#00d4ff"
                            strokeWidth="3"
                            strokeDasharray={`${(countdown / 5) * 163.36} 163.36`}
                            strokeLinecap="round"
                            transform="rotate(-90 30 30)"
                            style={{ transition: 'stroke-dasharray 1s linear' }}
                        />
                        <text x="30" y="35" textAnchor="middle" fill="#00d4ff" fontSize="18" fontWeight="bold">
                            {countdown}
                        </text>
                    </svg>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
