import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, ChevronUp, ChevronDown, Award, ShieldCheck } from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

interface Bid {
    id: number;
    bidder: string;
    amount: number;
    time: string;
    timestamp: number;
    rank: number;
}

interface BidHistoryProps {
    history: Bid[];
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export default function BidHistory({ history, isExpanded, onToggleExpand }: BidHistoryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass overflow-hidden rounded-[2.5rem]"
        >
            <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gold/10 p-2 rounded-xl">
                            <BarChart3 className="text-gold" size={20} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase">Bid Progression</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-white/30 font-bold tracking-widest">
                        <TrendingUp size={12} className="text-green-500" />
                        <span>UPWARDS MOMENTUM</span>
                    </div>
                </div>

                {/* Graph */}
                <div className="h-[200px] w-full bg-white/5 rounded-[1.5rem] p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[...history].reverse()}>
                            <defs>
                                <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fbbf24' }}
                            />
                            <Area
                                key="history-area"
                                type="monotone"
                                dataKey="amount"
                                stroke="#fbbf24"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorBid)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span>TRANSPARENT LEDGER</span>
                    </h3>
                    <button
                        suppressHydrationWarning
                        onClick={onToggleExpand}
                        className="flex items-center space-x-2 text-xs font-bold text-gold hover:opacity-80 transition-opacity"
                    >
                        <span>{isExpanded ? 'SHOW LESS' : 'VIEW ALL BIDS'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {history.slice(0, isExpanded ? history.length : 3).map((bid, idx) => (
                            <motion.div
                                key={`bid-${bid.id}-${idx}`}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className={`group relative flex items-center justify-between p-6 rounded-3xl transition-all border ${bid.rank === 1 ? 'bg-gold/10 border-gold/30 ring-1 ring-gold/20' : 'bg-white/5 border-white/5'}`}
                            >
                                {bid.rank === 1 && (
                                    <div className="absolute -top-3 left-6 bg-gold text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center space-x-2">
                                        <Award size={10} />
                                        <span>CURRENT WINNER</span>
                                    </div>
                                )}

                                <div className="flex items-center space-x-6">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border ${bid.rank === 1 ? 'bg-gold text-black border-gold' : 'bg-black/40 text-white/30 border-white/5'}`}>
                                        #{bid.rank}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm tracking-tight font-mono">{bid.bidder}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${bid.rank === 1 ? 'text-gold/60' : 'text-white/20'}`}>{bid.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black text-xl tracking-tighter ${bid.rank === 1 ? 'text-gold' : 'text-white'}`}>{bid.amount} XLM</p>
                                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white/20">VERIFIED</span>
                                        <ShieldCheck size={10} className="text-green-500/50" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
