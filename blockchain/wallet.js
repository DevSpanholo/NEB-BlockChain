import { ec as EC } from 'elliptic';
import { cryptoHash } from './crypto-hash.js';
import Transaction from './transaction.js';

const ec = new EC('secp256k1');

class Wallet {
    constructor() {
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
        this.balance = 1000; // Um valor inicial para a carteira, pode ser ajustado.
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction(recipient, amount) {
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction(this.publicKey, recipient, amount);
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }

                const addressOutput = transaction.outputs.find(output => output.address === address);

                if (addressOutput) {
                    outputsTotal = outputsTotal + addressOutput.amount;
                }
            }

            if (hasConductedTransaction) {
                break;
            }
        }

        return hasConductedTransaction ? outputsTotal : this.balance;
    }


}

export default Wallet;
