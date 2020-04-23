import SHA256 from "crypto-js/sha256";
import { ec } from "elliptic";
const k: ec = new ec('secp256k1');

class Transaction {
    public amount: number;
    public originAddress: String;
    public destinationAddress: String;
    public signature: String = '';
    constructor(amount: number, originAddress: String, destinationAddress: String) {
        this.amount = amount;
        this.originAddress = originAddress;
        this.destinationAddress = destinationAddress;
    }
    static calculateHash(transaction: Transaction): String {
        return SHA256(transaction.originAddress.toString() + transaction.destinationAddress.toString() + transaction.amount.toString()).toString();
    }
    static signTransaction(transaction: Transaction, key: ec.KeyPair): String {
        try {
            if (key.getPublic('hex') !== transaction.originAddress)
                throw new Error('Cannot sign transactions from other wallets')
        } catch (error) {
            return (error);
        }
        const hashTx = Transaction.calculateHash(transaction).toString();
        const sign = key.sign(hashTx, 'base64');
        return sign.toDER('hex');
    }
    static isValid(transaction: Transaction) {
        if (transaction.originAddress === null) return true;
        try {
            if (!transaction.signature || transaction.signature.length === 0) {
                throw new Error("This transaction is not signed");
            }
        } catch (error) {
            return error;
        }
        const publicKey = k.keyFromPublic(transaction.originAddress.toString(), 'hex');
        return publicKey.verify(Transaction.calculateHash(transaction).toString(), transaction.signature.toString());
    }
}

export default Transaction;