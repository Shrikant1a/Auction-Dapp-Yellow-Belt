import { motion } from "framer-motion";
import { ShoppingCart, Bell, ArrowRight, Car } from "lucide-react";
import WalletConnect from "./WalletConnectModal";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

interface NavbarProps {
    address: string | null;
    setAddress: (address: string | null) => void;
    setKit: (kit: StellarWalletsKit | null) => void;
    setWalletName: (name: string | null) => void;
}

export default function Navbar({ address, setAddress, setKit, setWalletName }: NavbarProps) {
    const navLinks = [
        { name: "Dashboard", id: "live-auctions", active: true },
        { name: "Catalog", id: "live-auctions", active: false },
        { name: "Membership", id: "learn-more", active: false },
        { name: "Buy NIPL", id: "live-auctions", active: false },
        { name: "FAQ's", id: "faq", active: false },
        { name: "Contact Us", id: "faq", active: false },
    ];

    return (
        <nav className="flex justify-between items-center py-6 px-4 md:px-0">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
            >
                <div className="bg-orange-primary p-1.5 rounded-lg">
                    <Car className="text-black" size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight">Ease<span className="text-gray-400 font-medium">Auction</span></span>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={`#${link.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`text-sm font-medium transition-colors ${link.active ? "text-orange-primary" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-6"
            >
                <div className="flex items-center space-x-4 text-gray-400">
                    <button className="hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                    </button>
                    <button className="hover:text-white transition-colors">
                        <Bell size={20} />
                    </button>
                </div>

                {address ? (
                    <div className="bg-orange-primary/10 border border-orange-primary/20 px-4 py-2 rounded-full flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-primary rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-orange-primary">
                            {address.slice(0, 4)}...{address.slice(-4)}
                        </span>
                    </div>
                ) : (
                    <WalletConnect
                        setAddress={setAddress}
                        setKit={setKit}
                        setWalletName={setWalletName}
                        className="bg-orange-primary hover:bg-orange-secondary text-black px-6 py-2.5 rounded-full text-sm font-bold flex items-center space-x-2 transition-all group"
                    >
                        <span>Get Started Now</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </WalletConnect>
                )}
            </motion.div>
        </nav>
    );
}

