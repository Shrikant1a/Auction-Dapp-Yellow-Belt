import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Bell } from "lucide-react";

interface StatusMessagesProps {
    error: string | null;
    txStatus: string | null;
    isOutbid: boolean;
}

export default function StatusMessages({ error, txStatus, isOutbid }: StatusMessagesProps) {
    return (
        <>
            {/* Full Screen Flash Outbid Alert */}
            <AnimatePresence>
                {isOutbid && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, times: [0, 0.5, 1], repeat: 1 }}
                        className="fixed inset-0 z-[60] bg-orange-600 pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            <div className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 pointer-events-none px-4">
                <AnimatePresence>
                    {error ? (
                        <motion.div
                            key="error-status"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 pointer-events-auto mb-4 border border-red-400"
                        >
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <p className="font-bold">{error}</p>
                        </motion.div>
                    ) : null}
                    {txStatus ? (
                        <motion.div
                            key="tx-status"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gold text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 pointer-events-auto border border-white/20"
                        >
                            <div className="bg-black/10 p-1.5 rounded-full animate-spin">
                                <TrendingUp size={16} />
                            </div>
                            <p className="font-bold uppercase tracking-tight">{txStatus}</p>
                        </motion.div>
                    ) : null}
                    {isOutbid ? (
                        <motion.div
                            key="outbid-status"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                rotate: [0, -1, 1, -1, 1, 0]
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                                rotate: { duration: 0.4, repeat: Infinity, repeatDelay: 2 }
                            }}
                            className="bg-orange-600 text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_80px_rgba(234,88,12,0.6)] flex items-center space-x-4 pointer-events-auto border border-orange-400/50 backdrop-blur-xl"
                        >
                            <div className="bg-white/20 p-2 rounded-full animate-bounce">
                                <Bell size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="font-black text-lg tracking-tight leading-none uppercase">You've been outbid!</p>
                                <p className="text-white/60 text-xs font-bold mt-1 uppercase tracking-widest leading-none">Reclaim your lead instantly</p>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </>
    );
}
