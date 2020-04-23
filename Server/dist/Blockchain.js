"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Block_1 = __importDefault(require("./Block"));
var Transaction_1 = __importDefault(require("./Transaction"));
var mineDifficulty = process.env.DIFFICULTY || "2";
var miningReward = process.env.REWARD || "1";
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }
    Blockchain.prototype.createGenesisBlock = function () {
        return new Block_1.default(new Date(), [new Transaction_1.default(0, "@#$@#F", "!e121")], "0");
    };
    Blockchain.minePendingTransaction = function (pendingTransactions, chain, rewardAddress) {
        var rewardTx = new Transaction_1.default(+miningReward, '', rewardAddress);
        pendingTransactions.push(rewardTx);
        var block = new Block_1.default(new Date(), pendingTransactions, chain[chain.length - 1].hash);
        Block_1.default.mine(block, +mineDifficulty);
        chain.push(block);
    };
    Blockchain.addTransaction = function (pendingTransactions, transaction) {
        try {
            if (!transaction.originAddress || !transaction.destinationAddress) {
                throw new Error("Transaction should have origin and destination address");
            }
            if (!Transaction_1.default.isValid(transaction)) {
                throw new Error("Cannot add invalid transaction");
            }
        }
        catch (error) {
            return error;
        }
        pendingTransactions.push(transaction);
    };
    Blockchain.getBalance = function (chain, address) {
        var balance = 0;
        for (var _i = 0, chain_1 = chain; _i < chain_1.length; _i++) {
            var block = chain_1[_i];
            for (var _a = 0, _b = block.transactions; _a < _b.length; _a++) {
                var trans = _b[_a];
                if (trans.originAddress === address) {
                    balance -= Number(trans.amount);
                }
                if (trans.destinationAddress === address) {
                    balance += Number(trans.amount);
                }
            }
        }
        return balance;
    };
    Blockchain.getHistory = function (chain, address) {
        var array = [];
        for (var _i = 0, chain_2 = chain; _i < chain_2.length; _i++) {
            var block = chain_2[_i];
            for (var _a = 0, _b = block.transactions; _a < _b.length; _a++) {
                var trans = _b[_a];
                if (trans.originAddress === address || trans.destinationAddress === address) {
                    array.push({
                        from: trans.originAddress,
                        to: trans.destinationAddress,
                        amount: trans.amount
                    });
                }
            }
        }
        return array;
    };
    Blockchain.validateChain = function (chain) {
        for (var i = 1; i < chain.length - 1; i++) {
            var currentBlock = chain[i];
            var previousBlock = chain[i - 1];
            if (!Block_1.default.hasValidTransactions(currentBlock.transactions)) {
                return false;
            }
            if (currentBlock.hash !== Block_1.default.calculateHash(currentBlock.timestamp, currentBlock.previousHash, currentBlock.transactions, currentBlock.nonce)) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return Blockchain;
}());
exports.default = Blockchain;
//# sourceMappingURL=Blockchain.js.map