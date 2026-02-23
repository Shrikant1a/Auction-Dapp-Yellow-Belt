"use client";

import { useState, useEffect } from "react";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

// Extracted Components
import Navbar from "@/components/Navbar";
import StatusMessages from "@/components/StatusMessages";
import AuctionShowcase from "@/components/AuctionShowcase";
import BidControls from "@/components/BidControls";
import BidHistory from "@/components/BidHistory";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

import { xdr, scValToNative } from "@stellar/stellar-sdk";
import { placeBidOnChain, getRecentEvents, getAuctionState } from "@/app/lib/stellar";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(86400); // Default to 24h
  const [highestBid, setHighestBid] = useState(100); // Default to starting price
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [isOutbid, setIsOutbid] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // Audio Cues for Outbid
  useEffect(() => {
    if (isOutbid && typeof window !== 'undefined') {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

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

  // INITIAL STATE FETCH
  useEffect(() => {
    const fetchState = async () => {
      try {
        const state = await getAuctionState();
        if (state) {
          console.log("Contract Sync Success:", state);
          setHighestBid(Number(state.highest_bid));
          const end = Number(state.end_time);
          const now = Math.floor(Date.now() / 1000);
          if (end > now) {
            setTimeLeft(end - now);
          } else {
            setTimeLeft(0);
            setIsEnded(true);
          }

          setHistory([{
            id: 0,
            bidder: state.highest_bidder,
            amount: Number(state.highest_bid),
            time: "Current",
            timestamp: Date.now(),
            rank: 1
          }]);
        }
      } catch (e) {
        console.error("Auction Sync Failed:", e);
      }
    };
    fetchState();
  }, [address]);

  // REAL-TIME EVENT INTEGRATION
  const [lastLedger, setLastLedger] = useState<number | undefined>(undefined);

  useEffect(() => {
    const pollEvents = async () => {
      try {
        const events = await getRecentEvents(lastLedger);
        if (events && events.length > 0) {
          const latestEvent = events[events.length - 1];
          setLastLedger(latestEvent.ledger + 1);

          const bidEvents = events.filter(e => {
            const topic = (e as any).topics?.[0];
            return e.type === 'contract' && (topic === 'bid' || topic === 'AAAABQAAAANiaWQAAAAA');
          });

          if (bidEvents.length > 0) {
            const state = await getAuctionState();
            if (state && state.highest_bid) {
              setHighestBid(Number(state.highest_bid));
              if (address && state.highest_bidder !== address) {
                setIsOutbid(true);
              }
              if (address && state.highest_bidder === address) {
                setIsOutbid(false);
              }

              // Append to history
              const newBids = bidEvents.map((e: any) => ({
                id: e.id,
                bidder: e.topics[1] ? scValToNative(xdr.ScVal.fromXDR(e.topics[1], 'base64')) : 'Unknown',
                amount: scValToNative(xdr.ScVal.fromXDR(e.value, 'base64')),
                time: "Just now",
                timestamp: Date.now(),
                txHash: e.transactionHash,
                rank: 1
              }));

              setHistory(prev => {
                const existingHashes = new Set(prev.map(b => b.txHash));
                const uniqueNewBids = newBids.filter(b => !existingHashes.has(b.txHash));
                if (uniqueNewBids.length === 0) return prev;

                const combined = [...uniqueNewBids, ...prev];
                return combined.sort((a, b) => b.amount - a.amount).map((b, i) => ({ ...b, rank: i + 1 }));
              });
            }
          }
        }
      } catch (e: any) {
        console.error("Event polling error:", e?.message || e?.toString() || "Unknown Error");
      }
    };

    const interval = setInterval(pollEvents, 5000);
    return () => clearInterval(interval);
  }, [highestBid, address, lastLedger]);

  // OPPONENT SIMULATION ENGINE
  useEffect(() => {
    if (!isSimulating || isEnded || !address) return;

    // Check if user is currently the winner
    const userIsWinner = history.length > 0 && history[0].bidder === address;

    if (userIsWinner) {
      const delay = Math.floor(Math.random() * 8000) + 7000; // 7-15 seconds
      const timer = setTimeout(() => {
        const opponents = [
          "GD23...R9WQ",
          "GB7V...L2M4",
          "GC4N...X7P1",
          "GA6K...Z8S2",
          "GD9R...M1K0"
        ];
        const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
        const increment = Math.floor(Math.random() * 40) + 15; // 15-55 XLM increase
        const newBidAmount = highestBid + increment;

        setHighestBid(newBidAmount);
        setIsOutbid(true);
        setHistory(prev => {
          const botBid = {
            id: Date.now(),
            bidder: randomOpponent,
            amount: newBidAmount,
            time: "Just now",
            timestamp: Date.now(),
            txHash: `sim_${Math.random().toString(36).slice(2, 10)}`,
            rank: 1
          };
          return [botBid, ...prev.map(b => ({ ...b, rank: b.rank + 1 }))].slice(0, 15);
        });
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [history, isSimulating, isEnded, address, highestBid]);

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
      const txHash = await placeBidOnChain(
        address,
        amount,
        async (xdr: string) => {
          const { signedTxXdr } = await kit.signTransaction(xdr);
          return signedTxXdr;
        }
      );

      setTxStatus("Transaction Broadcasted...");

      // OPTIMISTIC UPDATE: Set local UI immediately so user sees their bid
      setHighestBid(amount);
      setIsOutbid(false);

      // Add to history right away
      setHistory(prev => {
        const newBid = {
          id: Date.now(),
          bidder: address!,
          amount,
          time: "Just now",
          timestamp: Date.now(),
          txHash,
          rank: 1
        };
        const filtered = prev.filter(b => b.txHash !== txHash);
        return [newBid, ...filtered.map(b => ({ ...b, rank: b.rank + 1 }))].slice(0, 10);
      });

      // SYNC: Pull state after a short delay to account for ledger finalization
      setTimeout(async () => {
        const state = await getAuctionState();
        if (state) {
          const contractBid = Number(state.highest_bid);
          // Only update if the contract is ahead (e.g., someone else bid higher in between)
          if (contractBid > amount) {
            setHighestBid(contractBid);
            if (state.highest_bidder !== address) {
              setIsOutbid(true);
            }
          }
        }
      }, 3000); // 3 second delay for ledger sync

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
    <div suppressHydrationWarning className="min-h-screen bg-dark-bg text-white selection:bg-orange-primary selection:text-black">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-12">
        <Navbar
          address={address}
          setAddress={setAddress}
          setKit={setKit}
          setWalletName={setWalletName}
        />

        <Hero />

        <SearchSection />

        <div className="flex items-center justify-between bg-orange-primary/5 border border-orange-primary/20 p-4 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm font-medium">Live Bidding Engine: <span className={isSimulating ? 'text-green-500' : 'text-gray-500'}>{isSimulating ? 'Active' : 'Paused'}</span></span>
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
          >
            {isSimulating ? 'Disable Opponents' : 'Enable Opponents'}
          </button>
        </div>

        <Features />

        <FAQ />

        <StatusMessages error={error} txStatus={txStatus} isOutbid={isOutbid} />

        <div id="live-auctions" className="pt-20">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Live Auctions</h2>
            <div className="w-24 h-1 bg-orange-primary rounded-full" />
          </div>

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
        </div>

        <Footer />
      </main>
    </div>
  );
}
