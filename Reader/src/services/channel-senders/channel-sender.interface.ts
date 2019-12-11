import SendingResult from "../../models/sending/sending-result";
import DataPortion from "../../models/sending/portions/data-portion";

interface IChannelSender {
     send(dataPortion: DataPortion): Promise<SendingResult>;
}

export default IChannelSender;