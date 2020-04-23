"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sha256_1 = __importDefault(require("crypto-js/sha256"));
var elliptic_1 = require("elliptic");
var k = new elliptic_1.ec('secp256k1');
var Transaction = /** @class */ (function () {
    function Transaction(amount, originAddress, destinationAddress) {
        this.signature = '';
        this.amount = amount;
        this.originAddress = originAddress;
        this.destinationAddress = destinationAddress;
    }
    Transaction.calculateHash = function (transaction) {
        return sha256_1.default(transaction.originAddress.toString() + transaction.destinationAddress.toString() + transaction.amount.toString()).toString();
    };
    Transaction.signTransaction = function (transaction, key) {
        try {
            if (key.getPublic('hex') !== transaction.originAddress)
                throw new Error('Cannot sign transactions from other wallets');
        }
        catch (error) {
            return (error);
        }
        var hashTx = Transaction.calculateHash(transaction).toString();
        var sign = key.sign(hashTx, 'base64');
        return sign.toDER('hex');
    };
    Transaction.isValid = function (transaction) {
        if (transaction.originAddress === null)
            return true;
        try {
            if (!transaction.signature || transaction.signature.length === 0) {
                throw new Error("This transaction is not signed");
            }
        }
        catch (error) {
            return error;
        }
        var publicKey = k.keyFromPublic(transaction.originAddress.toString(), 'hex');
        return publicKey.verify(Transaction.calculateHash(transaction).toString(), transaction.signature.toString());
    };
    return Transaction;
}());
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map