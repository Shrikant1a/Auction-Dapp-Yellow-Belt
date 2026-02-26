#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, symbol_short, Symbol};

#[contract]
pub struct NiplToken;

#[contractimpl]
impl NiplToken {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String) {
        if env.storage().instance().has(&symbol_short!("admin")) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("name"), &name);
        env.storage().instance().set(&symbol_short!("symbol"), &symbol);
        env.storage().instance().set(&symbol_short!("supply"), &0i128);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&symbol_short!("admin")).unwrap();
        admin.require_auth();

        let mut balance: i128 = env.storage().persistent().get(&to).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&to, &balance);

        let mut supply: i128 = env.storage().instance().get(&symbol_short!("supply")).unwrap();
        supply += amount;
        env.storage().instance().set(&symbol_short!("supply"), &supply);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&id).unwrap_or(0)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        let mut from_balance: i128 = env.storage().persistent().get(&from).unwrap_or(0);
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        from_balance -= amount;
        env.storage().persistent().set(&from, &from_balance);

        let mut to_balance: i128 = env.storage().persistent().get(&to).unwrap_or(0);
        to_balance += amount;
        env.storage().persistent().set(&to, &to_balance);
        
        env.events().publish((symbol_short!("transfer"), from, to), amount);
    }
}
