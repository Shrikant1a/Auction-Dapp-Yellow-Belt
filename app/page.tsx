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

import CreateAuctionModal from "@/components/CreateAuctionModal";
import UserActivityModal from "@/components/UserActivityModal";
import NotificationModal, { Notification } from "@/components/NotificationModal";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [auctionData, setAuctionData] = useState({
    name: "Aero Precision",
    details: "The Ferrari 488 Pista. A masterpiece of aerodynamic engineering and raw power. This specific unit is tracked on the Stellar blockchain, ensuring an immutable record of ownership and service history.",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000"
  });

  // New Auction Setup Logic
  const handleNewAuction = (data: any) => {
    // Switch to Demo Mode for the new listing to avoid state mismatch with the real contract
    setIsDemoMode(true);
    setHighestBid(data.startingPrice || 100);
    setTimeLeft((data.duration || 24) * 3600);
    setAuctionData({
      name: data.name || "Custom Supercar",
      details: data.details || "A custom listed supercar on the Stellar network. Verified authenticity and performance specs.",
      image: data.image || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000"
    });
    setIsEnded(false);
    setHistory([]);
    setIsOutbid(false);
    setTxStatus("New Local Auction Launched! (Demo Mode Active)");
    setTimeout(() => setTxStatus(null), 5000);
  };

  // Audio Cues for Outbid
  useEffect(() => {
    if (isOutbid && typeof window !== 'undefined') {
      // Add notification
      const id = `outbid-${Date.now()}`;
      setNotifications(prev => [{
        id,
        type: 'outbid',
        message: "You've been outbid! Place a higher bid to stay in the race.",
        time: "Just now",
        timestamp: Date.now(),
        read: false
      }, ...prev].slice(0, 20));

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
    if (isDemoMode) return;

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
  }, [address, isDemoMode]);

  // REAL-TIME EVENT INTEGRATION
  const [lastLedger, setLastLedger] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isDemoMode) return;

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

                // Add notification for new bids if not from user
                uniqueNewBids.forEach(bid => {
                  if (bid.bidder !== address) {
                    setNotifications(p => [{
                      id: `bid-${bid.id}-${Date.now()}`,
                      type: 'bid',
                      message: `New bid of ${bid.amount} XLM placed by ${bid.bidder.slice(0, 4)}...${bid.bidder.slice(-4)}`,
                      time: "Just now",
                      timestamp: Date.now(),
                      txHash: bid.txHash,
                      read: false
                    }, ...p].slice(0, 20));
                  }
                });

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
  }, [highestBid, address, lastLedger, isDemoMode]);

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

          setNotifications(p => [{
            id: `sim-bid-${Date.now()}`,
            type: 'outbid',
            message: `OUTBID! ${randomOpponent} just placed a bid of ${newBidAmount} XLM`,
            time: "Just now",
            timestamp: Date.now(),
            read: false
          }, ...p].slice(0, 20));

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
      let txHash;
      if (isDemoMode) {
        // SIMULATED BID
        await new Promise(r => setTimeout(r, 1500));
        txHash = `sim_${Math.random().toString(36).slice(2, 10)}`;
      } else {
        // REAL ON-CHAIN BID
        txHash = await placeBidOnChain(
          address,
          amount,
          async (xdr: string) => {
            const { signedTxXdr } = await kit.signTransaction(xdr);
            return signedTxXdr;
          }
        );
      }

      setTxStatus(isDemoMode ? "Confirmed (Simulated)" : "Transaction Broadcasted...");

      // UPDATE UI
      setHighestBid(amount);
      setIsOutbid(false);

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
        setNotifications(p => [{
          id: `user-bid-${Date.now()}`,
          type: 'success',
          message: `Success! Your bid of ${amount} XLM has been secured.`,
          time: "Just now",
          timestamp: Date.now(),
          txHash,
          read: true
        }, ...p].slice(0, 20));

        const filtered = prev.filter(b => b.txHash !== txHash);
        return [newBid, ...filtered.map(b => ({ ...b, rank: b.rank + 1 }))].slice(0, 10);
      });

      if (!isDemoMode) {
        // SYNC
        setTimeout(async () => {
          const state = await getAuctionState();
          if (state) {
            const contractBid = Number(state.highest_bid);
            if (contractBid > amount) {
              setHighestBid(contractBid);
              if (state.highest_bidder !== address) {
                setIsOutbid(true);
              }
            }
          }
        }, 3000);
      }

      setBidAmount("");
      if (!isDemoMode) setTxStatus(`Confirmed (Hash: ${txHash.slice(0, 8)}...)`);
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: any) {
      setTxStatus(null);
      let errorMsg = err.message || "Unknown error";

      if (errorMsg.includes("UnreachableCodeReached") || errorMsg.includes("InvalidAction")) {
        errorMsg = "Blockchain Error: The smart contract rejected this bid. The current real contract state is likely set to a much higher value (e.g. 1490 XLM) than the current local demo.";
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (window as any).openCreateAuction = () => setIsCreateModalOpen(true);
    return () => { delete (window as any).openCreateAuction; };
  }, []);


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
          onCartClick={() => setIsActivityModalOpen(true)}
          onNotificationClick={() => setIsNotificationModalOpen(true)}
          hasUnread={notifications.some(n => !n.read)}
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
            <AuctionShowcase
              name={auctionData.name}
              details={auctionData.details}
              image={auctionData.image}
            />

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

      <CreateAuctionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleNewAuction}
      />

      <UserActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        history={history}
        address={address}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onClearAll={() => setNotifications([])}
      />
    </div>
  );
}
