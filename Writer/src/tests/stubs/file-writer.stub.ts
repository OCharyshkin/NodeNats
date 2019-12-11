import IFileWriter from "../../services/files/file-writer.interface";

class FileWriterStub implements IFileWriter {

    public createdFile: string = '';

    public appendedData: string = '';

    append(fileName: string, data: string): Promise<void> {

        this.appendedData += data;

        return Promise.resolve();
    }

    create(fileName: string): Promise<void> {

        this.createdFile = fileName;

        return Promise.resolve();
    }

    init() {
        this.createdFile = '';
        this.appendedData = '';

    }

}

export default FileWriterStub;