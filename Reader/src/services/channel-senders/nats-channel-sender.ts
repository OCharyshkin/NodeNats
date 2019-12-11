import IChannelSender from "./channel-sender.interface";
import SendingResult from "../../models/sending/sending-result";
import NatsConfig from "../../models/configs/nats-config";
import DataPortion from "../../models/sending/portions/data-portion";
import {Client} from "nats";

const NATS = require('nats');

class NatsChannelSender implements IChannelSender {

    private natsClient: Client | null = null;

    constructor(private config: NatsConfig) {
    }

    send(dataPortion: DataPortion): Promise<SendingResult> {

        const encodedData = JSON.stringify(dataPortion);

        const client = NATS.connect({url: this.config.url});

        return new Promise<SendingResult>((res, rej) => {

            client.on('error', (err: any) => rej(err));

            const publishCb = () => {

                client.close();
                res(new SendingResult());
            };

            client.publish(this.config.subject, encodedData, publishCb);
        });
    }


}

export default NatsChannelSender;