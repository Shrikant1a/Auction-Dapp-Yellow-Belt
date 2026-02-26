import { motion } from "framer-motion";
import { Crown, Star, ShieldCheck, Gem } from "lucide-react";

const tiers = [
    {
        name: "Standard",
        price: "Free",
        features: ["Standard Bidding", "Real-time Updates", "2 Active Bids"],
        icon: <Star size={24} className="text-gray-400" />
    },
    {
        name: "Premium",
        price: "500 XLM",
        features: ["Priority Bidding", "Early Access", "Unlimited Bids", "Reduced Fees"],
        icon: <Crown size={24} className="text-orange-primary" />,
        highlight: true
    },
    {
        name: "VVIP",
        price: "2000 XLM",
        features: ["Concierge Support", "Private Auctions", "Verified Bidder Status", "Zero Trading Fees"],
        icon: <Gem size={24} className="text-purple-400" />
    }
];

export default function Membership() {
    return (
        <section id="membership" className="py-20 relative">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Elite <span className="text-orange-primary">Membership</span> Plans</h2>
                <div className="w-24 h-1 bg-orange-primary rounded-full mx-auto" />
                <p className="text-gray-400 mt-6 max-w-xl mx-auto">Elevate your auction experience with our premium membership tiers designed for serious collectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-8 rounded-[32px] border ${tier.highlight ? 'border-orange-primary/30 bg-orange-primary/5' : 'border-white/5 bg-white/5'} flex flex-col items-center text-center group`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${tier.highlight ? 'bg-orange-primary/20' : 'bg-white/10'}`}>
                            {tier.icon}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                        <p className="text-3xl font-black text-orange-primary mb-8">{tier.price}</p>
                        <ul className="space-y-4 mb-10 text-gray-400 text-sm flex-grow">
                            {tier.features.map(f => (
                                <li key={f} className="flex items-center space-x-2">
                                    <ShieldCheck size={16} className="text-orange-primary/60" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            suppressHydrationWarning
                            className={`w-full py-4 rounded-2xl font-bold transition-all ${tier.highlight ? 'bg-orange-primary text-black hover:bg-orange-secondary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            Choose {tier.name}
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
