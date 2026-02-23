import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-10 pb-20 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="max-w-xl z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-bold leading-tight mb-6"
                    >
                        Master Your Supercar <span className="text-white">Bids with Precision</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-400 mb-10 leading-relaxed"
                    >
                        Take control of your auctions with real-time insights, seamless tracking, and exclusive supercar listings—all in one powerful website.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-orange-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all"
                        >
                            Learn More
                        </button>
                        <button
                            onClick={() => document.getElementById('live-auctions')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-orange-primary hover:bg-orange-secondary text-black px-8 py-4 rounded-full font-bold flex items-center space-x-2 transition-all group"
                        >
                            <span>Start Bidding Now</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-0"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000"
                            alt="Orange Supercar"
                            className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(255,159,10,0.3)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
