// blockchain/transaction.js

import { MINING_REWARD } from '../config.js';
import { verifySignature } from '../util/index.js';
import cryptoHash from '../util/crypto-hash.js';
import Wallet from './wallet.js';


class Transaction {
    constructor(sender, recipient, amount) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    toString() {
        return `Transaction - 
            Sender: ${this.sender}
            Recipient: ${this.recipient}
            Amount: ${this.amount}
            Timestamp: ${this.timestamp}`;
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(cryptoHash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction) {
        return verifySignature({
            publicKey: transaction.input.address,
            data: cryptoHash(transaction.outputs),
            signature: transaction.input.signature
        });
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static validTransaction(transaction) {
        const { input: { address, amount, signature }, outputs } = transaction;
        const outputTotal = outputs.reduce((total, output) => total + output.amount, 0);
        if (amount !== outputTotal) {
            console.log(`Invalid transaction from ${address}`);
            return false;
        }
        if (!verifySignature({ publicKey: address, data: cryptoHash(outputs), signature })) {
            console.log(`Invalid signature from ${address}`);
            return false;
        }
        return true;
    }




}

export default Transaction;
