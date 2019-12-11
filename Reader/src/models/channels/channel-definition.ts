import ChannelType from "../sending/channel-type";
import IChannelSender from "../../services/channel-senders/channel-sender.interface";

class ChannelDefinition {

    constructor(public key: ChannelType, public factory: () => IChannelSender) {
    }
}

export default ChannelDefinition;