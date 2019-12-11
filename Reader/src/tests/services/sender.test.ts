import DataSender from "../../services/data-sender";
import FileReaderStub from "../stubs/data-retrieving/file-reader.stub";

describe('Sender service', () => {

    const fileReader = new FileReaderStub();

    describe('Sending via Nats', () => {

        it('test', () => {
            expect(1).toBe(1);
        });

    });
});