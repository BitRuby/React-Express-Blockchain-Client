"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Blockchain_1 = __importDefault(require("./Blockchain"));
var Transaction_1 = __importDefault(require("./Transaction"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var Server_1 = __importDefault(require("./Server"));
var Wallet_1 = __importDefault(require("./Wallet"));
var HTTP_PORT = process.env.HTTP_PORT || "5000";
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
var blockchain = new Blockchain_1.default();
var wallet = new Wallet_1.default();
var server = new Server_1.default(blockchain);
var POST_TRANSACTIONS = "/transact";
var POST_MINE = "/mine-transactions";
var GET_BALANCE = "/balance";
var GET_CHAIN = "/chain";
var GET_PUBLIC_KEY = "/public-key";
var GET_TRANSACTIONS = "/transactions";
var GET_CHAIN_VALIDATION = "/validate";
var GET_HISTORY = "/history";
app.get(GET_PUBLIC_KEY, function (request, response) {
    response.json({ publicKey: wallet.getPublicKey() });
});
app.get(GET_BALANCE, function (request, response) {
    response.json({
        balance: Blockchain_1.default.getBalance(blockchain.chain, wallet.getPublicKey())
    });
});
app.get(GET_CHAIN, function (request, response) {
    response.json({ chain: blockchain.chain });
});
app.get(GET_TRANSACTIONS, function (request, response) {
    response.json({ transactions: blockchain.pendingTransactions });
});
app.get(GET_CHAIN_VALIDATION, function (request, response) {
    response.json({ valid: Blockchain_1.default.validateChain(blockchain.chain) });
});
app.get(GET_HISTORY, function (request, response) {
    response.json({ history: Blockchain_1.default.getHistory(blockchain.chain, wallet.getPublicKey()) });
});
app.post(POST_MINE, function (request, response) {
    Blockchain_1.default.minePendingTransaction(blockchain.pendingTransactions, blockchain.chain, wallet.getPublicKey());
    server.syncChains(blockchain.chain);
    blockchain.pendingTransactions = new Array();
    server.broadcastClear();
    response.redirect(GET_CHAIN);
});
app.post(POST_TRANSACTIONS, function (request, response) {
    var _a = request.body, destinationAddress = _a.destinationAddress, amount = _a.amount;
    var transaction = new Transaction_1.default(amount, wallet.getPublicKey(), destinationAddress);
    Transaction_1.default.signTransaction(transaction, wallet.keyFromPrivate());
    Blockchain_1.default.addTransaction(blockchain.pendingTransactions, transaction);
    server.broadcastTx(transaction);
    response.redirect(GET_TRANSACTIONS);
});
app.listen(HTTP_PORT, function () {
    console.log("HTTP Server listening on port " + HTTP_PORT);
});
server.listen();
//# sourceMappingURL=index.js.map