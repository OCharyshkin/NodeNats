import DataToSend from "../models/sending/data-to-send";
import IChannelSenderProvider from "./channel-senders/channel-sender-provider.interface";
import DataPortion from "../models/sending/portions/data-portion";
import DataType from "../models/sending/portions/data-type";
import HeadPayload from "../models/sending/portions/payloads/head-payload";
import IChannelSender from "./channel-senders/channel-sender.interface";
import BodyPayload from "../models/sending/portions/payloads/body-payload";
import IFileReader from "./data-retrieving/file-reader.interface";

const uuidv1 = require('uuid/v1');

class DataSender {

    constructor(private channelSenderProvider: IChannelSenderProvider, private fileReader: IFileReader) {
    }

    public async send(dataToSend: DataToSend) {

        const sender = this.channelSenderProvider.get(dataToSend.channel);

        const headPortion = this.getHeadPortion(dataToSend);

        await sender.send(headPortion);

        await this.readAndSendFile(headPortion.sessionId, dataToSend, sender);
    }

    private async readAndSendFile(sessionId: string, dataToSend: DataToSend, sender: IChannelSender) {

        let sequence = 0;

        const onChunkRead = (chunk: Buffer) => {

            const bodyPortoin = this.getBodyPortion(sessionId, chunk, sequence);

            sender.send(bodyPortoin);

            sequence++;
        };

        const onEnd = () => {
            const endPortion = new DataPortion(DataType.end, null, sessionId);

            sender.send(endPortion);
        };

        this.fileReader.read(dataToSend.fileName, onChunkRead, onEnd);
    }

    private getHeadPortion(dataToSend: DataToSend): DataPortion {

        const sessionId = uuidv1();
        const payload = new HeadPayload(dataToSend.fileName);

        return  new DataPortion(DataType.head, payload, sessionId);
    }

    private getBodyPortion(sessionId: string, chunk: Buffer, sequence: number): DataPortion {

        const payload = new BodyPayload(chunk.toString());
        const portion = new DataPortion(DataType.body, payload, sessionId);
        portion.sequence = sequence;

        return portion;
    }
}

export default DataSender