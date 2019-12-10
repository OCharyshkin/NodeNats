import PortionPayload from "./portion-payload";

class HeadPayload extends PortionPayload{
    constructor(public fileName: string) {
        super();
    }
}

export default HeadPayload;