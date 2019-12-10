import DataChanel from "./data-chanel";

class DataToSend {

    constructor(public chanel: DataChanel, public fileName: string) {
    }
}

export default DataToSend;