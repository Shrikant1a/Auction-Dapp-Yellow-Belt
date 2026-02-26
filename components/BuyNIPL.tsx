import { motion } from "framer-motion";
import { Coins, ArrowRight, Zap, Target } from "lucide-react";

export default function BuyNIPL() {
    return (
        <section id="buy-nipl" className="py-20 bg-orange-primary/5 border border-orange-primary/10 rounded-[40px] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <Coins size={200} className="text-orange-primary" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <span className="bg-orange-primary/20 text-orange-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Platform Utility Token</span>
                    <h2 className="text-5xl font-black leading-tight">Secure Your <span className="text-orange-primary">$NIPL</span> Tokens</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        The NIPL token is the core of the EaseAuction ecosystem. Use it for bidding, governance, and exclusive access to the world's most rare supercars.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <Zap size={20} className="text-orange-primary" />
                            <span className="text-sm font-bold">Fast Transactions</span>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <Target size={20} className="text-orange-primary" />
                            <span className="text-sm font-bold">Low Gas Fees</span>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card/60 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Current Price</p>
                            <p className="text-3xl font-black">1 XLM = 10 NIPL</p>
                        </div>
                        <p className="text-orange-primary text-xs font-black uppercase mb-1">Live Pre-sale</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                            <input type="number" placeholder="0.00" className="bg-transparent border-none outline-none text-2xl font-bold w-full" />
                            <span className="font-black text-gray-500 ml-4 italic">XLM</span>
                        </div>
                        <div className="flex justify-center -my-2 relative z-20">
                            <div className="bg-orange-primary p-2 rounded-lg text-black">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                            <input type="number" placeholder="0" className="bg-transparent border-none outline-none text-2xl font-bold w-full" readOnly />
                            <span className="font-black text-orange-primary ml-4 italic">NIPL</span>
                        </div>
                    </div>

                    <button className="w-full bg-orange-primary hover:bg-orange-secondary text-black py-5 rounded-3xl font-black uppercase tracking-tighter transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,159,10,0.2)]">
                        Swap Now
                    </button>
                </div>
            </div>
        </section>
    );
}
