#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, testutils::Ledger as _, Address, Env};

fn setup_test(env: &Env) -> (Address, AuctionContractClient<'_>) {
    let owner = Address::generate(env);
    let contract_id = env.register(AuctionContract, ());
    let client = AuctionContractClient::new(env, &contract_id);
    (owner, client)
}

#[test]
fn test_initialization() {
    let env = Env::default();
    let (owner, client) = setup_test(&env);
    
    client.initialize(&owner, &10, &100, &3600, &300, &600);
    
    let auction = client.get_auction();
    assert_eq!(auction.highest_bid, 100);
    assert_eq!(auction.highest_bidder, owner);
    assert_eq!(auction.finalized, false);
}

#[test]
fn test_place_bid() {
    let env = Env::default();
    let (owner, client) = setup_test(&env);
    client.initialize(&owner, &10, &100, &3600, &300, &600);
    
    let bidder = Address::generate(&env);
    env.mock_all_auths();
    
    client.place_bid(&bidder, &150);
    
    let auction = client.get_auction();
    assert_eq!(auction.highest_bid, 150);
    assert_eq!(auction.highest_bidder, bidder);
}

#[test]
#[should_panic(expected = "Bid amount too low")]
fn test_bid_too_low() {
    let env = Env::default();
    let (owner, client) = setup_test(&env);
    client.initialize(&owner, &10, &100, &3600, &300, &600);
    
    let bidder = Address::generate(&env);
    env.mock_all_auths();
    
    client.place_bid(&bidder, &105); // Min increment is 10, so min bid is 110
}

#[test]
fn test_anti_sniping_extension() {
    let env = Env::default();
    let (owner, client) = setup_test(&env);
    
    let window = 300; // 5 mins
    let duration = 3600; // 1 hour init duration
    let extension = 600; // 10 mins extension
    
    client.initialize(&owner, &10, &100, &duration, &window, &extension);
    
    let auction_init = client.get_auction();
    let original_end = auction_init.end_time;
    
    // Fast forward to near the end
    env.ledger().set_timestamp(original_end - 120); // 2 mins before end (within 5 min window)
    
    let bidder = Address::generate(&env);
    env.mock_all_auths();
    
    client.place_bid(&bidder, &200);
    
    let auction_after = client.get_auction();
    assert!(auction_after.end_time > original_end);
    assert_eq!(auction_after.end_time, env.ledger().timestamp() + extension);
}
