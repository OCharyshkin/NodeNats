import WebsocketListener from "./data-listeners/websocket/websocket-listener";
import NatsListener from "./data-listeners/nats/nats-listener";
import DataProcessor from "./services/data-processing/data-processor";
import FileWriter from "./services/files/FileWriter";

const config = require('config');

const dataProcessor = new DataProcessor(config.get('data-processor'), new FileWriter());

(new NatsListener(config.get('nats'), dataProcessor)).init();
(new WebsocketListener(config.get('http'), dataProcessor)).init();
