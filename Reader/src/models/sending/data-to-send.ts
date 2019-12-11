import ChannelType from "./channel-type";

class DataToSend {

    constructor(public channel: ChannelType, public fileName: string) {
    }
}

export default DataToSend;