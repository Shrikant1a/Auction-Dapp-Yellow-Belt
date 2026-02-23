import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp, Trophy, Globe, Lock } from "lucide-react";

const features = [
    {
        icon: <Zap className="text-orange-primary" size={32} />,
        title: "Real-time Bidding",
        description: "Experience lightning-fast bid updates using Stellar's high-performance network. No more manual refreshing."
    },
    {
        icon: <Shield className="text-orange-primary" size={32} />,
        title: "Secured by Blockchain",
        description: "Every bid is transparently recorded on the Stellar ledger, ensuring absolute fairness and security for every participant."
    },
    {
        icon: <TrendingUp className="text-orange-primary" size={32} />,
        title: "Market Insights",
        description: "Get detailed historical data and price trends for supercars to make more informed bidding decisions."
    },
    {
        icon: <Trophy className="text-orange-primary" size={32} />,
        title: "Exclusive Listings",
        description: "Access a curated collection of rare and high-performance supercars from verified sellers worldwide."
    },
    {
        icon: <Globe className="text-orange-primary" size={32} />,
        title: "Global Participation",
        description: "Connect your Stellar wallet and bid from anywhere in the world without worrying about currency conversions."
    },
    {
        icon: <Lock className="text-orange-primary" size={32} />,
        title: "Escrow Protection",
        description: "Funds are held in smart contracts and only released when the auction terms are successfully met."
    }
];

export default function Features() {
    return (
        <section id="learn-more" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-orange-primary font-bold uppercase tracking-wider text-sm"
                    >
                        Why Choose EaseAuction
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mt-4 mb-6"
                    >
                        Mastering the Art of <span className="text-orange-primary">Supercar Auctions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        We provide the most sophisticated platform for trading exotic vehicles using cutting-edge blockchain technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-orange-primary/30 transition-all group"
                        >
                            <div className="w-16 h-16 bg-orange-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-primary/20 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        </section>
    );
}
