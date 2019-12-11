import IFileReader from "../../../services/data-retrieving/file-reader.interface";

class FileReaderStub implements IFileReader {

    private chunksToSend: Buffer[] = [];


    constructor() {
        this.setDataToSend('');
    }

    read(fileName: string, onChunkRead: (chunk: Buffer) => void, onEnd: () => void): void {

        this.chunksToSend.forEach((chunk) => onChunkRead(chunk));

        onEnd();
    }

    addDataToSend(data: string) {
        this.chunksToSend.push(Buffer.from(data));
    }

    setDataToSend(data: string) {
        this.chunksToSend = [];
        this.addDataToSend(data);
    }


    clearChunksToSend() {
        this.setDataToSend('');
    }


}

export default FileReaderStub;