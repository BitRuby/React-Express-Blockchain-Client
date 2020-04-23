import WebSocket from "ws";
import Transaction from "./Transaction";
import Blockchain from "./Blockchain";
import serialize from "serialize-javascript";
import Block from "./Block";
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(",") : [];
const P2P_PORT: string = process.env.P2P_PORT || "8900";

const actions = {
    ADD_TRANSACTION: 'ADD_TRANSACTION',
    SEND_CHAIN: 'SEND_CHAIN',
    CLEAR_TX_POOL: 'CLEAR_TX_POOL'
}

class Server {
    private readonly server: WebSocket.Server;
    private webSockets: WebSocket[] = [];
    private blockchain: Blockchain;
    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.server = new WebSocket.Server({ port: +P2P_PORT });
    }
    listen(): void {
        this.server.on('connection', (webSocket: WebSocket) => this.connectSocket(webSocket));
        peers.forEach(url => {
            this.connectToPeers(url);
        });
        console.log("listening for P2P connections on " + P2P_PORT);
    }
    private connectSocket(webSocket: WebSocket): void {
        this.webSockets.push(webSocket);
        console.log('Peer connected: ' + webSocket.url);
        this.handleActions(webSocket);
        this.sendChain(webSocket, this.blockchain.chain);

    }
    private sleep(ms: number): Promise<boolean> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    private connectToPeers(url: String): void {
        const webSocket: WebSocket = new WebSocket(url.toString());
        if (webSocket.readyState !== WebSocket.OPEN) {
            webSocket.on("open", () => {
                this.connectSocket(webSocket);
            })
            webSocket.on('error', async () => {
                console.log('Connection to WebSocket ' + webSocket.url + ' refused!');
                await this.sleep(10000);
                this.connectToPeers(url.toString());
            })
        }
    }
    private handleActions(webSocket: WebSocket): void {
        webSocket.on('message', (message: string) => {
            const data = eval('(' + message.toString() + ')');
            switch (data.type) {
                case actions.ADD_TRANSACTION:
                    Blockchain.addTransaction(this.blockchain.pendingTransactions, data.data);
                    break;
                case actions.SEND_CHAIN:
                    try {
                        if (Blockchain.validateChain(data.data)) {
                            if (data.data.length <= this.blockchain.chain.length) {
                                throw new Error("Chain is not longer than current chain. Not replacing.")
                            } else {
                                this.blockchain.chain = data.data;
                            }
                        } else {
                            throw new Error("Chain is not valid");
                        }
                    } catch (error) {
                        return error;
                    } break;
                case actions.CLEAR_TX_POOL:
                    this.blockchain.pendingTransactions = [];
                    break;
            }
        })
    }
    private sendChain = (webSocket: WebSocket, chain: Block[]): void => {
        webSocket.send(serialize({
            type: actions.SEND_CHAIN,
            data: chain
        }));
    }
    private sendTransaction(webSocket: WebSocket, transaction: Transaction): void {
        webSocket.send(serialize({
            type: actions.ADD_TRANSACTION,
            data: transaction
        }));
    }
    private clearTxPool(webSocket: WebSocket): void {
        webSocket.send(serialize({
            type: actions.CLEAR_TX_POOL
        }));
    }
    syncChains(chain: Block[]): void {
        this.webSockets.forEach(webSocket => {
            this.sendChain(webSocket, chain);
        })
    }
    broadcastClear(): void {
        this.webSockets.forEach(webSocket => {
            this.clearTxPool(webSocket);
        })
    }
    broadcastTx(transaction: Transaction): void {
        this.webSockets.forEach(webSocket => {
            console.log("Send tx: " + webSocket.url)

            this.sendTransaction(webSocket, transaction);
        })
    }
}

export default Server;