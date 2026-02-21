"use client";

import { useState, useEffect } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

// Extracted Components
import Navbar from "@/components/Navbar";
import StatusMessages from "@/components/StatusMessages";
import AuctionShowcase from "@/components/AuctionShowcase";
import BidControls from "@/components/BidControls";
import BidHistory from "@/components/BidHistory";
import Footer from "@/components/Footer";

import { placeBidOnChain, getRecentEvents } from "@/app/lib/stellar";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [highestBid, setHighestBid] = useState(1250);
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [isOutbid, setIsOutbid] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [history, setHistory] = useState([
    { id: 1, bidder: "GDRA...4K2V", amount: 1200, time: "2m ago", timestamp: Date.now() - 120000, rank: 1 },
    { id: 2, bidder: "GBV3...R8O9", amount: 1150, time: "15m ago", timestamp: Date.now() - 900000, rank: 2 },
    { id: 3, bidder: "GAX7...L1P4", amount: 1000, time: "1h ago", timestamp: Date.now() - 3600000, rank: 3 },
  ]);

  // Audio Cues for Outbid
  useEffect(() => {
    if (isOutbid && typeof window !== 'undefined') {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // High slide

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    }
  }, [isOutbid]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsEnded(true);
    }
  }, [timeLeft]);

  // REAL-TIME EVENT INTEGRATION
  useEffect(() => {
    const pollEvents = async () => {
      try {
        const events = await getRecentEvents();
        if (events && events.length > 0) {
          // Update local state based on on-chain events
          const latestBidEvent = events.find(e => e.type === 'contract' && (e as any).topics?.[0] === 'bid');
          if (latestBidEvent) {
            // Extract bid data and update highestBid/history
            // (Simplified for demo, usually involves decoding ScVal)
          }
        }
      } catch (e) {
        console.error("Event polling error:", e);
      }
    };

    const interval = setInterval(pollEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBid = async () => {
    if (!address || !kit) {
      setError("Please connect your wallet first");
      return;
    }

    if (isEnded) {
      setError("Error: Auction has already expired. No more bids accepted.");
      return;
    }

    const amount = parseInt(bidAmount);
    if (!amount || amount < highestBid + 10) {
      setError(`Invalid Bid: Minimum bid is ${highestBid + 10} XLM`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxStatus("Requesting Signature...");

    try {
      // ACTUAL ON-CHAIN CALL
      const txHash = await placeBidOnChain(
        address,
        amount,
        async (xdr: string) => {
          const { signedTxXdr } = await kit.signTransaction(xdr);
          return signedTxXdr;
        }
      );

      setTxStatus("Transaction Broadcasted...");

      // Update local UI immediately for responsiveness
      setIsOutbid(false);
      setHighestBid(amount);
      const newBid = {
        id: Date.now(),
        bidder: address,
        amount,
        time: "Just now",
        timestamp: Date.now(),
        rank: 1
      };

      setHistory(prev => [newBid, ...prev.map(b => ({ ...b, rank: b.rank + 1 }))]);
      setBidAmount("");
      setTxStatus(`Confirmed (Hash: ${txHash.slice(0, 8)}...)`);

      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: any) {
      setTxStatus(null);
      setError(`Transaction Failed: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-gold selection:text-black">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <Navbar
          address={address}
          setAddress={setAddress}
          setKit={setKit}
          setWalletName={setWalletName}
        />

        <StatusMessages error={error} txStatus={txStatus} isOutbid={isOutbid} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <AuctionShowcase />

          <div className="lg:col-span-5 space-y-8">
            <BidControls
              isEnded={isEnded}
              isOutbid={isOutbid}
              highestBid={highestBid}
              timeLeft={timeLeft}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              onBid={handleBid}
              formatTime={formatTime}
              winner={history[0]?.bidder === address ? "YOU" : history[0]?.bidder}
            />

            <BidHistory
              history={history}
              isExpanded={isHistoryExpanded}
              onToggleExpand={() => setIsHistoryExpanded(!isHistoryExpanded)}
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
