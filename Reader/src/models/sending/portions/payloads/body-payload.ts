import PortionPayload from "./portion-payload";

class BodyPayload extends PortionPayload {

    constructor(public data: string) {
        super();
    }
}

export default BodyPayload;