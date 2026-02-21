import { motion } from "framer-motion";
import { Gavel, Wallet } from "lucide-react";
import WalletConnect from "./WalletConnectModal";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

interface NavbarProps {
    address: string | null;
    setAddress: (address: string | null) => void;
    setKit: (kit: StellarWalletsKit) => void;
    setWalletName: (name: string) => void;
}

export default function Navbar({ address, setAddress, setKit, setWalletName }: NavbarProps) {
    return (
        <nav className="flex justify-between items-center glass px-8 py-5">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
            >
                <div className="bg-gold p-2 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                    <Gavel className="text-black" size={22} />
                </div>
                <h1 className="text-2xl font-black tracking-tighter">
                    AURA<span className="text-gold tracking-widest ml-1 font-light opacity-80">AUCTION</span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                {address ? (
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-bold">
                        <Wallet size={18} className="text-gold" />
                        <span className="text-sm tracking-tight">{address.slice(0, 4)}...{address.slice(-4)}</span>
                    </div>
                ) : (
                    <WalletConnect
                        setAddress={setAddress}
                        setKit={setKit}
                        setWalletName={setWalletName}
                        className="group flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-gold/50 px-6 py-3 rounded-2xl font-bold transition-all duration-500 hover:bg-gold hover:text-black"
                    >
                        <Wallet size={18} className="group-hover:rotate-12 transition-transform" />
                        <span>Connect Wallet</span>
                    </WalletConnect>
                )}
            </motion.div>
        </nav>
    );
}

