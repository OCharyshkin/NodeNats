import IDataListener from "../data-listener.interface";
import {IncomingMessage, ServerResponse} from "http";
import HttpConfig from "../../models/configs/http-config";
import NatsConfig from "../../models/configs/nats-config";
import DataProcessor from "../../services/data-processing/data-processor";

const WebSocketServer = require('websocket').server;
const http = require('http');

class WebsocketListener implements IDataListener {

    constructor(private config: HttpConfig, private dataProcessor: DataProcessor) {
    }

    init(): void {

        const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
        });

        server.listen(this.config.port, () => {
        });

        const wsServer = new WebSocketServer({
            httpServer: server
        });

        wsServer.on('request', (request: any) => {
            const connection = request.accept('echo-protocol', request.origin);

            connection.on('message', (message: any) => {

                this.dataProcessor.process(message.utf8Data);
            });
        });
    }
}

export default WebsocketListener;