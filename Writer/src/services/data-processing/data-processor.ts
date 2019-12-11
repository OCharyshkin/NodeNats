import SessionsState from "./sessions-state";
import IFileWriter from "../files/file-writer.interface";
import Session from "../../models/sessions/session";
import DataProcessorConfig from "../../models/configs/data-processor-config";
import DataPortion from "../../models/sending/portions/data-portion";
import DataType from "../../models/sending/portions/data-type";
import BodyPayload from "../../models/sending/portions/payloads/body-payload";
import DataConverter from "./data-converter";
import SessionChunk from "../../models/sessions/session-chunk";

const path = require('path');

class DataProcessor {

    private readonly sessionsState: SessionsState;

    private readonly dataConverter: DataConverter;

    constructor(private config: DataProcessorConfig,
                private readonly fileWriter: IFileWriter) {

        this.sessionsState = new SessionsState();

        this.dataConverter = new DataConverter();
    }

    async process(chunk: string) {
        const portion: DataPortion = JSON.parse(chunk);

        const session = this.sessionsState.getSession(portion);

        await this.applyData(session, portion);
    }


    private async ensureFileExistsAsync(session: Session) {
        if (session.fileCreated) {
            return;
        }

        if (session.fileName === '') {
            return;
        }

        session.fileCreated = true;

        session.fullFileName = path.join(this.config.folderToSave, session.fileName);

        await this.fileWriter.create(session.fullFileName);

        await this.writeQueuedChunks(session);
    }

    private async applyData(session: Session, portion: DataPortion) {

        switch (portion.type) {
            case DataType.head:
                return  await this.ensureFileExistsAsync(session);

            case DataType.body:
                return  await this.addBody(session, portion);

            case DataType.end:
                return  await this.finishSession(session);
        }
    }

    private async addBody(session: Session, portion: DataPortion) {

        const payload: BodyPayload = <BodyPayload>portion.payload;

        const convertedData = await this.dataConverter.convert(payload.data);

        session.addChunkToProcess(new SessionChunk(portion.sequence, convertedData));

        await this.writeQueuedChunks(session);
    }

    private async writeQueuedChunks(session: Session) {

        const chunk = session.getNextChunkToProcess();

        if (!chunk) {
            return;
        }

        if (session.lastWrittenChunkSequence !== chunk.sequence -1 ) {

            return;
        }

        await this.fileWriter.append(session.fullFileName, chunk.data);

        session.lastWrittenChunkSequence = chunk.sequence;

        session.removeNextChunkToProcess();

        await this.writeQueuedChunks(session);
    }

    private async finishSession(session: Session) {

        this.sessionsState.finishSession(session);
    }
}

export default DataProcessor;