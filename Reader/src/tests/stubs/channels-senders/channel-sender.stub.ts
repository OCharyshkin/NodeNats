import IChannelSender from "../../../services/channel-senders/channel-sender.interface";
import DataPortion from "../../../models/sending/portions/data-portion";
import SendingResult from "../../../models/sending/sending-result";

class ChannelSenderStub implements IChannelSender {

    private sentPorions: DataPortion[] = [];

    send(dataPortion: DataPortion): Promise<SendingResult> {

        this.sentPorions.push(dataPortion);

        return Promise.resolve(new SendingResult());
    }

    clearSent() {
        this.sentPorions = [];
    }

    getSentPortions(): DataPortion[] {
        return this.sentPorions;
    }

}

export default ChannelSenderStub;