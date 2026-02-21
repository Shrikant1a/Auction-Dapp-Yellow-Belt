import { motion } from "framer-motion";
import { Zap, ShieldCheck, ChevronRight, Award, ExternalLink } from "lucide-react";

export default function AuctionShowcase() {
    return (
        <section className="lg:col-span-7 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[4/5] glass overflow-hidden rounded-[2.5rem] border-white/10 group"
            >
                {/* Product Visual */}
                <div className="absolute inset-0 flex items-center justify-center scale-110 group-hover:scale-125 transition-transform duration-[3s]">
                    <div className="w-[500px] h-[500px] bg-gold/10 blur-[150px] absolute animate-pulse" />

                    {/* 3D-like CSS Artifact */}
                    <motion.div
                        animate={{
                            rotateY: [0, 360],
                            translateY: [0, -20, 0]
                        }}
                        transition={{
                            rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                            translateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative z-10 perspective-1000"
                    >
                        <div className="w-56 h-56 relative preserve-3d">
                            <div className="absolute inset-0 border-[6px] border-gold rounded-full blur-sm opacity-50" />
                            <div className="absolute inset-4 border-[2px] border-white/30 rounded-full animate-spin-slow" />
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold via-black to-gold/20 rounded-full shadow-[0_0_100px_rgba(251,191,36,0.4)]">
                                <Zap className="text-gold w-24 h-24 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" fill="currentColor" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-8 left-8 flex space-x-3">
                    <span className="bg-gold text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">Genesis Drop</span>
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10">1 of 1</span>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-2">
                        <h2 className="text-5xl font-black tracking-tight leading-none uppercase">The Prime<br /><span className="text-gold">Singularity</span></h2>
                        <div className="flex items-center space-x-2 text-white/40 text-sm font-medium">
                            <ShieldCheck size={14} className="text-gold" />
                            <span>On-chain Authenticated via Soroban</span>
                            <a
                                href="https://stellar.expert/explorer/testnet/contract/CDGC73EHRGV7GUYDTZ7UCLREY7NDBB7AI75Q7NFPO7Q24RAZYLS6SI6NO"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono ml-2 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all"
                            >
                                ID: CDGC...I6NO
                            </a>
                            <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass p-10 space-y-6 rounded-[2rem]"
            >
                <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Award className="text-gold" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Provenance & History</h3>
                        <p className="text-white/40 text-sm">Verified on Stellar Testnet</p>
                    </div>
                    <a
                        href="https://stellar.expert/explorer/testnet/contract/CDGC73EHRGV7GUYDTZ7UCLREY7NDBB7AI75Q7NFPO7Q24RAZYLS6SI6NO"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-white/20 hover:text-gold transition-colors"
                    >
                        <ExternalLink size={20} />
                    </a>
                </div>
                <p className="text-white/60 leading-relaxed text-lg font-light">
                    A masterpiece of deterministic logic. This artifact represents the first successful
                    execution of the AuraAuction protocol. It tracks its own history within its metadata,
                    making it a living record of the auction's intensity.
                </p>
            </motion.div>
        </section>
    );
}
