"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var Blockchain_1 = __importDefault(require("./Blockchain"));
var serialize_javascript_1 = __importDefault(require("serialize-javascript"));
var peers = process.env.PEERS ? process.env.PEERS.split(",") : [];
var P2P_PORT = process.env.P2P_PORT || "8900";
var actions = {
    ADD_TRANSACTION: 'ADD_TRANSACTION',
    SEND_CHAIN: 'SEND_CHAIN',
    CLEAR_TX_POOL: 'CLEAR_TX_POOL'
};
var Server = /** @class */ (function () {
    function Server(blockchain) {
        this.webSockets = [];
        this.sendChain = function (webSocket, chain) {
            webSocket.send(serialize_javascript_1.default({
                type: actions.SEND_CHAIN,
                data: chain
            }));
        };
        this.blockchain = blockchain;
        this.server = new ws_1.default.Server({ port: +P2P_PORT });
    }
    Server.prototype.listen = function () {
        var _this = this;
        this.server.on('connection', function (webSocket) { return _this.connectSocket(webSocket); });
        peers.forEach(function (url) {
            _this.connectToPeers(url);
        });
        console.log("listening for P2P connections on " + P2P_PORT);
    };
    Server.prototype.connectSocket = function (webSocket) {
        this.webSockets.push(webSocket);
        console.log('Peer connected: ' + webSocket.url);
        this.handleActions(webSocket);
        this.sendChain(webSocket, this.blockchain.chain);
    };
    Server.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Server.prototype.connectToPeers = function (url) {
        var _this = this;
        var webSocket = new ws_1.default(url.toString());
        if (webSocket.readyState !== ws_1.default.OPEN) {
            webSocket.on("open", function () {
                _this.connectSocket(webSocket);
            });
            webSocket.on('error', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('Connection to WebSocket ' + webSocket.url + ' refused!');
                            return [4 /*yield*/, this.sleep(10000)];
                        case 1:
                            _a.sent();
                            this.connectToPeers(url.toString());
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    Server.prototype.handleActions = function (webSocket) {
        var _this = this;
        webSocket.on('message', function (message) {
            var data = eval('(' + message.toString() + ')');
            switch (data.type) {
                case actions.ADD_TRANSACTION:
                    Blockchain_1.default.addTransaction(_this.blockchain.pendingTransactions, data.data);
                    break;
                case actions.SEND_CHAIN:
                    try {
                        if (Blockchain_1.default.validateChain(data.data)) {
                            if (data.data.length <= _this.blockchain.chain.length) {
                                throw new Error("Chain is not longer than current chain. Not replacing.");
                            }
                            else {
                                _this.blockchain.chain = data.data;
                            }
                        }
                        else {
                            throw new Error("Chain is not valid");
                        }
                    }
                    catch (error) {
                        return error;
                    }
                    break;
                case actions.CLEAR_TX_POOL:
                    _this.blockchain.pendingTransactions = [];
                    break;
            }
        });
    };
    Server.prototype.sendTransaction = function (webSocket, transaction) {
        webSocket.send(serialize_javascript_1.default({
            type: actions.ADD_TRANSACTION,
            data: transaction
        }));
    };
    Server.prototype.clearTxPool = function (webSocket) {
        webSocket.send(serialize_javascript_1.default({
            type: actions.CLEAR_TX_POOL
        }));
    };
    Server.prototype.syncChains = function (chain) {
        var _this = this;
        this.webSockets.forEach(function (webSocket) {
            _this.sendChain(webSocket, chain);
        });
    };
    Server.prototype.broadcastClear = function () {
        var _this = this;
        this.webSockets.forEach(function (webSocket) {
            _this.clearTxPool(webSocket);
        });
    };
    Server.prototype.broadcastTx = function (transaction) {
        var _this = this;
        this.webSockets.forEach(function (webSocket) {
            _this.sendTransaction(webSocket, transaction);
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=Server.js.map