import IChannelSender from "./channel-sender.interface";
import ChannelType from "../../models/sending/channel-type";

interface IChannelSenderProvider {

    get(channel: ChannelType): IChannelSender;
}

export default IChannelSenderProvider;