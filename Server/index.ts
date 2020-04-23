import Blockchain from "./Blockchain";
import Transaction from "./Transaction";
import express from 'express';
import bodyParser from "body-parser";
import Server from "./Server";
import Wallet from "./Wallet";

const HTTP_PORT: string = process.env.HTTP_PORT || "5000";
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});

const blockchain = new Blockchain();
const wallet = new Wallet();
const server = new Server(blockchain);

const POST_TRANSACTIONS = "/transact";
const POST_MINE = "/mine-transactions"
const GET_BALANCE = "/balance";
const GET_CHAIN = "/chain";
const GET_PUBLIC_KEY = "/public-key";
const GET_TRANSACTIONS = "/transactions";
const GET_CHAIN_VALIDATION = "/validate";
const GET_HISTORY = "/history";

app.get(GET_PUBLIC_KEY, (request, response) => {
    response.json({ publicKey: wallet.getPublicKey() });
});

app.get(GET_BALANCE, (request, response) => {
    response.json({
        balance: Blockchain.getBalance(blockchain.chain, wallet.getPublicKey())
    });
});
app.get(GET_CHAIN, (request, response) => {
    response.json({ chain: blockchain.chain });
});

app.get(GET_TRANSACTIONS, (request, response) => {
    response.json({ transactions: blockchain.pendingTransactions })
});

app.get(GET_CHAIN_VALIDATION, (request, response) => {
    response.json({ valid: Blockchain.validateChain(blockchain.chain) })
});

app.get(GET_HISTORY, (request, response) => {
    response.json({ history: Blockchain.getHistory(blockchain.chain, wallet.getPublicKey()) })
});

app.post(POST_MINE, (request, response) => {
    Blockchain.minePendingTransaction(blockchain.pendingTransactions, blockchain.chain, wallet.getPublicKey());
    server.syncChains(blockchain.chain);
    blockchain.pendingTransactions = new Array<Transaction>();
    server.broadcastClear();
    response.redirect(GET_CHAIN);
});

app.post(POST_TRANSACTIONS, (request, response) => {
    const { destinationAddress, amount }: { destinationAddress: String, amount: number } = request.body;
    const transaction = new Transaction(amount, wallet.getPublicKey(), destinationAddress);
    Transaction.signTransaction(transaction, wallet.keyFromPrivate());
    Blockchain.addTransaction(blockchain.pendingTransactions, transaction);
    server.broadcastTx(transaction);
    response.redirect(GET_TRANSACTIONS);
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP Server listening on port ${HTTP_PORT}`);
})

server.listen();
