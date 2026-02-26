'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Info, Camera, Image as ImageIcon, X } from 'lucide-react';

export interface AuctionFormData {
    name: string;
    startingPrice: number;
    duration: number;
    details: string;
    image: string;
}

interface CreateAuctionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AuctionFormData) => void;
}

export default function CreateAuctionModal({ isOpen, onClose, onSubmit }: CreateAuctionModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [details, setDetails] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                // In a real app, we'd upload to IPFS or a CDN
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-card border border-white/10 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
                <div className="p-8 border-b border-white/5 bg-white/5 shrink-0">
                    <div className="flex items-center space-x-3 mb-2 text-orange-primary">
                        <PlusCircle size={24} />
                        <h2 className="text-2xl font-bold text-white">List Your Supercar</h2>
                    </div>
                    <p className="text-gray-400 text-sm">Deploy a new auction smart contract on the Stellar network.</p>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Vehicle Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Lamborghini Huracán EVO"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-3.5 focus:border-orange-primary outline-none text-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Starting Price (XLM)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="100"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-3.5 focus:border-orange-primary outline-none text-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Duration (Hours)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="24"
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-3.5 focus:border-orange-primary outline-none text-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Add Photos</label>
                            <div className="grid grid-cols-1 gap-4">
                                {!previewImage ? (
                                    <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-orange-primary/50 hover:bg-orange-primary/5 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera className="w-8 h-8 text-gray-400 group-hover:text-orange-primary mb-2 transition-colors" />
                                            <p className="text-sm text-gray-400 group-hover:text-gray-300">Click to upload photo</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => { setPreviewImage(null); setImageUrl(''); }}
                                            className="absolute top-3 right-3 p-1.5 bg-black/60 rounded-full text-white hover:bg-orange-primary transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ImageIcon size={14} className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => { setImageUrl(e.target.value); setPreviewImage(e.target.value); }}
                                        placeholder="Or paste image URL..."
                                        className="w-full bg-black/30 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 focus:border-orange-primary outline-none text-white text-xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Asset Details (Optional)</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="VIN Number, History, Specs..."
                                className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-3.5 focus:border-orange-primary outline-none text-white h-24 resize-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-orange-primary/5 border border-orange-primary/10 p-4 rounded-2xl flex items-start space-x-3">
                        <Info className="text-orange-primary mt-0.5" size={16} />
                        <p className="text-[10px] text-gray-400 leading-tight">
                            By listing, you are initiating a smart contract deployment on the Stellar network. Ensure your wallet has sufficient XLM for the transaction fee and minimum reserve.
                        </p>
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/5 flex space-x-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSubmit({
                                name,
                                startingPrice: parseFloat(price),
                                duration: parseFloat(duration),
                                details,
                                image: imageUrl
                            });
                            onClose();
                        }}
                        disabled={!name || !price || !duration}
                        className="flex-[2] bg-orange-primary hover:bg-orange-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(255,159,10,0.3)]"
                    >
                        Launch Auction
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

