import DataToSend from "./models/sending/data-to-send";
import {IncomingMessage, ServerResponse} from "http";
import DataSenderSupport from "./support/data-sender-support";

const http = require('http');
const config = require('config');

const sender = DataSenderSupport.init(config);

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {

    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', () => {
        response.write('OK');
        response.end();

        const jsonBody = JSON.parse(body);

        const dataToSend = new DataToSend(jsonBody.channel, jsonBody.fileName);

        sender.send(dataToSend);
    });

});

server.listen(config.get('http').port, () => { });
