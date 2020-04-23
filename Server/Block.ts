import SHA256 from "crypto-js/sha256";
import Transaction from "./Transaction";

class Block {
    public timestamp: Date;
    public transactions: Transaction[];
    public previousHash: String;
    public hash: String;
    public nonce: number = 0;
    constructor(timestamp: Date, transactions: Transaction[], previousHash: String = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = Block.calculateHash(timestamp, previousHash, transactions, this.nonce);
    }
    static calculateHash(timestamp: Date, previousHash: String, transactions: Transaction[], nonce: number): String {
        return SHA256(previousHash.toString() + timestamp.toISOString() + JSON.stringify(transactions) + nonce.toString()).toString();
    }
    static mine(block: Block, diff: number): void {
        while (block.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
            block.nonce++;
            block.hash = Block.calculateHash(block.timestamp, block.previousHash, block.transactions, block.nonce);
        }
        console.log("Block mined " + block.hash);
    }
    static hasValidTransactions(transactions: Transaction[]): Boolean {
        for (const tx of transactions) {
            if (!Transaction.isValid(tx)) {
                return false;
            }
        }
        return true;
    }
}

export default Block;
