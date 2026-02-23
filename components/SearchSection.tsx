import { Search, ChevronDown, ShieldCheck, Zap, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 mt-[-40px] z-20 relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Unit Category</h2>
                <p className="text-xs text-gray-500">
                    By continuing, I agree to the <span className="text-orange-primary underline cursor-pointer">Privacy Policy</span> & <span className="text-orange-primary underline cursor-pointer">Terms of Use</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-2">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search your dreams car"
                        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-500"
                    />
                </div>

                {['Brand', 'Year', 'Model', 'Type', 'Transmission', 'Location'].map((label) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-400 font-medium">{label}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2 text-orange-primary">
                        <ShieldCheck size={20} />
                        <span className="text-sm font-medium text-gray-300">Safe & Trusted</span>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-primary">
                        < Zap size={20} />
                        <span className="text-sm font-medium text-gray-300">Easy & Fast Process</span>
                    </div>
                    <div className="flex items-center space-x-2 text-orange-primary">
                        <Tag size={20} />
                        <span className="text-sm font-medium text-gray-300">Best Offer</span>
                    </div>
                </div>

                <button className="bg-orange-primary hover:bg-orange-secondary text-black px-10 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,159,10,0.2)]">
                    Search My Unit
                </button>
            </div>

            {/* Glossy overlay effect */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-orange-primary/5 to-transparent pointer-events-none" />
        </motion.div>
    );
}
