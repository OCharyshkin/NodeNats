import IChanelSender from "./chanel-sender.interface";
import SendingResult from "../../models/sending/sending-result";
import NatsConfig from "../../models/configs/nats-config";
import DataPortion from "../../models/sending/portions/data-portion";
import {Client} from "nats";

const NATS = require('nats');

class NatsBufferChanelSender implements IChanelSender {

    private natsClient: Client | null = null;

    constructor(private config: NatsConfig) {
    }

    send(dataPortion: DataPortion): Promise<SendingResult> {

        const encodedData = JSON.stringify(dataPortion);

        return new Promise<SendingResult>((res, rej) => {

            const publishCb = () => {

                res(new SendingResult());
            };

            this.getNatsClient()
                .publish(this.config.subject, encodedData, publishCb);
        });
    }

    private getNatsClient(): Client {

        return this.natsClient ?? (this.natsClient = NATS.connect({url: this.config.url}));
    }

}

export default NatsBufferChanelSender;