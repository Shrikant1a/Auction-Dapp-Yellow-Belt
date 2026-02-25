'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms';
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const content = {
        privacy: {
            title: 'Privacy Policy',
            sections: [
                {
                    heading: '1. Information We Collect',
                    text: 'We collect information you provide directly to us when using the Supercar Auction platform, including wallet addresses, transaction history on the Stellar network, and any communication you have with our support team.'
                },
                {
                    heading: '2. How We Use Information',
                    text: 'The information we collect is used to facilitate the auction process, ensure the security of transactions, and improve our services. We do not sell your personal data to third parties.'
                },
                {
                    heading: '3. Blockchain Data',
                    text: 'Please note that all bids and transactions are recorded on the public Stellar blockchain. This data is permanent and accessible to anyone with network access.'
                },
                {
                    heading: '4. Security',
                    text: 'We implement industry-standard security measures to protect your information, but no method of transmission over the internet or electronic storage is 100% secure.'
                }
            ]
        },
        terms: {
            title: 'Terms of Use',
            sections: [
                {
                    heading: '1. Eligibility',
                    text: 'By using this platform, you represent that you are at least 18 years old and have the legal capacity to enter into binding contracts.'
                },
                {
                    heading: '2. Bidding Rules',
                    text: 'All bids placed are final and binding. Once a bid is recorded on the blockchain, it cannot be retracted. Ensure you have sufficient funds in your wallet before bidding.'
                },
                {
                    heading: '3. Platform Fees',
                    text: 'A small transaction fee may be applied to each bid to cover network costs. These fees are transparent and shown at the time of transaction.'
                },
                {
                    heading: '4. Limitation of Liability',
                    text: 'We are not responsible for any losses resulting from network congestion, smart contract vulnerabilities, or user error in managing private keys.'
                }
            ]
        }
    };

    const activeContent = content[type];

    if (!mounted) return null;

    const modal = (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#1A1A1A] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-default"
                    >
                        <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-white/5">
                            <h2 className="text-2xl font-bold text-white">{activeContent.title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                {activeContent.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-lg font-semibold text-orange-primary">{section.heading}</h3>
                                        <p className="text-gray-400 leading-relaxed italic border-l-2 border-orange-primary/20 pl-4">
                                            {section.text}
                                        </p>
                                    </div>
                                ))}

                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-xs text-gray-500 text-center italic">
                                        Last updated: February 24, 2026. This is a demonstration for the Auction DApp.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="w-full md:w-auto px-10 py-4 bg-orange-primary hover:bg-orange-secondary text-black font-bold rounded-2xl transition-all shadow-[0_4_15px_rgba(255,159,10,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                            >
                                I Understand
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modal, document.body);
}
