import IFileReader from "../../../services/data-retrieving/file-reader.interface";

class FileReaderStub implements IFileReader {

    read(fileName: string, onChunkRead: (chunk: Buffer) => void, onEnd: () => void): void {
    }

}

export default FileReaderStub;