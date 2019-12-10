import DataType from "./data-type";
import PortionPayload from "./payloads/portion-payload";

class DataPortion {
    constructor(public type: DataType,
                public payload: PortionPayload | null,
                public sessionId: string,
                public sequence: number = 0) {
    }
}

export default DataPortion;