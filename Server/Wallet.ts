import { ec } from "elliptic";
const EC = new ec('secp256k1');

class Wallet {
    private keyPair: ec.KeyPair;
    private publicKey: String;
    private privateKey: String;
    constructor() {
        this.keyPair = EC.genKeyPair();
        this.publicKey = this.keyPair.getPublic('hex');
        this.privateKey = this.keyPair.getPrivate('hex');
        console.log("Wallet address: " + this.publicKey);
    }
    public getPublicKey(): String {
        return this.publicKey;
    }
    public keyFromPrivate(): ec.KeyPair {
        return EC.keyFromPrivate(this.privateKey.toString());
    }
    public static getKeyPair(): ec.KeyPair {
        return EC.genKeyPair();
    }
}

export default Wallet;