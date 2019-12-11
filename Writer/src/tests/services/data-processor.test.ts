import DataProcessor from "../../services/data-processing/data-processor";
import DataProcessorConfig from "../../models/configs/data-processor-config";
import FileWriterStub from "../stubs/file-writer.stub";
import DataConverter from "../../services/data-processing/data-converter";
import DataPortion from "../../models/sending/portions/data-portion";
import DataType from "../../models/sending/portions/data-type";
import HeadPayload from "../../models/sending/portions/payloads/head-payload";
import BodyPayload from "../../models/sending/portions/payloads/body-payload";

describe('Data Processor', () => {

    const config = new DataProcessorConfig('test');
    const fileWriter = new FileWriterStub();
    const dataProcessor = new DataProcessor(config, fileWriter, new DataConverter());

    const convertDataPortion = (portion: DataPortion) => JSON.stringify(portion);

    beforeEach(() => {
        fileWriter.init();
    });

    it('Create file', async () => {

        const head = new DataPortion(DataType.head, new HeadPayload('test'), '123');

        await dataProcessor.process(convertDataPortion(head));

        expect(fileWriter.createdFile).toBe('test/test')
    });

    it('Apply conversion', async () => {

        const sessionId = '123';

        const head = new DataPortion(DataType.head, new HeadPayload('test'), sessionId);

        await dataProcessor.process(convertDataPortion(head));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body1'), sessionId, 0)));

        expect(fileWriter.appendedData).toBe('BODY1');
    });

    it('Write data if order correct', async () => {

        const sessionId = '123';

        const head = new DataPortion(DataType.head, new HeadPayload('test'), sessionId);

        await dataProcessor.process(convertDataPortion(head));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body1'), sessionId, 0)));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body2'), sessionId, 1)));

        expect(fileWriter.appendedData).toBe('BODY1BODY2');
    });

    it('Write data if incorrect order and all chunks sent', async () => {

        const sessionId = '123';

        const head = new DataPortion(DataType.head, new HeadPayload('test'), sessionId);

        await dataProcessor.process(convertDataPortion(head));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body2'), sessionId, 1)));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body1'), sessionId, 0)));

        expect(fileWriter.appendedData).toBe('BODY1BODY2');
    });

    it('Do not Write data if incorrect order and not all chunks sent', async () => {

        const sessionId = '123';

        const head = new DataPortion(DataType.head, new HeadPayload('test'), sessionId);

        await dataProcessor.process(convertDataPortion(head));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body2'), sessionId, 3)));

        await dataProcessor.process(convertDataPortion(
            new DataPortion(DataType.body, new BodyPayload('body1'), sessionId, 2)));

        expect(fileWriter.appendedData).toBe('');
    });
});