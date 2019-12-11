import IChannelSender from "./channel-sender.interface";
import SendingResult from "../../models/sending/sending-result";
import DataPortion from "../../models/sending/portions/data-portion";
import WsConfig from "../../models/configs/ws-config";

const WebSocketClient = require('websocket').client;

class WsChannelSender implements IChannelSender{


    constructor(private readonly config: WsConfig) {
    }

    send(dataPortion: DataPortion): Promise<SendingResult> {

        const encodedData = JSON.stringify(dataPortion);

        return new Promise<SendingResult>((res, rej) => {

            const client = new WebSocketClient();

            client.on('connect', (connection: any) => {
                connection.sendUTF(encodedData);
                res(new SendingResult());
            });

            client.on('connectFailed', function(error: any) {
                rej(error);
            });

            client.connect(this.config.url, 'echo-protocol');
        });
    }

}

export default WsChannelSender;