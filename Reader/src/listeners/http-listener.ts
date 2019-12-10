import HttpConfig from "../models/configs/http-config";
import {IncomingMessage, ServerResponse} from "http";

const http = require('http');

class HttpListener {


    constructor(public config: HttpConfig) {
    }

    init() {
        const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
        });

        server.listen(this.config.port, () => { });
    }
}

export default HttpListener;