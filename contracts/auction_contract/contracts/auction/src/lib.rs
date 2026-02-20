#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    AuctionData,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct AuctionData {
    pub highest_bid: i128,
    pub highest_bidder: Address,
    pub end_time: u64,
    pub min_increment: i128,
    pub owner: Address,
    pub finalized: bool,
    pub extension_window: u64,
    pub extension_duration: u64,
}

#[contract]
pub struct AuctionContract;

#[contractimpl]
impl AuctionContract {
    pub fn initialize(
        env: Env,
        owner: Address,
        min_increment: i128,
        starting_price: i128,
        duration_secs: u64,
        extension_window: u64,
        extension_duration: u64,
    ) {
        if env.storage().instance().has(&DataKey::AuctionData) {
            panic!("Auction already initialized");
        }

        let auction_data = AuctionData {
            highest_bid: starting_price,
            highest_bidder: owner.clone(),
            end_time: env.ledger().timestamp() + duration_secs,
            min_increment,
            owner: owner.clone(),
            finalized: false,
            extension_window,
            extension_duration,
        };

        env.storage().instance().set(&DataKey::AuctionData, &auction_data);
    }

    pub fn place_bid(env: Env, bidder: Address, amount: i128) {
        bidder.require_auth();

        let mut auction_data: AuctionData = env
            .storage()
            .instance()
            .get(&DataKey::AuctionData)
            .expect("Auction not initialized");

        if auction_data.finalized {
            panic!("Auction already finalized");
        }

        if env.ledger().timestamp() >= auction_data.end_time {
            panic!("Auction has expired");
        }

        if amount < auction_data.highest_bid + auction_data.min_increment {
            panic!("Bid amount too low");
        }

        // Anti-Sniping Logic
        let current_time = env.ledger().timestamp();
        if auction_data.end_time - current_time < auction_data.extension_window {
            auction_data.end_time = current_time + auction_data.extension_duration;
            
            // Emit extension event
            env.events().publish(
                (symbol_short!("extend"), auction_data.end_time),
                current_time,
            );
        }

        auction_data.highest_bid = amount;
        auction_data.highest_bidder = bidder.clone();

        env.storage().instance().set(&DataKey::AuctionData, &auction_data);

        // Emit event for real-time updates
        env.events().publish(
            (symbol_short!("bid"), bidder),
            amount,
        );
    }

    pub fn get_auction(env: Env) -> AuctionData {
        env.storage()
            .instance()
            .get(&DataKey::AuctionData)
            .expect("Auction not initialized")
    }

    pub fn finalize(env: Env) {
        let mut auction_data: AuctionData = env
            .storage()
            .instance()
            .get(&DataKey::AuctionData)
            .expect("Auction not initialized");

        if auction_data.finalized {
            panic!("Auction already finalized");
        }

        if env.ledger().timestamp() < auction_data.end_time {
            panic!("Auction still active");
        }

        auction_data.finalized = true;
        env.storage().instance().set(&DataKey::AuctionData, &auction_data);

        env.events().publish(
            (symbol_short!("final"), auction_data.highest_bidder.clone()),
            auction_data.highest_bid,
        );
    }
}
