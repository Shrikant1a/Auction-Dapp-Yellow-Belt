import { Search, ChevronDown, ShieldCheck, Zap, Tag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import LegalModal from "./LegalModal";

interface FilterOption {
    label: string;
    options: string[];
}

const filterData: FilterOption[] = [
    { label: 'Brand', options: ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Aston Martin', 'Bugatti', 'Koenigsegg', 'Pagani', 'Rimac'] },
    { label: 'Year', options: ['2024', '2023', '2022', '2021', '2020', 'Pre-2020'] },
    { label: 'Model', options: ['488 Pista', 'SF90', 'Aventador', 'Revuelto', '911 GT3', 'Mission X', '720S', 'Artura', 'DBS V12', 'Valkyrie', 'Chiron', 'Mistral', 'Jesko', 'Utopia', 'Nevera'] },
    { label: 'Type', options: ['Coupe', 'Convertible', 'Spider', 'Track Only', 'Hypercar'] },
    { label: 'Transmission', options: ['Automatic', 'Manual', 'Paddleshift', 'Single Speed'] },
    { label: 'Location', options: ['Global Delivery', 'Europe', 'North America', 'Middle East', 'Asia'] },
];

interface SearchSectionProps {
    onSearch?: (filters: { searchTerm: string; activeFilters: Record<string, string> }) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const openLegal = (type: 'privacy' | 'terms') => {
        setLegalType(type);
        setIsLegalModalOpen(true);
    };

    const handleFilterSelect = (label: string, option: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [label]: prev[label] === option ? "" : option
        }));
        setOpenDropdown(null);
    };

    const handleSearch = () => {
        onSearch?.({ searchTerm, activeFilters });
        // Smooth scroll to auctions
        document.getElementById('live-auctions')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                id="search-section"
                className="w-full bg-dark-card/60 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 mt-[-40px] z-20 relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold">Unit Category</h2>
                    <p className="text-xs text-gray-500">
                        By continuing, I agree to the <span
                            onClick={() => openLegal('privacy')}
                            className="text-orange-primary underline cursor-pointer hover:text-orange-secondary transition-colors font-bold"
                        >Privacy Policy</span> & <span
                            onClick={() => openLegal('terms')}
                            className="text-orange-primary underline cursor-pointer hover:text-orange-secondary transition-colors font-bold"
                        >Terms of Use</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8" ref={dropdownRef}>
                    <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-2 focus-within:border-orange-primary/50 transition-colors">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search your dreams car"
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-500"
                        />
                    </div>

                    {filterData.map((filter) => (
                        <div key={filter.label} className="relative">
                            <div
                                onClick={() => setOpenDropdown(openDropdown === filter.label ? null : filter.label)}
                                className={`h-full bg-white/5 border rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all ${activeFilters[filter.label] ? 'border-orange-primary/30 bg-orange-primary/5' : 'border-white/10'}`}
                            >
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">{filter.label}</span>
                                    <span className="text-sm text-white font-medium truncate w-full">
                                        {activeFilters[filter.label] || 'Select'}
                                    </span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-500 transition-transform ${openDropdown === filter.label ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {openDropdown === filter.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 py-2 max-h-[200px] overflow-y-auto custom-scrollbar"
                                    >
                                        {filter.options.map((option) => (
                                            <div
                                                key={option}
                                                onClick={() => handleFilterSelect(filter.label, option)}
                                                className="px-4 py-2.5 hover:bg-white/5 text-sm transition-colors flex justify-between items-center group cursor-pointer"
                                            >
                                                <span className={activeFilters[filter.label] === option ? "text-orange-primary font-bold" : "text-gray-400 group-hover:text-white"}>
                                                    {option}
                                                </span>
                                                {activeFilters[filter.label] === option && (
                                                    <Check size={14} className="text-orange-primary" />
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                        <div className="flex items-center space-x-2 text-orange-primary group">
                            <div className="bg-orange-primary/10 p-2 rounded-lg group-hover:bg-orange-primary/20 transition-colors">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safe & Trusted</span>
                        </div>
                        <div className="flex items-center space-x-2 text-orange-primary group">
                            <div className="bg-orange-primary/10 p-2 rounded-lg group-hover:bg-orange-primary/20 transition-colors">
                                <Zap size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Easy & Fast Process</span>
                        </div>
                        <div className="flex items-center space-x-2 text-orange-primary group">
                            <div className="bg-orange-primary/10 p-2 rounded-lg group-hover:bg-orange-primary/20 transition-colors">
                                <Tag size={18} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Best Offer</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full lg:w-auto bg-orange-primary hover:bg-orange-secondary text-black px-12 py-5 rounded-full font-black text-sm uppercase tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(255,159,10,0.3)] shadow-orange-primary/10"
                    >
                        Search My Unit
                    </button>
                </div>

                {/* Glossy overlay effect */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-orange-primary/5 to-transparent pointer-events-none" />
            </motion.div>

            <LegalModal
                isOpen={isLegalModalOpen}
                onClose={() => setIsLegalModalOpen(false)}
                type={legalType}
            />
        </>
    );
}
