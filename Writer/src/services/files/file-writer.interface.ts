interface IFileWriter {
    create(fileName: string): Promise<void>;

    append(fileName: string, data: string): Promise<void>;
}

export default IFileWriter;