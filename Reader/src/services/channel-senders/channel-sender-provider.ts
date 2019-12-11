import IChannelSenderProvider from "./channel-sender-provider.interface";
import IChannelSender from "./channel-sender.interface";
import ChannelType from "../../models/sending/channel-type";
import ChannelDefinition from "../../models/channels/channel-definition";

class ChannelSenderProvider implements IChannelSenderProvider {

    private readonly channelDefinitions: ChannelDefinition[] = [];

    private readonly channels: Map<ChannelType, IChannelSender> = new Map<ChannelType, IChannelSender>();

    get(channelType: ChannelType): IChannelSender {

        if (this.channels.has(channelType)) {

            return <IChannelSender>this.channels.get(channelType);
        }

        const definition = this.channelDefinitions.find(x => x.key === channelType);

        if (!definition) {
            throw new Error('Unknown channel: ' + channelType)
        }

        const channel = definition.factory();

        this.channels.set(channelType, channel);

        return  channel;
    }

    addChannel(definition: ChannelDefinition) {
        this.channelDefinitions.push(definition);
    }

}

export default ChannelSenderProvider;