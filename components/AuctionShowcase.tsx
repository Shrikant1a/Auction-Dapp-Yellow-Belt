import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, ChevronRight, Award, ExternalLink } from "lucide-react";

interface AuctionShowcaseProps {
    name: string;
    details: string;
    image: string;
}

export default function AuctionShowcase({ name, details, image }: AuctionShowcaseProps) {
    return (
        <section className="lg:col-span-7 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[4/5] glass overflow-hidden rounded-[2.5rem] border-white/10 group"
            >
                {/* Product Visual */}
                <div className="absolute inset-0 flex items-center justify-center bg-dark-card overflow-hidden">
                    <div className="w-[500px] h-[500px] bg-orange-primary/10 blur-[150px] absolute animate-pulse" />

                    <AnimatePresence mode="wait">
                        <motion.img
                            key={image}
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8 }}
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transform scale-125 group-hover:scale-135 transition-transform duration-[3s]"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
                </div>

                <div className="absolute top-8 left-8 flex space-x-3">
                    <span className="bg-orange-primary text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,159,10,0.4)]">Premium Listing</span>
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10">v8 twin-turbo</span>
                </div>

                <div className="absolute bottom-10 left-10 right-10">
                    <div className="space-y-2">
                        <motion.h2
                            key={name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black tracking-tight leading-none uppercase drop-shadow-lg"
                        >
                            {name.split(' ').length > 1 ? (
                                <>
                                    {name.split(' ')[0]}<br />
                                    <span className="text-orange-primary">{name.split(' ').slice(1).join(' ')}</span>
                                </>
                            ) : (
                                <span className="text-orange-primary">{name}</span>
                            )}
                        </motion.h2>
                        <div className="flex items-center space-x-2 text-white text-sm font-medium drop-shadow-md">
                            <ShieldCheck size={14} className="text-orange-primary" />
                            <span>Verified Supercar Asset via Stellar</span>
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
                        <Award className="text-orange-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Provenance & History</h3>
                        <p className="text-white/40 text-sm">Verified on Stellar Testnet</p>
                    </div>
                    <a
                        href="https://stellar.expert/explorer/testnet/contract/CAAKPRNXDAONVIK6QRTZDJRUIZ6EVHAXHVFBAG6VYVGI3EMF3VGBTAJD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-white/20 hover:text-orange-primary transition-colors"
                    >
                        <ExternalLink size={20} />
                    </a>
                </div>
                <motion.p
                    key={details}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/60 leading-relaxed text-lg font-light"
                >
                    {details}
                </motion.p>
            </motion.div>
        </section>
    );
}

