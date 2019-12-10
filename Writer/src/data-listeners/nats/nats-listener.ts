import IDataListener from "../data-listener.interface";
import NatsConfig from "../../models/configs/nats-config";
import DataProcessor from "../../services/data-processing/data-processor";

const NATS = require('nats');

class NatsListener implements IDataListener {

    constructor(private config: NatsConfig, private dataProcessor: DataProcessor) {
    }

    init(): void {
        const natsClient = NATS.connect({url: this.config.url});

        natsClient.subscribe(this.config.subject, (chunk: string) => {

            this.dataProcessor.processAsync(chunk);
        });
    }
}

export default NatsListener;