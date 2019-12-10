import DataSender from "./services/data-sender";
import DataToSend from "./models/sending/data-to-send";
import ChanelSenderProvider from "./services/chanel-senders/chanel-sender-provider";
import {IncomingMessage, ServerResponse} from "http";

const http = require('http');
const config = require('config');

const chanelSenderProvider = new ChanelSenderProvider();
const sender = new DataSender(chanelSenderProvider);

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {

    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', () => {
        response.write('OK');
        response.end();

        const jsonBody = JSON.parse(body);

        const dataToSend = new DataToSend(jsonBody.chanel, jsonBody.fileName);

        sender.sendAsync(dataToSend);
    });

});

server.listen(config.get('http').port, () => { });
