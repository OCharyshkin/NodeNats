import IDataListener from "../data-listener.interface";
import {IncomingMessage, ServerResponse} from "http";
import HttpConfig from "../../models/configs/http-config";

const WebSocketServer = require('websocket').server;
const http = require('http');

class WebsocketListener implements IDataListener {

    constructor(private config: HttpConfig) {
    }

    init(): void {

        const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
        });

        server.listen(this.config.port, () => { });

        const wsServer = new WebSocketServer({
            httpServer: server
        });
    }
}

export default WebsocketListener;