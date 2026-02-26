#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, IntoVal};
// #[contractinterface]
pub trait TokenInterface {
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn balance(env: Env, id: Address) -> i128;
}

struct TokenClient {
    env: Env,
    address: Address,
}

impl TokenClient {
    fn new(env: &Env, address: &Address) -> Self {
        Self {
            env: env.clone(),
            address: address.clone(),
        }
    }
    fn transfer(&self, from: &Address, to: &Address, amount: &i128) {
        self.env.invoke_contract::<()>(
            &self.address,
            &Symbol::new(&self.env, "transfer"),
            (from.clone(), to.clone(), *amount).into_val(&self.env),
        );
    }
}

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
    pub token_address: Address, // Inter-contract call target
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
        token_address: Address,
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
            token_address,
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

        // INTER-CONTRACT CALL: Transfer NIPL tokens
        // We assume the token contract has a 'transfer' method: transfer(from, to, amount)
        let token_client = TokenClient::new(&env, &auction_data.token_address);
        
        // 1. Transfer new bid to this contract (Escrow)
        token_client.transfer(&bidder, &env.current_contract_address(), &amount);

        // 2. Refund previous bidder (if not owner)
        if auction_data.highest_bidder != auction_data.owner {
            token_client.transfer(&env.current_contract_address(), &auction_data.highest_bidder, &auction_data.highest_bid);
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

mod test;
