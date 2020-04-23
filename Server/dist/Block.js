"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var Transaction_1 = __importDefault(require("./Transaction"));
var Block = /** @class */ (function () {
    function Block(timestamp, transactions, previousHash) {
        if (previousHash === void 0) { previousHash = ""; }
        this.nonce = 0;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = Block.calculateHash(timestamp, previousHash, transactions, this.nonce);
    }
    Block.calculateHash = function (timestamp, previousHash, transactions, nonce) {
        return sha256_1.default(previousHash.toString() + timestamp.toISOString() + JSON.stringify(transactions) + nonce.toString()).toString();
    };
    Block.mine = function (block, diff) {
        while (block.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
            block.nonce++;
            block.hash = Block.calculateHash(block.timestamp, block.previousHash, block.transactions, block.nonce);
        }
        console.log("Block mined " + block.hash);
    };
    Block.hasValidTransactions = function (transactions) {
        for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
            var tx = transactions_1[_i];
            if (!Transaction_1.default.isValid(tx)) {
                return false;
            }
        }
        return true;
    };
    return Block;
}());
exports.default = Block;
//# sourceMappingURL=Block.js.map