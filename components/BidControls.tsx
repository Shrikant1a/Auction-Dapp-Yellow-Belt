import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Award, PlusCircle } from "lucide-react";

interface BidControlsProps {
    isEnded: boolean;
    isOutbid: boolean;
    highestBid: number;
    timeLeft: number;
    bidAmount: string;
    setBidAmount: (value: string) => void;
    onBid: () => void;
    formatTime: (seconds: number) => string;
    winner: string;
}

export default function BidControls({
    isEnded,
    isOutbid,
    highestBid,
    timeLeft,
    bidAmount,
    setBidAmount,
    onBid,
    formatTime,
    winner
}: BidControlsProps) {
    return (
        <section className="lg:col-span-5 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    boxShadow: isOutbid ? '0 0 80px rgba(234, 88, 12, 0.3)' : '0 0 0px rgba(0,0,0,0)'
                }}
                transition={{
                    boxShadow: { duration: 0.5, repeat: isOutbid ? Infinity : 0, repeatType: 'reverse' }
                }}
                className={`glass p-10 space-y-10 rounded-[2.5rem] relative overflow-hidden transition-colors duration-500 ${isOutbid ? 'border-orange-500/50 bg-orange-950/10' : 'border-orange-primary/20'}`}
            >
                <div className={`absolute top-[-50px] right-[-50px] w-64 h-64 blur-[80px] rounded-full transition-colors ${isOutbid ? 'bg-orange-600/10' : 'bg-orange-primary/5'}`} />

                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <span className="text-xs text-white/40 uppercase tracking-[0.3em] font-black">
                            {isEnded ? "Final Status" : isOutbid ? "⚠️ Status Alert" : "Time Remaining"}
                        </span>
                        <div className="flex items-baseline space-x-3">
                            <span className="text-6xl font-black tracking-tighter text-white">
                                {isEnded ? highestBid : formatTime(timeLeft)}
                            </span>
                            <span className={`text-xl font-bold uppercase tracking-widest ${isOutbid ? 'text-orange-500 animate-pulse' : 'text-orange-primary'}`}>
                                {isEnded ? "SOLD" : isOutbid ? "OUTBID" : "LEFT"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Your Position Indicator */}
                {!isEnded && (
                    <div className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 ${!winner ? 'bg-white/5 border-white/5 text-white/40' :
                        winner === "YOU" || winner === "GDSB...7K3W" ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' :
                            'bg-orange-600/10 border-orange-500/30 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.1)]'
                        }`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${!winner ? 'bg-white/10' :
                                winner === "YOU" || winner === "GDSB...7K3W" ? 'bg-green-500/20' :
                                    'bg-orange-500/20'
                                }`}>
                                {!winner ? <Award size={16} /> : winner === "YOU" || winner === "GDSB...7K3W" ? <Award size={16} /> : <TrendingDown size={16} />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Position</p>
                                <p className="font-black text-xs uppercase tracking-tight">
                                    {!winner ? "N/A - CONNECT TO BID" : winner === "YOU" || winner === "GDSB...7K3W" ? "Leading - Highest Bidder" : "Outbid - Losing Position"}
                                </p>
                            </div>
                        </div>
                        {winner && winner !== "YOU" && winner !== "GDSB...7K3W" && (
                            <div className="text-[10px] font-black bg-orange-500/20 px-2 py-1 rounded-md uppercase tracking-tighter animate-pulse">
                                ACTION REQUIRED
                            </div>
                        )}
                    </div>
                )}

                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-8">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Highest Bid</span>
                        <div className="flex items-center space-x-2">
                            {isOutbid ? <TrendingDown size={14} className="text-orange-500" /> : <TrendingUp size={14} className="text-green-500" />}
                            <span className={`text-2xl font-black ${isOutbid ? 'text-orange-500' : 'text-orange-primary'}`}>{highestBid} XLM</span>
                        </div>
                    </div>

                    {!isEnded && (
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    suppressHydrationWarning
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder={`Min. ${highestBid + 10} XLM`}
                                    className={`w-full bg-black/50 border-2 rounded-2xl px-6 py-5 outline-none transition-all font-black text-2xl placeholder:text-white/10 ${isOutbid ? 'border-orange-500/50 focus:border-orange-500' : 'border-white/10 focus:border-orange-primary'}`}
                                />
                                <motion.button
                                    suppressHydrationWarning
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onBid}
                                    className={`w-full mt-4 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center space-x-3 ${isOutbid ? 'bg-orange-600 text-white shadow-[0_20px_40px_rgba(234,88,12,0.3)]' : 'bg-orange-primary text-black shadow-[0_20px_40px_rgba(255,159,10,0.2)]'}`}
                                >
                                    {isOutbid ? <Zap size={24} fill="currentColor" className="animate-pulse" /> : <Zap size={24} fill="currentColor" />}
                                    <span>{isOutbid ? "Outbid - Reclaim Now" : "Place Bid Now"}</span>
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {isEnded && (
                        <div className="space-y-4">
                            <div className="bg-orange-primary/10 border border-orange-primary/20 p-6 rounded-2xl text-center">
                                <Award className="mx-auto text-orange-primary mb-3" size={32} />
                                <h4 className="font-black text-orange-primary text-xl uppercase tracking-tighter">Auction Concluded</h4>
                                <p className="text-white/60 text-sm mt-1">Winner: {winner}</p>
                            </div>
                            <button
                                onClick={() => (window as any).openCreateAuction?.()}
                                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                            >
                                <PlusCircle className="text-orange-primary" size={20} />
                                <span>Launch New Auction</span>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
