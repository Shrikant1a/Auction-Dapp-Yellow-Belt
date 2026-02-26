import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "How do I start bidding on supercars?",
        answer: "To start bidding, connect your Stellar wallet (like Freighter or Albedo) using the 'Connect Wallet' button. Once connected, ensure you have sufficient XLM in your wallet to cover your bid and transaction fees."
    },
    {
        question: "Is my bid refundable if I don't win?",
        answer: "Yes! Our smart contracts automatically return your bid amount if you are outbid by another user. Your funds are only locked if you are the current highest bidder."
    },
    {
        question: "How are vehicle deliveries handled?",
        answer: "After an auction ends, the winner and seller are provided with a secure communication channel. We partner with premium logistics companies to ensure white-glove delivery of your supercar."
    },
    {
        question: "What are the fees for using EaseAuction?",
        answer: "We charge a transparent 2.5% buyer's premium and a 1% seller's fee. These fees go towards maintaining the platform and ensuring the quality of our listings."
    },
    {
        question: "How does the blockchain ensure fairness?",
        answer: "Every bid is a timestamped transaction on the Stellar blockchain. This makes it impossible to manipulate the bidding history or 'snipe' auctions in a way that isn't transparent to all users."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 relative">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400">Everything you need to know about the EaseAuction platform.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-orange-primary/30"
                        >
                            <button
                                suppressHydrationWarning
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg">{faq.question}</span>
                                <div className="text-orange-primary">
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="px-6 pb-6 text-gray-400 leading-relaxed"
                                >
                                    {faq.answer}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
