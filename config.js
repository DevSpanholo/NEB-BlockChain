
const MINE_RATE = 1000;

const MINING_REWARD = 50;

const INITIAL_DIFFICULTY = 3;

const STARTING_BALANCE = 1000;


const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
    };
    

export { GENESIS_DATA, MINE_RATE, MINING_REWARD, STARTING_BALANCE };