import { motion } from "framer-motion";
import { ShoppingCart, Bell, ArrowRight, Car, PlusCircle } from "lucide-react";
import WalletConnect from "./WalletConnectModal";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

interface NavbarProps {
    address: string | null;
    setAddress: (address: string | null) => void;
    setKit: (kit: StellarWalletsKit | null) => void;
    setWalletName: (name: string | null) => void;
    onCartClick: () => void;
    onNotificationClick: () => void;
    hasUnread: boolean;
}

export default function Navbar({ address, setAddress, setKit, setWalletName, onCartClick, onNotificationClick, hasUnread }: NavbarProps) {
    const navLinks = [
        { name: "Dashboard", id: "live-auctions", active: true },
        { name: "Catalog", id: "search-section", active: false },
        { name: "Membership", id: "membership", active: false },
        { name: "Buy NIPL", id: "buy-nipl", active: false },
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
                <button
                    suppressHydrationWarning
                    onClick={() => (window as typeof window & { openCreateAuction?: () => void }).openCreateAuction?.()}
                    className="hidden md:flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-all text-orange-primary"
                >
                    <PlusCircle size={16} />
                    <span>Create Listing</span>
                </button>

                <div className="flex items-center space-x-4 text-gray-400">
                    <button
                        suppressHydrationWarning
                        onClick={onCartClick}
                        className="hover:text-white transition-colors"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        suppressHydrationWarning
                        onClick={onNotificationClick}
                        className="hover:text-white transition-colors relative"
                    >
                        <Bell size={20} />
                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-primary rounded-full animate-pulse" />
                        )}
                    </button>
                </div>

                {address ? (
                    <button
                        suppressHydrationWarning
                        onClick={() => {
                            setAddress(null);
                            setKit(null);
                            setWalletName(null);
                        }}
                        className="bg-orange-primary/10 border border-orange-primary/20 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-orange-primary/20 transition-all group"
                        title="Click to Disconnect"
                    >
                        <div className="w-2 h-2 bg-orange-primary rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-orange-primary">
                            {address.slice(0, 4)}...{address.slice(-4)}
                        </span>
                        <span className="text-[10px] text-orange-primary/50 font-bold uppercase ml-2 hidden group-hover:inline">Disconnect</span>
                    </button>
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

