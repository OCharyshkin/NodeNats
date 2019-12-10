import IChanelSenderProvider from "./chanel-sender-provider.interface";
import IChanelSender from "./chanel-sender.interface";
import DataChanel from "../../models/sending/data-chanel";
import NatsBufferChanelSender from "./nats-buffer-chanel-sender";

const config = require('config');

class ChanelSenderProvider implements IChanelSenderProvider {

    get(chanel: DataChanel): IChanelSender {

        switch (chanel) {
            case DataChanel.natsBuffer:

                const natsConfig = config.get('nats');

                return new NatsBufferChanelSender(natsConfig);
        }

        throw new Error('Unknown chanel: ' + chanel)
    }

}

export default ChanelSenderProvider;