"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elliptic_1 = require("elliptic");
var EC = new elliptic_1.ec('secp256k1');
var Wallet = /** @class */ (function () {
    function Wallet() {
        this.keyPair = EC.genKeyPair();
        this.publicKey = this.keyPair.getPublic('hex');
        this.privateKey = this.keyPair.getPrivate('hex');
        console.log("Wallet address: " + this.publicKey);
    }
    Wallet.prototype.getPublicKey = function () {
        return this.publicKey;
    };
    Wallet.prototype.keyFromPrivate = function () {
        return EC.keyFromPrivate(this.privateKey.toString());
    };
    Wallet.getKeyPair = function () {
        return EC.genKeyPair();
    };
    return Wallet;
}());
exports.default = Wallet;
//# sourceMappingURL=Wallet.js.map