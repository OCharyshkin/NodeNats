import DataToSend from "../models/sending/data-to-send";
import IChanelSenderProvider from "./chanel-senders/chanel-sender-provider.interface";
import DataPortion from "../models/sending/portions/data-portion";
import DataType from "../models/sending/portions/data-type";
import HeadPayload from "../models/sending/portions/payloads/head-payload";
import IChanelSender from "./chanel-senders/chanel-sender.interface";
import BodyPayload from "../models/sending/portions/payloads/body-payload";

const fs = require('fs');
const uuidv1 = require('uuid/v1');

class DataSender {

    constructor(private chanelSenderProvider: IChanelSenderProvider) {
    }

    public async sendAsync(dataToSend: DataToSend) {

        const sender = this.chanelSenderProvider.get(dataToSend.chanel);

        const headPortion = this.getHeadPortion(dataToSend);

        await sender.send(headPortion);

        await this.readAndSendFileAsync(headPortion.sessionId, dataToSend, sender);
    }

    private async readAndSendFileAsync(sessionId: string, dataToSend: DataToSend, sender: IChanelSender) {

        const readStream = fs.createReadStream(dataToSend.fileName);
        let sequence = 0;

        readStream
            .on('data', (chunk: Buffer) => {

                const bodyPortoin = this.getBodyPortion(sessionId, chunk, sequence);

                sender.send(bodyPortoin);

                sequence++;
            })
            .on('end', () => {
                const endPortion = new DataPortion(DataType.end, null, sessionId);

                sender.send(endPortion);
            });
    }

    private getHeadPortion(dataToSend: DataToSend): DataPortion {

        const sessionId = uuidv1();
        const payload = new HeadPayload(dataToSend.fileName);
        const portion = new DataPortion(DataType.head, payload, sessionId);

        return portion;
    }

    private getBodyPortion(sessionId: string, chunk: Buffer, sequence: number): DataPortion {

        const payload = new BodyPayload(chunk.toString());
        const portion = new DataPortion(DataType.body, payload, sessionId);

        return portion;
    }
}

export default DataSender