export default function Footer() {
    return (
        <footer className="pt-20 pb-10 border-t border-white/5 text-center space-y-6">
            <div className="flex justify-center space-x-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <span className="font-black tracking-tighter text-2xl">STELLAR</span>
                <span className="font-black tracking-tighter text-2xl">SOROBAN</span>
                <span className="font-black tracking-tighter text-2xl">AURA</span>
            </div>
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em]">Designed by Shrii &bull; 2026</p>
        </footer>
    );
}
