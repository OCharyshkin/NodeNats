import DataSender from "../services/data-sender";
import ChannelSenderProvider from "../services/channel-senders/channel-sender-provider";
import ChannelDefinition from "../models/channels/channel-definition";
import ChannelType from "../models/sending/channel-type";
import NatsChannelSender from "../services/channel-senders/nats-channel-sender";
import FileReader from "../services/data-retrieving/file-reader";
import WsChannelSender from "../services/channel-senders/ws-channel-sender";

class DataSenderSupport {

    static init(config: any): DataSender{

        const channelSenderProvider = new ChannelSenderProvider();

        channelSenderProvider.addChannel(new ChannelDefinition(ChannelType.nats,
            () => new NatsChannelSender(config.get('nats'))));

        channelSenderProvider.addChannel(new ChannelDefinition(ChannelType.ws,
            () => new WsChannelSender(config.get('ws'))));

        return  new DataSender(channelSenderProvider, new FileReader());

    }
}

export default DataSenderSupport;