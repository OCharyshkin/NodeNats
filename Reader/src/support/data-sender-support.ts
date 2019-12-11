import DataSender from "../services/data-sender";
import ChannelSenderProvider from "../services/channel-senders/channel-sender-provider";
import ChannelDefinition from "../models/channels/channel-definition";
import ChannelType from "../models/sending/channel-type";
import NatsBufferChannelSender from "../services/channel-senders/nats-buffer-channel-sender";
import FileReader from "../services/data-retrieving/file-reader";

class DataSenderSupport {

    static init(config: any): DataSender{

        const channelSenderProvider = new ChannelSenderProvider();

        channelSenderProvider.addChannel(new ChannelDefinition(ChannelType.natsBuffer,
            () => new NatsBufferChannelSender(config.get('nats'))));

        return  new DataSender(channelSenderProvider, new FileReader());

    }
}

export default DataSenderSupport;