import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowUpRight, Clock, Award, History } from "lucide-react";

import { Bid } from "./BidHistory";


interface UserActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: Bid[];
    address: string | null;
}



export default function UserActivityModal({ isOpen, onClose, history, address }: UserActivityModalProps) {
    const userBids = history.filter(bid => bid.bidder === address);
    const isWinner = history.length > 0 && history[0]?.bidder === address;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-dark-bg/50 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden glass"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-primary/20 p-3 rounded-2xl">
                                        <ShoppingBag className="text-orange-primary" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight uppercase">Your Activity</h2>
                                        <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Immutable Ledger Record</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {!address ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                        <History className="text-white/20" size={32} />
                                    </div>
                                    <p className="text-white/60 font-medium">Connect your wallet to view your activity</p>
                                </div>
                            ) : userBids.length === 0 ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                        <ShoppingBag className="text-white/20" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-white/60 font-medium">No activity yet</p>
                                        <p className="text-white/30 text-xs mt-1">Place your first bid to see it here!</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                                            <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">Total Bids</p>
                                            <p className="text-2xl font-black text-white">{userBids.length}</p>
                                        </div>
                                        <div className="bg-orange-primary/10 border border-orange-primary/20 p-4 rounded-3xl">
                                            <p className="text-[10px] text-orange-primary/60 font-bold tracking-widest uppercase mb-1">Status</p>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${isWinner ? 'bg-green-500 animate-pulse' : 'bg-orange-primary'}`} />
                                                <p className="text-lg font-black text-orange-primary uppercase">{isWinner ? 'Winning' : 'Outbid'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bid List */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase px-2">Recent Bids</p>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {userBids.map((bid, idx) => (
                                                <div
                                                    key={`user-bid-${bid.id}-${idx}`}
                                                    className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${bid.rank === 1 ? 'bg-orange-primary text-black' : 'bg-white/10 text-white/40'}`}>
                                                            #{bid.rank}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-sm font-black text-white">{bid.amount} XLM</p>
                                                                {bid.rank === 1 && <Award size={12} className="text-orange-primary" />}
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-[10px] text-white/30 font-bold">
                                                                <Clock size={10} />
                                                                <span>{bid.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {bid.txHash && (
                                                        <button
                                                            onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${bid.txHash}`, '_blank')}
                                                            className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-primary hover:text-black"
                                                        >
                                                            <ArrowUpRight size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="w-full bg-orange-primary text-black font-black py-4 rounded-2xl hover:bg-orange-secondary transition-all uppercase tracking-tight"
                                >
                                    Dismiss Record
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
