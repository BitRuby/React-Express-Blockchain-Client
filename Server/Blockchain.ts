import Block from "./Block";
import Transaction from "./Transaction";

const mineDifficulty: string = process.env.DIFFICULTY || "2";
const miningReward: string = process.env.REWARD || "1";

class Blockchain {
    public chain: Block[];
    public pendingTransactions: Transaction[];
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }
    private createGenesisBlock(): Block {
        return new Block(new Date(), [new Transaction(0, "@#$@#F", "!e121")], "0");
    }
    static minePendingTransaction(pendingTransactions: Transaction[], chain: Block[], rewardAddress: String): void {
        const rewardTx = new Transaction(+miningReward, '', rewardAddress);
        pendingTransactions.push(rewardTx);
        const block = new Block(new Date(), pendingTransactions, chain[chain.length - 1].hash);
        Block.mine(block, +mineDifficulty);
        chain.push(block);
    }
    static addTransaction(pendingTransactions: Transaction[], transaction: Transaction): void {
        try {
            if (!transaction.originAddress || !transaction.destinationAddress) {
                throw new Error("Transaction should have origin and destination address");
            }
            if (!Transaction.isValid(transaction)) {
                throw new Error("Cannot add invalid transaction");
            }
        } catch (error) {
            return error;
        }
        pendingTransactions.push(transaction);
    }
    static getBalance(chain: Block[], address: String): number {
        let balance = 0;
        for (const block of chain) {
            for (const trans of block.transactions) {
                if (trans.originAddress === address) {
                    balance -= Number(trans.amount);
                }
                if (trans.destinationAddress === address) {
                    balance += Number(trans.amount);
                }
            }
        }
        return balance;
    }
    static getHistory(chain: Block[], address: String): Array<any> {
        let array = [];
        for (const block of chain) {
            for (const trans of block.transactions) {
                if (trans.originAddress === address || trans.destinationAddress === address) {
                    array.push({
                        from: trans.originAddress,
                        to: trans.destinationAddress,
                        amount: trans.amount
                    })
                }
            }
        }
        return array;
    }
    static validateChain(chain: Block[]): Boolean {
        for (let i = 1; i < chain.length - 1; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];

            if (!Block.hasValidTransactions(currentBlock.transactions)) {
                return false;
            }

            if (currentBlock.hash !== Block.calculateHash(currentBlock.timestamp, currentBlock.previousHash, currentBlock.transactions, currentBlock.nonce)) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

export default Blockchain;