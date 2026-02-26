import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ExternalLink, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

export interface Notification {
    id: string;
    type: 'outbid' | 'success' | 'info' | 'bid';
    message: string;
    time: string;
    timestamp: number;
    read: boolean;
    txHash?: string;
}

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onClearAll: () => void;
}

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAsRead, onClearAll }: NotificationModalProps) {
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 md:p-8 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.95 }}
                        className="relative w-full max-w-sm bg-dark-bg/80 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden glass mt-16 pointer-events-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <Bell className="text-orange-primary" size={20} />
                                        {unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <h2 className="text-lg font-black tracking-tight uppercase">Alerts</h2>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={onClearAll}
                                            className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors mr-2"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-white/50 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                                            <Bell className="text-white/10" size={24} />
                                        </div>
                                        <p className="text-white/40 text-sm font-medium">No alerts yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notification, idx) => (
                                        <motion.div
                                            key={`${notification.id}-${idx}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onMouseEnter={() => !notification.read && onMarkAsRead(notification.id)}
                                            className={`relative flex items-start space-x-4 p-4 rounded-2xl transition-all border ${notification.read ? 'bg-white/5 border-transparent opacity-60' : 'bg-orange-primary/10 border-orange-primary/20'}`}
                                        >
                                            <div className={`p-2 rounded-lg ${notification.type === 'outbid' ? 'bg-red-500/20 text-red-500' :
                                                notification.type === 'success' ? 'bg-green-500/20 text-green-500' :
                                                    notification.type === 'bid' ? 'bg-orange-primary/20 text-orange-primary' :
                                                        'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {notification.type === 'outbid' ? <AlertCircle size={14} /> :
                                                    notification.type === 'success' ? <CheckCircle2 size={14} /> :
                                                        notification.type === 'bid' ? <Zap size={14} /> :
                                                            <Bell size={14} />}
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs font-bold leading-relaxed">{notification.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{notification.time}</span>
                                                    {notification.txHash && (
                                                        <button
                                                            onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${notification.txHash}`, '_blank')}
                                                            className="text-orange-primary hover:text-white transition-colors"
                                                        >
                                                            <ExternalLink size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {!notification.read && (
                                                <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-orange-primary rounded-full" />
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-center text-white/20 font-bold tracking-widest uppercase">
                                    Real-time Stellar Mesh Network
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
